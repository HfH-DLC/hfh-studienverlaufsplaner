import { describe, expect, it } from "vitest";
import SettingsRule from "@/Models/Rules/Schedule/SettingsRule";
import { placementFactory } from "./factories/PlacementFactory";
import { ref } from "vue";
import { scheduleModuleFactory } from "./factories/ScheduleModuleFactory";
import { locationFactory } from "./factories/LocationFactory";
import { dayTimeFactory } from "./factories/DayTimeFactory";

describe("SettingsRule", () => {
    describe("validatePlacements", () => {
        it("should return an error for a placement with an invalid location", () => {
            const rule = new SettingsRule();
            const errors = new Map();
            const validLocation = locationFactory.build({
                id: "someValidLocation",
            });
            const invalidLocation = locationFactory.build({
                id: "someInvalidLocation",
            });
            const validDayTime = dayTimeFactory.build({
                id: "someValidDayTime",
            });
            const invalidPlacement = {
                ...placementFactory.build({
                    location: invalidLocation,
                    dayTime: validDayTime,
                }),
                module: scheduleModuleFactory.build(),
                errors: [],
            };
            const data = {
                placements: ref([invalidPlacement]),
                locationIds: ref([validLocation.id]),
                dayTimes: ref([validDayTime]),
            };

            rule.validatePlacements(data, errors);

            expect(errors.get(invalidPlacement.id).length).toBe(1);
        });
        it("should return no error for a placement with a valid location", () => {
            const rule = new SettingsRule();
            const errors = new Map();
            const validLocation = locationFactory.build({
                id: "someValidLocation",
            });
            const validDayTime = dayTimeFactory.build({
                id: "someValidDayTime",
            });
            const invalidPlacement = {
                ...placementFactory.build({
                    location: validLocation,
                    dayTime: validDayTime,
                }),
                module: scheduleModuleFactory.build(),
                errors: [],
            };
            const data = {
                placements: ref([invalidPlacement]),
                locationIds: ref([validLocation.id]),
                dayTimes: ref([validDayTime]),
            };

            rule.validatePlacements(data, errors);

            expect(errors.size).toBe(0);
        });
        it("should return an error for a placement with an invalid dayTime", () => {
            const rule = new SettingsRule();
            const errors = new Map();
            const validLocation = locationFactory.build({
                id: "someValidLocation",
            });
            const validDayTime = dayTimeFactory.build({
                id: "someValidDayTime",
            });
            const invalidDayTime = dayTimeFactory.build({
                id: "someInvalidDayTime",
            });
            const invalidPlacement = {
                ...placementFactory.build({
                    location: validLocation,
                    dayTime: invalidDayTime,
                }),
                module: scheduleModuleFactory.build(),
                errors: [],
            };
            const data = {
                placements: ref([invalidPlacement]),
                locationIds: ref([validLocation.id]),
                dayTimes: ref([validDayTime]),
            };

            rule.validatePlacements(data, errors);

            expect(errors.get(invalidPlacement.id).length).toBe(1);
        });
        it("should return no error for a placement with an valid dayTime", () => {
            const rule = new SettingsRule();
            const errors = new Map();
            const validLocation = locationFactory.build({
                id: "someValidLocation",
            });
            const validDayTime = dayTimeFactory.build({
                id: "someValidDayTime",
            });
            const invalidPlacement = {
                ...placementFactory.build({
                    location: validLocation,
                    dayTime: validDayTime,
                }),
                module: scheduleModuleFactory.build(),
                errors: [],
            };
            const data = {
                placements: ref([invalidPlacement]),
                locationIds: ref([validLocation.id]),
                dayTimes: ref([validDayTime]),
            };

            rule.validatePlacements(data, errors);

            expect(errors.size).toBe(0);
        });
    });
});
