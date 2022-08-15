import { v4 } from "uuid";

import DataAdapter from '../DataAdapter'
import emitter from "../emitter";
import flashTypes from "../flashTypes";
import { SAVE_STATUS_SAVED, SAVE_STATUS_SAVING } from "../constants";
import PrerequisitesRule from '../Models/Rules/PrerequisitesRule';
import DateRule from '../Models/Rules/DateRule';
import { getRule } from '../Models/Rules/RuleFactory';
import { getCalendarYear, orderDay, orderSemester, orderTime, orderWeek } from '../helpers';

const RESET_STATE = "RESET_STATE"
const SET_RULES = "SET_RULES"
const INIT_FINISHED = "INIT_FINISHED"
const SET_MODULE_INFOS = "SET_MODULE_INFOS"
const SET_SELECTION_STATUS = "SET_SELECTION_STATUS"
const ADD_PLACEMENT = "ADD_PLACEMENT"
const SET_PLACEMENTS = "SET_PLACEMENTS"
const REMOVE_PLACEMENT = "REMOVE_PLACEMENT"
const SET_PLACEMENT_ERRORS = "SET_PLACEMENT_ERRORS"

export const SET_TOUR_ACTIVE = "SET_TOUR_ACTIVE"
const SET_TOUR_COMPLETED = "SET_TOUR_COMPLETED"
const SET_SAVE_STATUS = "SET_SAVE_STATUS"

let dataAdapter;

const initialState = {
    placements: [],
    rules: [],
    selectionStatus: {},
    moduleInfos: {},
    placementErrors: {},
    initialized: false,
    saveStatus: SAVE_STATUS_SAVED,
    //tour
    tourActive: false,
    tourSelectedModule: {
        id: "P1_01",
        name: "Grundfragen der Heilpädagogik",
        prerequisites: [],
        infos: [],
        credits: 5
    },
}

