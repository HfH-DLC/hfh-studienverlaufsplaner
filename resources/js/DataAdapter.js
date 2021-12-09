import axios from "axios";

export default class DataAdapter {
    async savePlan(plan) {
        return axios.put(`/plans/${plan.id}`, plan);
    }
}