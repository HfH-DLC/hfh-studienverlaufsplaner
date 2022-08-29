import { v4 } from "uuid";

import DataAdapter from "../DataAdapter";
import emitter from "../emitter";
import flashTypes from "../flashTypes";
import { SAVE_STATUS_SAVED, SAVE_STATUS_SAVING } from "../constants";
import { getRule } from "../Models/Rules/RuleFactory";
import {
    getCalendarYear,
    orderDay,
    orderSemester,
    orderTime,
    orderTimeWindow,
} from "../helpers";

const RESET_STATE = "RESET_STATE";
const SET_RULES = "SET_RULES";
const INIT_FINISHED = "INIT_FINISHED";
const SET_MODULE_INFOS = "SET_MODULE_INFOS";
const SET_SELECTION_STATUS = "SET_SELECTION_STATUS";
const ADD_PLACEMENT = "ADD_PLACEMENT";
const SET_PLACEMENTS = "SET_PLACEMENTS";
const REMOVE_PLACEMENT = "REMOVE_PLACEMENT";
const SET_PLACEMENT_ERRORS = "SET_PLACEMENT_ERRORS";
const SET_GLOBAL_ERRORS = "SET_GLOBAL_ERRORS";
const SET_FOCI = "SET_FOCI";
const SET_FOCUS_SELECTIONS = "SET_FOCUS_SELECTIONS";
const SELECT_FOCUS = "SELECT_FOCUS";
const SET_START_YEAR = "SET_START_YEAR";
const SET_CATEGORIES = "SET_CATEGORIES";
export const SET_TOUR_ACTIVE = "SET_TOUR_ACTIVE";
const SET_TOUR_COMPLETED = "SET_TOUR_COMPLETED";
const SET_SAVE_STATUS = "SET_SAVE_STATUS";

let dataAdapter;

const initialState = {
    startYear: null,
    categories: [],
    placements: [],
    focusSelections: [],
    rules: [],
    foci: [],
    selectionStatus: {},
    moduleInfos: {},
    placementErrors: {},
    globalErrors: [],
    initialized: false,
    saveStatus: SAVE_STATUS_SAVED,
    //tour
    tourActive: false,
    tourSelectedModule: {
        id: "P1_01",
        name: "Grundfragen der Heilpädagogik",
        prerequisites: [],
        infos: [],
        ects: 5,
    },
};

