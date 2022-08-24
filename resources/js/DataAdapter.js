import axios from "axios";

export default class DataAdapter {

    constructor(planerSlug, planSlug) {
        this.planerSlug = planerSlug;
        this.planSlug = planSlug
    }

    async saveSchedule(placements, focusSelections, tourCompleted) {
        const response = await axios.put(`/${this.planerSlug}/${this.planSlug}/zeitplan`, { placements, focusSelections, tourCompleted })
        return response.data.data
    }

    async saveFocusCredits(focusCredits) {
        console.log("saveFocusCredits", focusCredits);
        const response = await axios.put(`/${this.planerSlug}/${this.planSlug}/anrechnung`, { focusCredits })
        return response.data.data
    }
}