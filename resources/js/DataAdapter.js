import axios from "axios";

export default class DataAdapter {

    constructor(planerSlug) {
        this.planerSlug = planerSlug;
    }

    async savePlan(plan) {
        const response = await axios.put(`/${this.planerSlug}/${plan.slug}`, plan)
        return response.data.data
    }
}