import axios from "axios";

export default class DataAdapter {

    constructor(planerSlug, planSlug) {
        this.planerSlug = planerSlug;
        this.planSlug = planSlug
    }

    async saveSchedule(placements, tourCompleted) {
        const response = await axios.put(`/${this.planerSlug}/${this.planSlug}/schedule`, { placements, tourCompleted })
        return response.data.data
    }
}