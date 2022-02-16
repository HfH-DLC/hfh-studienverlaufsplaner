import axios from "axios";

export default class DataAdapter {

    constructor(planerSlug) {
        this.planerSlug = planerSlug;
    }

    async savePlan(plan) {
        const response = await axios.put(`/planers/${this.planerSlug}/plans/${plan.slug}`, plan)
        return response.data.data
    }
}