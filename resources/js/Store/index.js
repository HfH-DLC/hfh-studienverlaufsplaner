import { createStore } from 'vuex'

import schedule from "./schedule";

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
        schedule,
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
        categories(state) {
            return state.categories.map(category => {

                const requiredNumber = category.requiredNumber != null ? category.requiredNumber : category.modules.length;
                return {
                    ...category,
                    requiredNumber,
                }
            })
        },
    }
})


export default store