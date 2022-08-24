import { createStore } from 'vuex'

import credit from "./credit"
import schedule from "./schedule";

const store = createStore({
    modules: {
        credit,
        schedule,
    }
})


export default store