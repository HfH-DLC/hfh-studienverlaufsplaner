import DateRule from "@/Models/Rules/Schedule/DateRule";
import { Message, SchedulePlacement } from "@/types";
import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { scheduleModuleFactory } from "@/tests/factories/ScheduleModuleFactory";
import { eventFactory } from "@/tests/factories/EventFactory";
import { placementFactory } from "@/tests/factories/PlacementFactory";
import { dayTimeFactory } from "@/tests/factories/DayTimeFactory";

describe("DateRule", () => {
    describe("getPlacementErrors", () => {
        it("should return an error for each invalid placement", () => {
            const rule = new DateRule();
            const errorMessages = new Map();
            const event = eventFactory.build({
                year: 1990,
                semester: "HS",
                dayTime: {
                    id: "a",
                },
                timeWindow: "Plfichtmodule",
            });
            const events = [event];
            const module = scheduleModuleFactory.build({
                events,
            });
            const validatePlacement = {
                ...placementFactory.build({
                    moduleId: module.id,
                    year: event.year,
                    semester: event.semester,
                    dayTime: event.dayTime,
                    timeWindow: event.timeWindow,
                }),
                module,
                errors: [],
            };
            const invalidPlacement1 = {
                ...placementFactory.build({
                    moduleId: module.id,
                    year: 2020,
                }),
                module,
                errors: [],
            };
            const invalidPlacement2 = {
                ...placementFactory.build({
                    moduleId: module.id,
                    dayTime: {
                        id: "b",
                    },
                }),
                module,
                errors: [],
            };
            const placements: Array<SchedulePlacement> = [
                validatePlacement,
                invalidPlacement1,
                invalidPlacement2,
            ];
            const data = {
                placements: ref(placements),
            };

            rule.getPlacementErrors(data, errorMessages);

            expect(errorMessages.get(validatePlacement.id)).toBeUndefined();
            expect(errorMessages.get(invalidPlacement1.id)?.length).toBe(1);
            expect(errorMessages.get(invalidPlacement2.id)?.length).toBe(1);
        });
    });

    describe("getModuleErrors", () => {
        it("should return an error if there are no free events for an unplaced module", () => {
            const rule = new DateRule();
            const event = eventFactory.build();
            const events = [event];
            const module = scheduleModuleFactory.build({
                events,
            });
            const placements: Array<SchedulePlacement> = [
                {
                    ...placementFactory.build({
                        moduleId: module.id,
                        year: event.year,
                        semester: event.semester,
                        dayTime: event.dayTime,
                        timeWindow: event.timeWindow,
                    }),
                    module,
                    errors: [],
                },
            ];
            const data = {
                placements: ref(placements),
            };
            const errorMessages: Array<Message> = [];

            rule.getModuleErrors(module, data, errorMessages);

            expect(errorMessages.length).toBe(1);
        });
        it("should return no errors if there are free events for an unplaced module", () => {
            const rule = new DateRule();
            const freeEvent = eventFactory.build({
                dayTime: dayTimeFactory.build(),
            });
            const takenEvent = eventFactory.build({
                dayTime: dayTimeFactory.build(),
            });
            const events = [freeEvent, takenEvent];
            const module = scheduleModuleFactory.build({
                events,
            });
            const placements: Array<SchedulePlacement> = [
                {
                    ...placementFactory.build({
                        year: takenEvent.year,
                        semester: takenEvent.semester,
                        dayTime: takenEvent.dayTime,
                        timeWindow: takenEvent.timeWindow,
                    }),
                    module: scheduleModuleFactory.build(),
                    errors: [],
                },
            ];
            const data = {
                placements: ref(placements),
            };
            const errorMessages: Array<Message> = [];

            rule.getModuleErrors(module, data, errorMessages);

            expect(errorMessages.length).toBe(0);
        });
        it("should return no errors for a placed module", () => {
            const rule = new DateRule();
            const moduleEvent = eventFactory.build({
                dayTime: dayTimeFactory.build(),
            });
            const takenEvent = eventFactory.build({
                dayTime: dayTimeFactory.build(),
            });
            const events = [moduleEvent, takenEvent];
            const module = scheduleModuleFactory.build({
                events,
            });
            const modulePlacement = {
                ...placementFactory.build({
                    moduleId: module.id,
                    year: moduleEvent.year,
                    semester: moduleEvent.semester,
                    dayTime: moduleEvent.dayTime,
                    timeWindow: moduleEvent.timeWindow,
                }),
                module,
                errors: [],
            };
            const otherPlacement = {
                ...placementFactory.build({
                    moduleId: "otherModuleId",
                    year: takenEvent.year,
                    semester: takenEvent.semester,
                    dayTime: takenEvent.dayTime,
                    timeWindow: takenEvent.timeWindow,
                }),
                module,
                errors: [],
            };
            module.placement = modulePlacement;
            const placements: Array<SchedulePlacement> = [
                modulePlacement,
                otherPlacement,
            ];
            const data = {
                placements: ref(placements),
            };
            const errorMessages: Array<Message> = [];

            rule.getModuleErrors(module, data, errorMessages);

            expect(errorMessages.length).toBe(0);
        });
    });
});
