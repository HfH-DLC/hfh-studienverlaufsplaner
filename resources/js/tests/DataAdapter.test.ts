import axios from "axios";
import DataAdapter from "@/DataAdapter";
import { describe, expect, it, beforeEach, vi, type Mocked } from "vitest";
import { FocusCredit, FocusSelection, Placement } from "@/types";

vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;

describe("DataAdapter", () => {
    let dataAdapter: DataAdapter;
    const planerSlug = "test-planer";
    const planSlug = "test-plan";

    function getExpectedEndpointUrl(pageSlug: string) {
        return `/${planerSlug}/${planSlug}/${pageSlug}`;
    }

    beforeEach(() => {
        dataAdapter = new DataAdapter(planerSlug, planSlug);
        mockedAxios.put.mockReset();
    });

    it("should save schedule", async () => {
        const placements: Array<Placement> = [
            {
                id: 0,
                moduleId: "P1_01",
                location: {
                    id: "ZH",
                    name: "Zürich",
                    default: true,
                },
                year: 2021,
                timeWindow: "TimeWindowA",
                semester: "FS",
                dayTime: {
                    id: "a",
                    day: "Montag",
                    time: "Morgen",
                    sortIndex: 0,
                    default: true,
                },
            },
        ];
        const focusSelections: Array<FocusSelection> = [];
        const tourCompleted = true;
        const valid = true;

        const data = {
            placements: placements.map((placement) => {
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
        };

        await dataAdapter.saveSchedule(
            placements,
            focusSelections,
            tourCompleted,
            valid
        );

        expect(mockedAxios.put).toHaveBeenCalledWith(
            getExpectedEndpointUrl("zeitplan"),
            data
        );
    });

    it("should save credit", async () => {
        const focusCredits: Array<FocusCredit> = [];
        const tourCompleted = true;
        const valid = true;

        const data = {
            focusCredits: [],
            tourCompleted,
            valid,
        };

        await dataAdapter.saveCredit(focusCredits, tourCompleted, valid);

        expect(mockedAxios.put).toHaveBeenCalledWith(
            getExpectedEndpointUrl("anrechnung"),
            data
        );
    });

    it("should save settings", async () => {
        const dayTimes: Array<string> = ["a", "f", "g"];
        const locations: Array<string> = ["ZH", "GR"];

        const data = {
            dayTimes,
            locations,
        };

        await dataAdapter.saveSettings(dayTimes, locations);

        expect(mockedAxios.put).toHaveBeenCalledWith(
            getExpectedEndpointUrl("einstellungen"),
            data
        );
    });
});
