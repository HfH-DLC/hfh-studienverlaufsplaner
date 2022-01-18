import { createStore } from 'vuex'
import DataAdapter from '../DataAdapter'
import PrerequisitesRule from '../Models/Rules/PrerequisitesRule';
import DateRule from '../Models/Rules/DateRule';
import { getRule } from '../Models/Rules/RuleFactory';

let dataAdapter;

const RESET_STATE = "RESET_STATE"
const SET_PLAN = "SET_PLAN"
const SET_TIMESLOTS = "SET_TIMESLOTS"
const SET_MODULES = "SET_MODULES"
const SET_CATEGORIES = "SET_CATEGORIES"
const SET_RULES = "SET_RULES"
const SET_DATE_OPTIONS = "SET_DATE_OPTIONS"
const SET_SELECTION_STATUS = "SET_SELECTION_STATUS"
const SET_MODULE_ERRORS = "SET_MODULE_ERRORS"
const SET_TIMESLOT_ERRORS = "SET_TIMESLOTE_ERROS"
const INIT_FINISHED = "INIT_FINISHED"
const ADD_PLACEMENT = "ADD_PLACEMENT"
const REMOVE_PLACEMENT = "REMOVE_PLACEMENT"

const initialState = {
    initialized: false,
    timeSlots: [],
    modules: [],
    categories: [],
    rules: [],
    optionsWeek: [],
    optionsDay: [],
    optionsTime: [],
    selectionStatus: {},
    moduleErrors: {},
    timeSlotErrors: {},
    plan: null,
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
        [SET_TIMESLOTS](state, timeSlots) {
            state.timeSlots = timeSlots
        },
        [SET_MODULES](state, modules) {
            state.modules = modules
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
            ruleObjects.push(new DateRule(), new PrerequisitesRule());
            state.rules = ruleObjects
        },
        [SET_DATE_OPTIONS](state, { optionsWeek, optionsDay, optionsTime }) {
            state.optionsWeek = optionsWeek;
            state.optionsDay = optionsDay;
            state.optionsTime = optionsTime;
        },
        [SET_SELECTION_STATUS](state, selectionStatus) {
            state.selectionStatus = selectionStatus
        },
        [SET_MODULE_ERRORS](state, moduleErrors) {
            state.moduleErrors = moduleErrors
        },
        [SET_TIMESLOT_ERRORS](state, timeSlotErrors) {
            state.timeSlotErrors = timeSlotErrors
        },
        [ADD_PLACEMENT](state, placement) {
            state.plan.placements.push(placement);
        },
        [REMOVE_PLACEMENT](state, timeSlotId) {
            state.plan.placements = state.plan.placements.filter(placement => placement.timeSlotId !== timeSlotId);
        }
    },
    actions: {
        async init({ commit, dispatch }, { planerSlug, plan, timeSlots, modules, categories, rules, optionsWeek, optionsDay, optionsTime }) {
            dataAdapter = new DataAdapter(planerSlug)
            commit(RESET_STATE)
            commit(SET_PLAN, plan)
            commit(SET_TIMESLOTS, timeSlots)
            commit(SET_MODULES, modules)
            commit(SET_CATEGORIES, categories)
            commit(SET_RULES, rules)
            commit(SET_DATE_OPTIONS, { optionsDay, optionsTime, optionsWeek })
            dispatch("validate")
            commit(INIT_FINISHED)
        },
        async save({ state }) {
            try {
                await dataAdapter.savePlan(state.plan);
            } catch (error) {
                //todo error state
                console.error(error);
            }
        },
        selectModule({ commit, state, getters }, moduleId) {
            commit(SET_SELECTION_STATUS, {
                moduleId,
                selectableStatus: validateSelection(moduleId, state.modules, getters.timeSlots, state.rules)
            })
        },
        deselectModule({ commit, state }) {
            commit(SET_SELECTION_STATUS, {
                id: null,
                selectableStatus: getSelectableStatus(state.timeSlots)
            })
        },
        placeModule({ commit, dispatch, state, }, timeSlotId) {
            commit(ADD_PLACEMENT, { timeSlotId, moduleId: state.selectionStatus.moduleId })
            dispatch("deselectModule")
            dispatch("validate")
            dispatch("save");
        },
        removeModule({ commit, dispatch, state }, timeSlotId) {
            commit(REMOVE_PLACEMENT, timeSlotId)
            dispatch("validate")
            dispatch("save");
        },
        validate({ dispatch }) {
            dispatch("validateModules")
            dispatch("validateTimeSlots")
        },
        validateModules({ commit, state, getters }) {
            const moduleErrors = {}
            state.modules.forEach(module => {
                moduleErrors[module.id] = validateModule(module.id, state.modules, getters.timeSlots, state.rules)
            })
            commit(SET_MODULE_ERRORS, moduleErrors)
        },
        validateTimeSlots({ commit, state, getters }) {
            const timeSlotErrors = state.timeSlots.reduce((acc, cur) => {
                acc[cur.id] = []
                return acc
            }, {})
            state.rules.forEach(rule => {
                rule.validateSlots(getters.timeSlots, timeSlotErrors)
            })
            commit(SET_TIMESLOT_ERRORS, timeSlotErrors)
        }
    },
    getters: {
        credits(state, { timeSlots }) {
            return timeSlots.map(slot => slot.module).reduce((total, module) => module ? total + module.credits : total, 0)
        },
        modules(state) {
            return state.modules.map(module => {
                const moduleErrors = state.moduleErrors[module.id]
                return {
                    ...module,
                    errors: moduleErrors,
                    selected: state.selectionStatus.moduleId == module.id,
                    placed: !!state.plan.placements.find(placement => placement.moduleId == module.id)
                }
            })
        },
        moduleById: (state, { modules }) => (id) => {
            return modules.find(module => module.id == id)
        },
        timeSlots(state, { selectedModule, moduleById }) {
            return state.timeSlots.map(timeSlot => {
                const placement = state.plan.placements.find(placement => placement.timeSlotId === timeSlot.id);
                let module;
                let moduleId;
                if (placement) {
                    module = moduleById(placement.moduleId);
                    if (module) {
                        moduleId = module.id;
                    }
                }
                return {
                    ...timeSlot,
                    removable: !selectedModule && module,
                    selectable: selectedModule && !module && state.selectionStatus.selectableStatus[timeSlot.id],
                    module,
                    moduleId,
                    errors: state.timeSlotErrors[timeSlot.id]
                }
            })
        },
        timeSlotById: (state, { timeSlots }) => (id) => {
            return timeSlots.find(timeSlot => timeSlot.id == id)
        },
        timeSlotByDate: (state, { timeSlots }) => (year, semester, week, day, time) => {
            return timeSlots.find((slot) => {
                return (
                    slot.year == year &&
                    slot.semester == semester &&
                    slot.week == week &&
                    slot.day == day &&
                    slot.time == time
                );
            });
        },
        categories(state, { modules }) {
            return state.categories.map(category => {
                const categoryModules = modules.filter(module => module.category.id === category.id);
                const requiredNumber = category.requiredNumber != null ? category.requiredNumber : categoryModules.length;
                return {
                    ...category,
                    placedNumber: categoryModules.filter(module => module.placed).length,
                    requiredNumber,
                    modules: categoryModules.filter(module => !module.placed)
                }
            })
        },
        years(state, { timeSlots }) {
            return [
                ...new Set(
                    timeSlots.map((timeSlot) => {
                        return timeSlot.year
                    })
                ),
            ].sort((a, b) => a - b).map((year) => {
                const slotsByYear = timeSlots.filter(timeSlot => timeSlot.year === year);

                let semesters = new Set(slotsByYear.map(timeSlot => {
                    return timeSlot.semester
                }))

                semesters = [...semesters].sort().map(semester => {
                    const slotsBySemester = slotsByYear.filter(timeSlot => timeSlot.semester === semester);
                    return {
                        semester,
                        weeks: [...new Set(slotsBySemester.map((slot) => slot.week))].sort((a, b) => state.optionsWeek.indexOf(a) - state.optionsWeek.indexOf(b)),
                        days: [...new Set(slotsBySemester.map((slot) => slot.day))].sort((a, b) => state.optionsDay.indexOf(a) - state.optionsDay.indexOf(b)),
                        times: [...new Set(slotsBySemester.map((slot) => slot.time))].sort((a, b) => state.optionsTime.indexOf(a) - state.optionsTime.indexOf(b)),
                    }
                })

                return {
                    year,
                    semesters
                }
            })
        },
        selectedModule(state, { moduleById }) {
            return moduleById(state.selectionStatus.moduleId)
        },
        timeSlotErrors(state, { timeSlotById }) {
            const result = [];
            Object.entries(state.timeSlotErrors).forEach(([timeSlotId, errors]) => {
                const timeSlot = timeSlotById(timeSlotId);
                errors.forEach(error => {
                    result.push({
                        timeSlot,
                        text: error
                    })
                })
            });
            return result;
        }
    }
})

function getSelectableStatus(timeSlots) {
    return timeSlots.reduce((acc, cur) => {
        acc[cur.id] = true
        return acc
    }, {})
}

function validateModule(moduleId, modules, timeSlots, rules) {
    const module = modules.find(module => module.id == moduleId);
    const errors = [];
    rules.forEach(rule => {
        rule.validateModule(module, timeSlots, errors)
    })
    return errors
}

function validateSelection(moduleId, modules, timeSlots, rules) {
    const selectableStatus = getSelectableStatus(timeSlots)
    const module = modules.find(module => module.id == moduleId);
    rules.forEach(rule => {
        rule.validateSelection(module, timeSlots, selectableStatus)
    })
    return selectableStatus
}

export default store