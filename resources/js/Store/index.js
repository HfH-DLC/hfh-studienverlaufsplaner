import { createStore } from 'vuex'
import DataAdapter from '../DataAdapter'
import PrerequisitesRule from '../Models/Rules/PrerequisitesRule';
import DateRule from '../Models/Rules/DateRule';
import { getRule } from '../Models/Rules/RuleFactory';
import { v4 } from "uuid";
import { getCalendarYear, orderDay, orderSemester, orderTime, orderWeek } from '../helpers';
import emitter from "../emitter";
import flashTypes from "../flashTypes";
import { SAVE_STATUS_SAVED, SAVE_STATUS_SAVING } from "../constants";

let dataAdapter;

const RESET_STATE = "RESET_STATE"
const SET_PLAN = "SET_PLAN"
const SET_CATEGORIES = "SET_CATEGORIES"
const SET_RULES = "SET_RULES"
const SET_SELECTION_STATUS = "SET_SELECTION_STATUS"
const SET_MODULE_INFOS = "SET_MODULE_INFOS"
const SET_PLACEMENT_ERRORS = "SET_PLACEMENT_ERRORS"
const INIT_FINISHED = "INIT_FINISHED"
const ADD_PLACEMENT = "ADD_PLACEMENT"
const REMOVE_PLACEMENT = "REMOVE_PLACEMENT"
export const SET_TOUR_ACTIVE = "SET_TOUR_ACTIVE"
const SET_TOUR_COMPLETED = "SET_TOUR_COMPLETED"
const SET_SAVE_STATUS = "SET_SAVE_STATUS"

const initialState = {
    initialized: false,
    categories: [],
    rules: [],
    selectionStatus: {},
    moduleInfos: {},
    placementErrors: {},
    plan: null,
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

const store = createStore({
    state: initialState,
    mutations: {
        [INIT_FINISHED](state) {
            state.initialized = true
        },
        [RESET_STATE](state) {
            state = initialState
        },
        [SET_PLAN](state, plan) {
            state.plan = plan
        },
        [SET_CATEGORIES](state, categories) {
            state.categories = categories
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
        [ADD_PLACEMENT](state, placement) {
            state.plan.placements.push(placement);
        },
        [REMOVE_PLACEMENT](state, placement) {
            state.plan.placements = state.plan.placements.filter(p => p.id !== placement.id);
        },
        [SET_TOUR_ACTIVE](state, value) {
            state.tourActive = value;
        },
        [SET_TOUR_COMPLETED](state) {
            state.plan.tourCompleted = true;
        },
        [SET_SAVE_STATUS](state, value) {
            state.saveStatus = value
        }
    },
    actions: {
        async init({ commit, dispatch }, { planerSlug, plan, modules, categories, rules }) {
            dataAdapter = new DataAdapter(planerSlug)
            commit(RESET_STATE)
            commit(SET_PLAN, plan)
            commit(SET_CATEGORIES, categories)
            commit(SET_RULES, rules)
            dispatch("validate")
            commit(INIT_FINISHED)
        },
        async save({ state, commit }) {
            try {
                commit(SET_SAVE_STATUS, SAVE_STATUS_SAVING)
                await dataAdapter.savePlan(state.plan);
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
        completeTour({ commit, dispatch }) {
            commit(SET_TOUR_COMPLETED);
            dispatch("save");
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
        placeModule({ commit, dispatch, state, getters }, event) {
            const existingPlacement = state.plan.placements.find(placement => placement.moduleId == state.selectionStatus.moduleId);
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
        validateModules({ commit, state, getters }) {
            const moduleInfos = {}
            const modules = getters.modules;
            modules.forEach(module => {
                moduleInfos[module.id] = validateModule(module.id, modules, getters.placements, state.rules)
            })
            commit(SET_MODULE_INFOS, moduleInfos)
        },
        validatePlacements({ commit, state, getters }) {
            const placementErrors = state.plan.placements.reduce((acc, cur) => {
                acc[cur.id] = []
                return acc
            }, {})
            state.rules.forEach(rule => {
                rule.validatePlacements(getters.placements, placementErrors)
            })
            commit(SET_PLACEMENT_ERRORS, placementErrors)
        },
        setShowTour({ commit }, value) {
            commit(SET_SHOW_TOUR, value);
        }
    },
    getters: {
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
        categories(state) {
            return state.categories.map(category => {
                let categoryModules = category.moduleSelectionEnabled ?
                    category.modules.filter(categoryModule =>
                        state.plan.modules.some(module => module.id === categoryModule.id) ||
                        state.plan.focusSelections.some(focusSelection => focusSelection.selectedOptionalModules.some(module => module.id === categoryModule.id) || focusSelection.focus.requiredModules.some(module => module.id === categoryModule.id))
                    ) : category.modules;

                categoryModules = categoryModules.map(module => {
                    const moduleInfos = state.moduleInfos[module.id]
                    const placement = state.plan.placements.find(placement => placement.moduleId == module.id);
                    const misplaced = !!(placement && state.placementErrors[placement.id] && state.placementErrors[placement.id].length > 0);
                    return {
                        ...module,
                        infos: moduleInfos,
                        selected: state.selectionStatus && state.selectionStatus.moduleId == module.id,
                        placement: placement,
                        misplaced,
                    }
                })


                const requiredNumber = category.requiredNumber != null ? category.requiredNumber : categoryModules.length;
                return {
                    ...category,
                    placedNumber: categoryModules.filter(module => module.placement).length,
                    requiredNumber,
                    modules: categoryModules
                }
            })
        },
        years(state, { modules, placements, optionsWeek, optionsDay, optionsTime }) {
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
        selectedModule(state, { moduleById }) {
            return moduleById(state.selectionStatus.moduleId)
        },
        placements(state, { moduleById }) {
            return state.plan.placements.map(placement => {
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
        }
    }
})

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

export default store