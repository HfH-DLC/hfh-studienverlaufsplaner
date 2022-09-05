import axios from "axios";

export default class DataAdapter {
    constructor(planerSlug, planSlug) {
        this.planerSlug = planerSlug;
        this.planSlug = planSlug;
    }

    async saveSchedule(placements, focusSelections, tourCompleted, valid) {
        const response = await axios.put(
            `/${this.planerSlug}/${this.planSlug}/zeitplan`,
            { placements, focusSelections, tourCompleted, valid }
        );
        return response.data.data;
    }

    async saveCredit(focusCredits, tourCompleted, valid) {
        const response = await axios.put(
            `/${this.planerSlug}/${this.planSlug}/anrechnung`,
            { focusCredits, tourCompleted, valid }
        );
        return response.data.data;
    }
}
