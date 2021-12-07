import { createStore } from 'vuex'
import DataAdapter from '../DataAdapter'

const RESET_STATE = "RESET_STATE"
const SET_PLAN = "SET_PLAN"
const SET_TIMESLOTS = "SET_TIMESLOTS"
const SET_MODULES = "SET_MODULES"
const SET_CATEGORIES = "SET_CATEGORIES"
const SET_RULES = "SET_RULES"
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
            state.rules = rules
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
        async init({ commit, dispatch }, { plan, timeSlots, modules, categories, rules }) {
            console.log(modules);
            commit(RESET_STATE)
            commit(SET_PLAN, plan);
            commit(SET_TIMESLOTS, timeSlots)
            commit(SET_MODULES, modules)
            commit(SET_CATEGORIES, categories)
            commit(SET_RULES, rules)
            dispatch("validate")
            commit(INIT_FINISHED);
        },
        async save({ state }) {
            try {
                //await new DataAdapter().savePlan(state.plan);
            } catch (error) {
                //todo error state
                console.error(error);
            }
        },
        selectModule({ commit, state, getters }, moduleId) {
            commit(SET_SELECTION_STATUS, {
                moduleId,
                errors: validateSelection(moduleId, state.modules, getters.timeSlots, state.rules)
            })
        },
        deselectModule({ commit, state }) {
            commit(SET_SELECTION_STATUS, {
                id: null,
                errors: getEmptyErrorsObject(state.timeSlots)
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
                moduleErrors[module.id] = validateSelection(module.id, state.modules, getters.timeSlots, state.rules)
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
                const selectable = !moduleErrors || Object.values(moduleErrors).some(errorsPerTimeSlot => errorsPerTimeSlot.length == 0)
                return {
                    ...module,
                    selectable: selectable,
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
                    selectable: selectedModule && !module && state.selectionStatus.errors[timeSlot.id].length == 0,
                    module,
                    moduleId,
                    errors: state.timeSlotErrors[timeSlot.id]
                }
            })
        },
        timeSlotById: (state, { timeSlots }) => (id) => {
            return timeSlots.find(timeSlot => timeSlot.id == id)
        },
        timeSlotByDate: (state, { timeSlots }) => (semester, week, day, time) => {
            return timeSlots.find((slot) => {
                return (
                    slot.semester == semester &&
                    slot.week == week &&
                    slot.day == day &&
                    slot.time == time
                );
            });
        },
        categories(state, { modules }) {
            return state.categories.map(category => {
                const categoryModules = modules.filter(module => module.categoryId === category.id);
                const requiredNumber = category.requiredNumber != null ? category.requiredNumber : categoryModules.length;
                return {
                    ...category,
                    placedNumber: categoryModules.filter(module => module.placed).length,
                    requiredNumber,
                    modules: categoryModules.filter(module => !module.placed)
                }
            })
        },
        semesters(state, { timeSlots }) {
            return [
                ...new Set(
                    timeSlots.map((timeSlot) => {
                        return timeSlot.semester
                    })
                ),
            ].map((semester) => {
                const slotsBySemester = timeSlots.filter(
                    (timeSlot) => timeSlot.semester == semester
                )
                return {
                    id: semester,
                    weeks: new Set(slotsBySemester.map((slot) => slot.week)),
                    days: new Set(slotsBySemester.map((slot) => slot.day)),
                    times: new Set(slotsBySemester.map((slot) => slot.time)),
                }
            })
        },
        selectedModule(state, { moduleById }) {
            return moduleById(state.selectionStatus.moduleId)
        }
    }
})

function getEmptyErrorsObject(timeSlots) {
    return timeSlots.reduce((acc, cur) => {
        acc[cur.id] = []
        return acc
    }, {})
}

function validateSelection(moduleId, modules, timeSlots, rules) {
    const errors = getEmptyErrorsObject(timeSlots)
    const module = modules.find(module => module.id == moduleId);
    rules.forEach(rule => {
        if (rule.doesMatchSelection(moduleId)) {
            rule.validateSelection(module, timeSlots, errors)
        }
    })
    return errors
}

export default store