import DataAdapter from "../DataAdapter";
import emitter from "../emitter";
import flashTypes from "../flashTypes";
import { SAVE_STATUS_SAVED, SAVE_STATUS_SAVING } from "../constants";
import { getRule } from "../Models/Rules/RuleFactory";

const initialState = {
    focusSelections: [],
    initialized: false,
    modules: [],
    rules: [],
    errors: [],
};

const CREDIT_MODULE = "CREDIT_MODULE";
const INIT_FINISHED = "INIT_FINISHED";
const SET_ERRORS = "SET_ERRORS";
const SET_FOCUS_SELECTIONS = "SET_FOCUS_SELECTIONS";
const SET_MODULES = "SET_MODULES";
const SET_RULES = "SET_RULES";
const SET_SAVE_STATUS = "SET_SAVE_STATUS";
const RESET_STATE = "RESET_STATE";

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
        [RESET_STATE](state) {
            state = initialState;
        },
    },
    actions: {
        init(
            { commit, dispatch },
            { planerSlug, plan, modules, focusSelections, rules }
        ) {
            dataAdapter = new DataAdapter(planerSlug, plan.slug);

            commit(RESET_STATE);
            commit(SET_FOCUS_SELECTIONS, focusSelections);
            commit(SET_MODULES, modules);
            commit(SET_RULES, rules);
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
        validate({ state, commit, getters }) {
            const errors = [];
            state.rules.forEach((rule) => {
                rule.validate(state, getters, errors);
            });
            commit(SET_ERRORS, errors);
        },
        async save({ state, commit, getters }) {
            try {
                commit(SET_SAVE_STATUS, SAVE_STATUS_SAVING);
                await dataAdapter.saveFocusCredits(
                    getters.creditedModulesByFocusSelection
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