export default {
    namespaced: true,
    state: initialState,
    mutations: {
        [RESET_STATE](state) {
            state = initialState;
        },
        [INIT_FINISHED](state) {
            state.initialized = true;
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
        [SET_SELECTION_STATUS](state, selectionStatus) {
            state.selectionStatus = selectionStatus;
        },
        [SET_MODULE_INFOS](state, moduleInfos) {
            state.moduleInfos = moduleInfos;
        },
        [SET_PLACEMENT_ERRORS](state, placementErrors) {
            state.placementErrors = placementErrors;
        },
        [SET_GLOBAL_ERRORS](state, globalErrors) {
            state.globalErrors = globalErrors;
        },
        [SET_PLACEMENTS](state, placements) {
            state.placements = placements;
        },
        [ADD_PLACEMENT](state, placement) {
            state.placements.push(placement);
        },
        [REMOVE_PLACEMENT](state, placement) {
            state.placements = state.placements.filter(
                (p) => p.id !== placement.id
            );
        },
        [SET_TOUR_ACTIVE](state, value) {
            state.tourActive = value;
        },
        [SET_TOUR_COMPLETED](state) {
            state.tourCompleted = true;
        },
        [SET_SAVE_STATUS](state, value) {
            state.saveStatus = value;
        },
        [SET_FOCI](state, foci) {
            state.foci = foci;
        },
        [SET_FOCUS_SELECTIONS](state, focusSelections) {
            state.focusSelections = focusSelections;
        },
        [SELECT_FOCUS](state, { position, focusId }) {
            state.focusSelections = state.focusSelections.filter(
                (f) => f.position != position
            );
            if (focusId) {
                state.focusSelections.push({ position, focusId });
            }
        },
        [SET_CATEGORIES](state, categories) {
            state.categories = categories;
        },
        [SET_START_YEAR](state, startYear) {
            state.startYear = startYear;
        },
    },
    actions: {
        init(
            { commit, dispatch },
            { planerSlug, plan, categories, rules, foci }
        ) {
            dataAdapter = new DataAdapter(planerSlug, plan.slug);
            commit(RESET_STATE);
            commit(SET_CATEGORIES, categories);
            commit(SET_FOCI, foci);
            commit(SET_FOCUS_SELECTIONS, plan.focusSelections);
            commit(SET_PLACEMENTS, plan.placements);
            commit(SET_RULES, rules);
            commit(SET_START_YEAR, plan.startYear);
            commit(SET_TOUR_COMPLETED, plan.tourCompleted);
            dispatch("validate");
            commit(INIT_FINISHED);
        },
        async save({ state, commit }) {
            try {
                commit(SET_SAVE_STATUS, SAVE_STATUS_SAVING);
                await dataAdapter.saveSchedule(
                    state.placements,
                    state.focusSelections,
                    state.tourCompleted
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
        selectModule({ commit, state, getters }, moduleId) {
            commit(SET_SELECTION_STATUS, {
                moduleId,
                status: validateSelection(
                    getters.moduleById(moduleId),
                    state,
                    getters
                ),
            });
        },
        deselectModule({ commit }) {
            commit(SET_SELECTION_STATUS, {
                moduleId: null,
                status: {},
            });
        },
        placeModule({ commit, dispatch, state }, event) {
            const existingPlacement = state.placements.find(
                (placement) =>
                    placement.moduleId == state.selectionStatus.moduleId
            );
            if (existingPlacement) {
                commit(REMOVE_PLACEMENT, existingPlacement);
            }
            commit(ADD_PLACEMENT, {
                id: v4(),
                moduleId: state.selectionStatus.moduleId,
                year: event.year,
                semester: event.semester,
                timeWindow: event.timeWindow,
                day: event.day,
                time: event.time,
                location: event.location,
            });
            dispatch("deselectModule");
            dispatch("validate");
            dispatch("save");
        },
        removeModule({ commit, dispatch }, placement) {
            commit(REMOVE_PLACEMENT, placement);
            dispatch("deselectModule");
            dispatch("validate");
            dispatch("save");
        },
        selectFocus({ commit, dispatch }, { position, focusId }) {
            commit(SELECT_FOCUS, { position, focusId });
            dispatch("validate");
            dispatch("save");
        },
        validate({ dispatch }) {
            dispatch("validateGlobal");
            dispatch("validateModules");
            dispatch("validatePlacements");
        },
        validateGlobal({ commit, state, getters }) {
            const globalErrors = [];
            state.rules.forEach((rule) => {
                rule.validateGlobal(state, getters, globalErrors);
            });
            commit(SET_GLOBAL_ERRORS, globalErrors);
        },
        validateModules({ commit, state, getters }) {
            const moduleInfos = {};
            const modules = getters.modules;
            modules.forEach((module) => {
                moduleInfos[module.id] = validateModule(module, state, getters);
            });
            commit(SET_MODULE_INFOS, moduleInfos);
        },
        validatePlacements({ commit, state, getters }) {
            const placementErrors = state.placements.reduce((acc, cur) => {
                acc[cur.id] = [];
                return acc;
            }, {});
            state.rules.forEach((rule) => {
                rule.validatePlacements(state, getters, placementErrors);
            });
            commit(SET_PLACEMENT_ERRORS, placementErrors);
        },
        completeTour({ commit, dispatch }) {
            commit(SET_TOUR_COMPLETED);
            dispatch("save");
        },
        setShowTour({ commit }, value) {
            commit(SET_SHOW_TOUR, value);
        },
    },
    getters: {
        categories(state) {
            return state.categories.map((category) => {
                const categoryModules = category.modules.map((module) => {
                    const moduleInfos = state.moduleInfos[module.id];
                    const placement = state.placements.find(
                        (placement) => placement.moduleId == module.id
                    );
                    const misplaced = !!(
                        placement &&
                        state.placementErrors[placement.id] &&
                        state.placementErrors[placement.id].length > 0
                    );
                    return {
                        ...module,
                        infos: moduleInfos,
                        selected:
                            state.selectionStatus &&
                            state.selectionStatus.moduleId == module.id,
                        placement: placement,
                        misplaced,
                    };
                });
                const requiredNumber =
                    category.requiredNumber != null
                        ? category.requiredNumber
                        : category.modules.length;
                const currentECTS = categoryModules.reduce((acc, cur) => {
                    if (cur.placement) {
                        acc += cur.ects;
                    }
                    return acc;
                }, 0);

                return {
                    ...category,
                    placedNumber: categoryModules.filter(
                        (module) => module.placement
                    ).length,
                    modules: categoryModules,
                    requiredNumber,
                    currentECTS,
                };
            });
        },
        ects(state, { placements }) {
            return placements
                .map((placements) => placements.module)
                .reduce(
                    (total, module) => (module ? total + module.ects : total),
                    0
                );
        },
        modules(state, { categories }) {
            return categories.reduce((acc, cur) => {
                acc.push(...cur.modules);
                return acc;
            }, []);
        },
        moduleById:
            (state, { modules }) =>
            (id) => {
                return modules.find((module) => module.id == id);
            },
        selectedModule(state, { moduleById }) {
            return moduleById(state.selectionStatus.moduleId);
        },
        placements(state, { moduleById }) {
            return state.placements.map((placement) => {
                return {
                    ...placement,
                    module: moduleById(placement.moduleId),
                    errors: state.placementErrors[placement.id],
                };
            });
        },
        placementById:
            (state, { placements }) =>
            (id) => {
                return placements.find((placements) => placements.id == id);
            },
        placementByDate:
            (state, { placements }) =>
            (year, semester, timeWindow, day, time) => {
                return placements.find((placement) => {
                    return (
                        placement.year == year &&
                        placement.semester == semester &&
                        placement.timeWindow == timeWindow &&
                        placement.day == day &&
                        placement.time == time
                    );
                });
            },
        placementErrors(state, { placementById }) {
            const result = [];
            Object.entries(state.placementErrors).forEach(
                ([placementId, errors]) => {
                    const placement = placementById(placementId);
                    errors.forEach((error) => {
                        result.push({
                            placement,
                            text: error,
                        });
                    });
                }
            );
            return result;
        },
        years(state, { placements, modules }) {
            const events = modules.reduce((acc, cur) => {
                acc.push(...cur.events);
                return acc;
            }, []);
            const dates = [...events, ...placements];
            const years = [...new Set(dates.map((date) => date.year))].sort();
            return years
                .sort((a, b) => a - b)
                .map((year) => {
                    const yearDates = dates.filter(
                        (date) => date.year === year
                    );
                    const semesters = [
                        ...new Set(yearDates.map((date) => date.semester)),
                    ]
                        .sort(orderSemester)
                        .map((semester) => {
                            const semesterDates = yearDates.filter(
                                (date) => date.semester === semester
                            );
                            return {
                                value: semester,
                                calendarYear: getCalendarYear(semester, year),
                                timeWindows: [
                                    ...new Set(
                                        semesterDates.map(
                                            (date) => date.timeWindow
                                        )
                                    ),
                                ].sort(orderTimeWindow),
                                days: [
                                    ...new Set(
                                        semesterDates.map((date) => date.day)
                                    ),
                                ].sort(orderDay),
                                times: [
                                    ...new Set(
                                        semesterDates.map((date) => date.time)
                                    ),
                                ].sort(orderTime),
                            };
                        });

                    return {
                        value: year,
                        semesters,
                    };
                });
        },
        selectableEvents(state, { selectedModule }) {
            if (!selectedModule) {
                return [];
            }
            return selectedModule.events
                .filter((event) => {
                    const status = state.selectionStatus.status[event.id];
                    return status.dateAllowed;
                })
                .map((event) => {
                    const status = state.selectionStatus.status[event.id];
                    return {
                        ...event,
                        valid: status.valid,
                    };
                });
        },
        selectableEventByDate:
            (state, { selectableEvents }) =>
            (year, semester, timeWindow, day, time) => {
                const result = selectableEvents.find((event) => {
                    return (
                        event.year == year &&
                        event.semester == semester &&
                        event.timeWindow == timeWindow &&
                        event.day == day &&
                        event.time == time
                    );
                });
                return result;
            },
    },
};

function getStatus(events) {
    return events.reduce((acc, cur) => {
        acc[cur.id] = {
            valid: true,
            dateAllowed: true,
        };
        return acc;
    }, {});
}

function validateModule(module, state, getters) {
    const errors = [];
    state.rules.forEach((rule) => {
        rule.validateModule(module, state, getters, errors);
    });
    return errors;
}

function validateSelection(module, state, getters) {
    const status = getStatus(module.events);
    state.rules.forEach((rule) => {
        rule.validateSelection(module, state, getters, status);
    });
    return status;
}
