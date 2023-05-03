import axios from "axios";
import {
    DayTime,
    FocusCredit,
    FocusSelection,
    Location,
    PlacementParams,
} from "./types";
import { Placement } from "./types";

export default class DataAdapter {
    private planerSlug: string;
    private planSlug: string;

    constructor(planerSlug: string, planSlug: string) {
        this.planerSlug = planerSlug;
        this.planSlug = planSlug;
    }

    async saveSchedule(
        placements: Array<Placement>,
        focusSelections: Array<FocusSelection>,
        tourCompleted: boolean,
        valid: boolean
    ) {
        const response = await axios.put(
            `/${this.planerSlug}/${this.planSlug}/zeitplan`,
            {
                placements: placements.map((placement): PlacementParams => {
                    return {
                        moduleId: placement.moduleId,
                        locationId: placement.location.id,
                        year: placement.year,
                        semester: placement.semester,
                        dayTimeId: placement.dayTime.id,
                        timeWindow: placement.timeWindow,
                    };
                }),
                focusSelections: focusSelections.map((params) => ({
                    position: params.position,
                    focusId: params.focus.id,
                })),
                tourCompleted,
                valid,
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

    async saveSettings(dayTimes: Array<string>, locations: Array<string>) {
        const response = await axios.put(
            `/${this.planerSlug}/${this.planSlug}/einstellungen`,
            {
                dayTimes,
                locations,
            }
        );
        return response.data.data;
    }
}