export default {
    namespaced: true,
    state: initialState,
    mutations: {
        [RESET_STATE](state) {
            state = initialState
        },
        [INIT_FINISHED](state) {
            state.initialized = true
        },
        [SET_RULES](state, rules) {
            const ruleObjects = rules.reduce((array, rule) => {
                try {
                    array.push(getRule(state, rule));
                } catch (error) {
                    console.error(error)
                }
                return array;
            }, [])
            ruleObjects.push(
                new DateRule(),
                new PrerequisitesRule()
            );
            state.rules = ruleObjects
        },
        [SET_SELECTION_STATUS](state, selectionStatus) {
            state.selectionStatus = selectionStatus
        },
        [SET_MODULE_INFOS](state, moduleInfos) {
            state.moduleInfos = moduleInfos
        },
        [SET_PLACEMENT_ERRORS](state, placementErrors) {
            state.placementErrors = placementErrors
        },
        [SET_PLACEMENTS](state, placements) {
            state.placements = placements;
        },
        [ADD_PLACEMENT](state, placement) {
            state.placements.push(placement);
        },
        [REMOVE_PLACEMENT](state, placement) {
            state.placements = state.placements.filter(p => p.id !== placement.id);
        },
        [SET_TOUR_ACTIVE](state, value) {
            state.tourActive = value;
        },
        [SET_TOUR_COMPLETED](state) {
            state.tourCompleted = true;
        },
        [SET_SAVE_STATUS](state, value) {
            state.saveStatus = value
        }
    },
    actions: {
        async init({ commit, dispatch }, { planerSlug, plan, categories, rules }) {
            dataAdapter = new DataAdapter(planerSlug, plan.slug);
            dispatch("init", { plan, categories }, { root: true });
            commit(RESET_STATE);
            commit(SET_PLACEMENTS, plan.placements)
            commit(SET_TOUR_COMPLETED, plan.tourCompleted);
            commit(SET_RULES, rules)
            dispatch("validate")
            commit(INIT_FINISHED);
        },
        async save({ state, commit }) {
            try {
                commit(SET_SAVE_STATUS, SAVE_STATUS_SAVING)
                await dataAdapter.saveSchedule(state.placements, state.tourCompleted);
                commit(SET_SAVE_STATUS, SAVE_STATUS_SAVED)
                return true;
            } catch (error) {
                commit(SET_SAVE_STATUS, null)
                emitter.emit('flash', {
                    type: flashTypes.ERROR,
                    message: "Beim automatischen Speichern Ihres Plans ist ein Fehler aufgetreten.",
                    actionMessage: "Erneut versuchen",
                    actionEvent: "retry-save"
                })
                console.error(error);
                return false;
            }
        },
        selectModule({ commit, state, getters }, moduleId) {
            commit(SET_SELECTION_STATUS, {
                moduleId,
                status: validateSelection(moduleId, getters.modules, getters.placements, state.rules)
            })
        },
        deselectModule({ commit }) {
            commit(SET_SELECTION_STATUS, {
                moduleId: null,
                status: {}
            })
        },
        placeModule({ commit, dispatch, state }, event) {
            const existingPlacement = state.placements.find(placement => placement.moduleId == state.selectionStatus.moduleId);
            if (existingPlacement) {
                commit(REMOVE_PLACEMENT, existingPlacement);
            }
            commit(ADD_PLACEMENT, {
                id: v4(),
                moduleId: state.selectionStatus.moduleId,
                year: event.year,
                semester: event.semester,
                week: event.week,
                day: event.day,
                time: event.time,
                location: event.location
            })
            dispatch("deselectModule")
            dispatch("validate")
            dispatch("save");
        },
        removeModule({ commit, dispatch, state }, placement) {
            commit(REMOVE_PLACEMENT, placement)
            dispatch("deselectModule")
            dispatch("validate")
            dispatch("save")

        },
        validate({ dispatch }) {
            dispatch("validateModules")
            dispatch("validatePlacements")
        },
        validateModules({ commit, state, getters, rootGetters }) {
            const moduleInfos = {}
            const modules = rootGetters.modules;
            modules.forEach(module => {
                moduleInfos[module.id] = validateModule(module.id, modules, getters.placements, state.rules)
            })
            commit(SET_MODULE_INFOS, moduleInfos)
        },
        validatePlacements({ commit, state, getters }) {
            const placementErrors = state.placements.reduce((acc, cur) => {
                acc[cur.id] = []
                return acc
            }, {})
            state.rules.forEach(rule => {
                rule.validatePlacements(getters.placements, placementErrors)
            })
            commit(SET_PLACEMENT_ERRORS, placementErrors)
        },
        completeTour({ commit, dispatch }) {
            commit(SET_TOUR_COMPLETED);
            dispatch("save");
        },
        setShowTour({ commit }, value) {
            commit(SET_SHOW_TOUR, value);
        }
    },
    getters: {
        categories(state, getters, rootState, { categories }) {
            return categories.map(category => {
                const categoryModules = category.modules.map(module => {
                    const moduleInfos = state.moduleInfos[module.id]
                    const placement = state.placements.find(placement => placement.moduleId == module.id);
                    const misplaced = !!(placement && state.placementErrors[placement.id] && state.placementErrors[placement.id].length > 0);
                    return {
                        ...module,
                        infos: moduleInfos,
                        selected: state.selectionStatus && state.selectionStatus.moduleId == module.id,
                        placement: placement,
                        misplaced,
                    }
                })
                return {
                    ...category,
                    placedNumber: categoryModules.filter(module => module.placement).length,
                    modules: categoryModules
                }
            })
        },
        credits(state, { placements }) {
            return placements.map(placements => placements.module).reduce((total, module) => module ? total + module.credits : total, 0)
        },
        modules(state, { categories }) {
            return categories.reduce((acc, cur) => {
                acc.push(...cur.modules);
                return acc;
            }, []);
        },
        moduleById: (state, { modules }) => (id) => {
            return modules.find(module => module.id == id)
        },
        selectedModule(state, { moduleById }, ) {
            return moduleById(state.selectionStatus.moduleId)
        },
        placements(state, getters, rootState, { moduleById }) {
            return state.placements.map(placement => {
                return {
                    ...placement,
                    module: moduleById(placement.moduleId),
                    errors: state.placementErrors[placement.id]
                }
            })
        },
        placementById: (state, { placements }) => (id) => {
            return placements.find(placements => placements.id == id)
        },
        placementByDate: (state, { placements }) => (year, semester, week, day, time) => {
            return placements.find((placement) => {
                return (
                    placement.year == year &&
                    placement.semester == semester &&
                    placement.week == week &&
                    placement.day == day &&
                    placement.time == time
                );
            });
        },
        placementErrors(state, { placementById }) {
            const result = [];
            Object.entries(state.placementErrors).forEach(([placementId, errors]) => {
                const placement = placementById(placementId);
                errors.forEach(error => {
                    result.push({
                        placement,
                        text: error
                    })
                })
            });
            return result;
        },
        years(state, { placements, modules }) {
            const events = modules.reduce((acc, cur) => {
                acc.push(...cur.events)
                return acc
            }, []);
            const dates = [...events, ...placements];
            const years = [
                ...new Set(
                    dates.map((date) => date.year)
                ),
            ].sort()
            return years.sort((a, b) => a - b).map((year) => {
                const yearDates = dates.filter(date => date.year === year);
                const semesters = [...new Set(yearDates.map((date) => date.semester))].sort(orderSemester).map(semester => {
                    const semesterDates = yearDates.filter(date => date.semester === semester);
                    return {
                        value: semester,
                        calendarYear: getCalendarYear(semester, year),
                        weeks: [...new Set(semesterDates.map((date) => date.week))].sort(orderWeek),
                        days: [...new Set(semesterDates.map((date) => date.day))].sort(orderDay),
                        times: [...new Set(semesterDates.map((date) => date.time))].sort(orderTime),
                    }
                });

                return {
                    value: year,
                    semesters
                }
            })
        },
        selectableEvents(state, { selectedModule }) {
            if (!selectedModule) {
                return [];
            }
            return selectedModule.events.filter(event => {
                const status = state.selectionStatus.status[event.id];
                return status.dateAllowed
            }).map(event => {
                const status = state.selectionStatus.status[event.id];
                return {
                    ...event,
                    valid: status.valid
                }
            });
        },
        selectableEventByDate: (state, { selectableEvents }) => (year, semester, week, day, time) => {
            const result = selectableEvents.find((event) => {
                return (
                    event.year == year &&
                    event.semester == semester &&
                    event.week == week &&
                    event.day == day &&
                    event.time == time
                );
            });
            return result;
        },
    }
}

function getStatus(events) {
    return events.reduce((acc, cur) => {
        acc[cur.id] = {
            valid: true,
            dateAllowed: true
        }
        return acc
    }, {})
}

function validateModule(moduleId, modules, placements, rules) {
    const module = modules.find(module => module.id == moduleId);
    const errors = [];
    rules.forEach(rule => {
        rule.validateModule(module, placements, errors)
    })
    return errors
}

function validateSelection(moduleId, modules, placements, rules) {
    const module = modules.find(module => module.id == moduleId);
    const status = getStatus(module.events);
    rules.forEach(rule => {
        rule.validateSelection(module, placements, status)
    })
    return status
}