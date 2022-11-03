import DataAdapter from "../DataAdapter";
import emitter from "../emitter";
import flashTypes from "../flashTypes";
import { SAVE_STATUS_SAVED, SAVE_STATUS_SAVING } from "../constants";
import { getRule } from "../Models/Rules/RuleFactory";
import { getTodo } from "../Models/Todos/Credit/TodoFactory";

const initialState = {
    focusSelections: [],
    initialized: false,
    modules: [],
    rules: [],
    errors: [],
    tour: null,
    tourActive: false,
    tourCompleted: false,
    valid: false,
    readOnly: false,
};

const CREDIT_MODULE = "CREDIT_MODULE";
const INIT_FINISHED = "INIT_FINISHED";
const SET_ERRORS = "SET_ERRORS";
const SET_FOCUS_SELECTIONS = "SET_FOCUS_SELECTIONS";
const SET_MODULES = "SET_MODULES";
const SET_RULES = "SET_RULES";
const SET_SAVE_STATUS = "SET_SAVE_STATUS";
const SET_TODOS = "SET_TODOS";
const SET_TODO_ENTRIES = "SET_TODO_ENTRIES";
const RESET_STATE = "RESET_STATE";
const SET_TOUR_ACTIVE = "SET_TOUR_ACTIVE";
const SET_TOUR = "SET_TOUR";
const SET_TOUR_COMPLETED = "SET_TOUR_COMPLETED";
const SET_VALID = "SET_VALID";
const SET_READ_ONLY = "SET_READ_ONLY";

let dataAdapter;

export default {
    namespaced: true,
    state: initialState,
    mutations: {
        [CREDIT_MODULE](state, { moduleId, focusSelectionId }) {
            state.modules = state.modules.map((module) => {
                if (module.id == moduleId) {
                    module.creditedAgainst = focusSelectionId;
                }
                return module;
            });
        },
        [INIT_FINISHED](state) {
            state.initialized = true;
        },
        [SET_ERRORS](state, errors) {
            state.errors = errors;
        },
        [SET_FOCUS_SELECTIONS](state, focusSelections) {
            state.focusSelections = focusSelections;
        },
        [SET_MODULES](state, modules) {
            state.modules = modules;
        },
        [SET_RULES](state, rules) {
            const ruleObjects = rules.reduce((array, rule) => {
                try {
                    array.push(getRule(state, rule));
                } catch (error) {
                    console.error(error);
                }
                return array;
            }, []);
            state.rules = ruleObjects;
        },
        [SET_SAVE_STATUS](state, value) {
            state.saveStatus = value;
        },
        [SET_TODOS](state, todos) {
            const todoObjects = todos.reduce((array, rule) => {
                try {
                    array.push(getTodo(state, rule));
                } catch (error) {
                    console.error(error);
                }
                return array;
            }, []);
            state.todos = todoObjects;
        },
        [SET_TODO_ENTRIES](state, todoEntries) {
            state.todoEntries = todoEntries;
        },
        [RESET_STATE](state) {
            state = initialState;
        },
        [SET_TOUR](state, value) {
            state.tour = value;
        },
        [SET_TOUR_ACTIVE](state, value) {
            state.tourActive = value;
        },
        [SET_TOUR_COMPLETED](state, value) {
            state.tourCompleted = value;
        },
        [SET_VALID](state, value) {
            state.valid = value;
        },
        [SET_READ_ONLY](state, value) {
            state.readOnly = value;
        },
    },
    actions: {
        init(
            { commit, dispatch },
            { planerSlug, plan, modules, focusSelections, rules, todos, tour }
        ) {
            dataAdapter = new DataAdapter(planerSlug, plan.slug);

            commit(RESET_STATE);
            commit(SET_READ_ONLY, plan.readOnly);
            commit(SET_FOCUS_SELECTIONS, focusSelections);
            commit(SET_MODULES, modules);
            commit(SET_TODOS, todos);
            commit(SET_RULES, rules);
            commit(SET_TOUR, tour);
            commit(SET_TOUR_COMPLETED, plan.creditTourCompleted);
            dispatch("validate");
            commit(INIT_FINISHED);
        },
        async creditModuleAgainstFocusSelection(
            { commit, dispatch },
            { moduleId, focusSelectionId }
        ) {
            commit(CREDIT_MODULE, { moduleId, focusSelectionId });
            dispatch("validate");
            await dispatch("save");
        },
        startTour({ commit, dispatch }) {
            commit(SET_TOUR_ACTIVE, true);
            dispatch("save");
        },
        completeTour({ commit, dispatch }) {
            commit(SET_TOUR_ACTIVE, false);
            commit(SET_TOUR_COMPLETED, true);
            dispatch("save");
        },
        validate({ state, commit, dispatch }) {
            dispatch("validateRules");
            dispatch("validateTodos");
            const valid =
                state.errors.length == 0 &&
                state.todoEntries.every((todo) => todo.checked);
            commit(SET_VALID, valid);
        },
        validateRules({ state, getters, commit }) {
            const errors = [];
            state.rules.forEach((rule) => {
                rule.validate(state, getters, errors);
            });
            commit(SET_ERRORS, errors);
        },
        validateTodos({ commit, state, getters }) {
            const todoEntries = state.todos.reduce((acc, cur) => {
                acc.push(...cur.getEntries(state, getters));
                return acc;
            }, []);
            commit(SET_TODO_ENTRIES, todoEntries);
        },
        async save({ state, commit, getters }) {
            try {
                commit(SET_SAVE_STATUS, SAVE_STATUS_SAVING);
                await dataAdapter.saveCredit(
                    getters.creditedModulesByFocusSelection,
                    state.tourCompleted,
                    state.valid
                );
                commit(SET_SAVE_STATUS, SAVE_STATUS_SAVED);
                return true;
            } catch (error) {
                commit(SET_SAVE_STATUS, null);
                emitter.emit("flash", {
                    type: flashTypes.ERROR,
                    message:
                        "Beim automatischen Speichern Ihres Plans ist ein Fehler aufgetreten.",
                    actionMessage: "Erneut versuchen",
                    actionEvent: "retry-save",
                });
                console.error(error);
                return false;
            }
        },
    },
    getters: {
        creditedModulesByFocusSelection(state) {
            return state.focusSelections.reduce((acc, cur) => {
                acc.push({
                    focusSelectionId: cur.id,
                    moduleIds: state.modules
                        .filter((module) => module.creditedAgainst == cur.id)
                        .map((module) => module.id),
                });
                return acc;
            }, []);
        },
    },
};
