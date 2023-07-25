import axios from "axios";
import {
    FocusCredit,
    FocusSelection,
    PlacementParams,
    PriorLearning,
    PriorLearningParams,
} from "./types";
import { Placement } from "./types";

export default class DataAdapter {
    private planerSlug: string;
    private planSlug: string;

    constructor(planerSlug: string, planSlug: string) {
        this.planerSlug = planerSlug;
        this.planSlug = planSlug;
    }

    getEndpointUrl(pageSlug: string) {
        return `/${this.planerSlug}/${this.planSlug}/${pageSlug}`;
    }

    async saveSchedule(
        placements: Array<Placement>,
        focusSelections: Array<FocusSelection>,
        tourCompleted: boolean,
        valid: boolean
    ) {
        await axios.put(this.getEndpointUrl("zeitplan"), {
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
        });
    }

    async saveCredit(
        focusCredits: Array<FocusCredit>,
        tourCompleted: boolean,
        valid: boolean
    ) {
        await axios.put(this.getEndpointUrl("anrechnung"), {
            focusCredits,
            tourCompleted,
            valid,
        });
    }

    async saveSettings(dayTimes: Array<string>, locations: Array<string>) {
        await axios.put(this.getEndpointUrl("einstellungen"), {
            dayTimes,
            locations,
        });
    }

    async savePriorLearnings(
        priorLearnings: Array<PriorLearningParams>,
        isScheduleValid: boolean
    ) {
        const response = await axios.put(this.getEndpointUrl("vorleistungen"), {
            priorLearnings,
            isScheduleValid,
        });
        const result = response.data as Array<PriorLearning>;
        return result;
    }
}
