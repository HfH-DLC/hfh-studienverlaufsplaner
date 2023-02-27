import axios from "axios";
import { FocusCredit, FocusSelection, PlacementParams } from "./types";

export default class DataAdapter {
    private planerSlug: string;
    private planSlug: string;

    constructor(planerSlug: string, planSlug: string) {
        this.planerSlug = planerSlug;
        this.planSlug = planSlug;
    }

    async saveSchedule(
        placements: Array<PlacementParams>,
        focusSelections: Array<FocusSelection>,
        tourCompleted: boolean,
        valid: boolean,
        locations: Array<string>
    ) {
        const response = await axios.put(
            `/${this.planerSlug}/${this.planSlug}/zeitplan`,
            {
                placements,
                focusSelections: focusSelections.map((params) => ({
                    position: params.position,
                    focusId: params.focus.id,
                })),
                tourCompleted,
                valid,
                locations,
            }
        );
        return response.data.data;
    }

    async saveCredit(
        focusCredits: Array<FocusCredit>,
        tourCompleted: boolean,
        valid: boolean
    ) {
        const response = await axios.put(
            `/${this.planerSlug}/${this.planSlug}/anrechnung`,
            { focusCredits, tourCompleted, valid }
        );
        return response.data.data;
    }
}
