import axios from "axios";

export default class DataAdapter {

    constructor(planerSlug) {
        this.planerSlug = planerSlug;
    }

    async savePlan(plan) {
        return axios.put(`/planers/${this.planerSlug}/plans/${plan.slug}`, plan);
    }
}