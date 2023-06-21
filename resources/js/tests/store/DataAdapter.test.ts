import axios from "axios";
import DataAdapter from "@/DataAdapter";
import { describe, expect, it, beforeEach, vi, type Mocked } from "vitest";
import { FocusCredit, FocusSelection, Placement, PriorLearning } from "@/types";
import { placementFactory } from "@/tests/factories/PlacementFactory";
import { priorLearnignFactory } from "../factories/PriorLearningFactory";

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
        const placements: Array<Placement> = placementFactory.buildList(5);
        const focusSelections: Array<FocusSelection> = [];
        const tourCompleted = true;
        const valid = true;

        await dataAdapter.saveSchedule(
            placements,
            focusSelections,
            tourCompleted,
            valid
        );

        const expectedData = {
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
        expect(mockedAxios.put).toHaveBeenCalledWith(
            getExpectedEndpointUrl("zeitplan"),
            expectedData
        );
    });

    it("should save credit", async () => {
        const focusCredits: Array<FocusCredit> = [];
        const tourCompleted = true;
        const valid = true;

        await dataAdapter.saveCredit(focusCredits, tourCompleted, valid);

        const expectedData = {
            focusCredits: [],
            tourCompleted,
            valid,
        };
        expect(mockedAxios.put).toHaveBeenCalledWith(
            getExpectedEndpointUrl("anrechnung"),
            expectedData
        );
    });

    it("should save settings", async () => {
        const dayTimes: Array<string> = ["a", "f", "g"];
        const locations: Array<string> = ["ZH", "GR"];

        const expectedData = {
            dayTimes,
            locations,
        };

        await dataAdapter.saveSettings(dayTimes, locations);

        expect(mockedAxios.put).toHaveBeenCalledWith(
            getExpectedEndpointUrl("einstellungen"),
            expectedData
        );
    });

    it("should save prior learning", async () => {
        const priorLearnings: Array<PriorLearning> = [
            priorLearnignFactory.build(),
            priorLearnignFactory.build(),
        ];
        const expectedData = {
            priorLearnings,
        };

        await dataAdapter.savePriorLearnings(priorLearnings);

        expect(mockedAxios.put).toHaveBeenCalledWith(
            getExpectedEndpointUrl("vorleistungen"),
            expectedData
        );
    });
});
