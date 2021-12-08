import axios from "axios";

export default class DataAdapter {

    async createPlan() {
        return axios.post('/plans');
    }

    async savePlan(plan) {
        return axios.put(`/plans/${plan.id}`, plan);
    }
}