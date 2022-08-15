import { createStore } from 'vuex'

import moduleSchedule from "./schedule";

const RESET_STATE = "RESET_STATE"
const SET_PLAN = "SET_PLAN"
const SET_CATEGORIES = "SET_CATEGORIES"

const initialState = {
    initialized: false,
    categories: [],
    plan: null,
}

const store = createStore({
    modules: {
        schedule: moduleSchedule
    },
    state: initialState,
    mutations: {
        [RESET_STATE](state) {
            state = initialState
        },
        [SET_PLAN](state, plan) {
            state.plan = plan
        },
        [SET_CATEGORIES](state, categories) {
            state.categories = categories
        },
    },
    actions: {
        init({ commit }, { plan, categories }) {
            commit(RESET_STATE)
            commit(SET_PLAN, plan)
            commit(SET_CATEGORIES, categories)
        },
    },
    getters: {
        modules(state, { categories }) {
            return categories.reduce((acc, cur) => {
                acc.push(...cur.modules);
                return acc;
            }, []);
        },
        moduleById: (state, { modules }) => (id) => {
            return modules.find(module => module.id == id)
        },
        categories(state) {
            return state.categories.map(category => {
                let categoryModules = category.moduleSelectionEnabled ?
                    category.modules.filter(categoryModule =>
                        state.plan.modules.some(module => module.id === categoryModule.id) ||
                        state.plan.focusSelections.some(focusSelection => focusSelection.selectedOptionalModules.some(module => module.id === categoryModule.id) || focusSelection.focus.requiredModules.some(module => module.id === categoryModule.id))
                    ) : category.modules;

                const requiredNumber = category.requiredNumber != null ? category.requiredNumber : categoryModules.length;
                return {
                    ...category,
                    requiredNumber,
                    modules: categoryModules
                }
            })
        },
    }
})


export default store