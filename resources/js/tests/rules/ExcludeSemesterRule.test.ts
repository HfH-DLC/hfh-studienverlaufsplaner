import ExcludeSemesterRule from "@/Models/Rules/Schedule/ExcludeSemesterRule";
import {
    SelectionEventInfo,
    ScheduleModule,
    SchedulePlacement,
    ErrorMessage,
} from "@/types";
import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { scheduleModuleFactory } from "@/tests/factories/ScheduleModuleFactory";
import { eventFactory } from "@/tests/factories/EventFactory";
import { placementFactory } from "@/tests/factories/PlacementFactory";

describe("ExcludeSemesterRule", () => {
    describe("validatePlacement", () => {
        it("should return an error if the specified module is placed in an excluded semester", () => {
            const startYear = 2023;
            const module = scheduleModuleFactory.build({
                id: "MyModule",
            });
            const params = {
                excludePositions: [3],
                moduleId: module.id,
            };
            const invalidPlacement = {
                ...placementFactory.build({
                    id: 1,
                    moduleId: module.id,
                    year: startYear + 1,
                    semester: "FS",
                }),
                module,
                errors: [],
            };
            module.placement = invalidPlacement;
            const placements: Array<SchedulePlacement> = [invalidPlacement];
            const data = {
                startYear: ref(startYear),
                placements: ref(placements),
            };
            const errorMessages: Map<number, Array<ErrorMessage>> = new Map();
            const rule = new ExcludeSemesterRule(params);

            rule.validatePlacements(data, errorMessages);

            expect(errorMessages.get(invalidPlacement.id)?.length).toBe(1);
        });
        it("should not return an error if the specified module is placed in an allowed semester", () => {
            const startYear = 2023;
            const module = scheduleModuleFactory.build({
                id: "MyModule",
            });
            const params = {
                excludePositions: [3],
                moduleId: module.id,
            };
            const invalidPlacement = {
                ...placementFactory.build({
                    id: 1,
                    moduleId: module.id,
                    year: startYear,
                    semester: "HS",
                }),
                module,
                errors: [],
            };
            module.placement = invalidPlacement;
            const placements: Array<SchedulePlacement> = [invalidPlacement];
            const data = {
                startYear: ref(startYear),
                placements: ref(placements),
            };
            const errorMessages: Map<number, Array<ErrorMessage>> = new Map();
            const rule = new ExcludeSemesterRule(params);

            rule.validatePlacements(data, errorMessages);

            expect(errorMessages.size).toBe(0);
        });
        it("should ignore modules other than the specified one", () => {
            const startYear = 2023;
            const module = scheduleModuleFactory.build({
                id: "someOtherModule",
            });
            const params = {
                excludePositions: [3],
                moduleId: "MyModule",
            };
            const invalidPlacement = {
                ...placementFactory.build({
                    id: 1,
                    moduleId: module.id,
                    year: startYear + 1,
                    semester: "FS",
                }),
                module,
                errors: [],
            };
            module.placement = invalidPlacement;
            const placements: Array<SchedulePlacement> = [invalidPlacement];
            const data = {
                startYear: ref(startYear),
                placements: ref(placements),
            };
            const errorMessages: Map<number, Array<ErrorMessage>> = new Map();
            const rule = new ExcludeSemesterRule(params);

            rule.validatePlacements(data, errorMessages);

            expect(errorMessages.size).toBe(0);
        });
    });

    describe("validateModule", () => {
        it("should return an error if there are no free events for the module within the allowed semesters", () => {
            const params = {
                excludePositions: [2],
                moduleId: "MyModule",
            };
            const rule = new ExcludeSemesterRule(params);
            const startYear = 2023;
            const eventInExcludedSemester = eventFactory.build({
                year: startYear + 1,
                semester: "HS",
            });
            const eventWithPlacement = eventFactory.build({
                year: startYear,
                semester: "HS",
            });
            const events = [eventInExcludedSemester, eventWithPlacement];
            const module = scheduleModuleFactory.build({
                id: params.moduleId,
                events,
            });
            const placements: Array<SchedulePlacement> = [
                {
                    ...placementFactory.build({
                        moduleId: "some_other_module",
                        year: eventWithPlacement.year,
                        semester: eventWithPlacement.semester,
                        dayTime: eventWithPlacement.dayTime,
                        timeWindow: eventWithPlacement.timeWindow,
                    }),
                    module: scheduleModuleFactory.build({
                        id: "some_other_module",
                    }),
                    errors: [],
                },
            ];
            const data = {
                startYear: ref(startYear),
                placements: ref(placements),
            };
            const errorMessages: Array<ErrorMessage> = [];

            rule.validateModule(module, data, errorMessages);

            expect(errorMessages.length).toBe(1);
        });

        it("should return no errors if there are free events for the module within the allowed semesters", () => {
            const params = {
                excludePositions: [2],
                moduleId: "MyModule",
            };
            const rule = new ExcludeSemesterRule(params);
            const startYear = 2023;
            const eventInAllowedSemesterWithoutPlacement = eventFactory.build({
                year: startYear,
                semester: "HS",
            });
            const events = [eventInAllowedSemesterWithoutPlacement];
            const module = scheduleModuleFactory.build({
                id: params.moduleId,
                events,
            });
            const placements: Array<SchedulePlacement> = [];
            const data = {
                startYear: ref(startYear),
                placements: ref(placements),
            };
            const errorMessages: Array<ErrorMessage> = [];

            rule.validateModule(module, data, errorMessages);

            expect(errorMessages.length).toBe(0);
        });

        it("should ignore modules other than the specified one", () => {
            const params = {
                excludePositions: [2],
                moduleId: "MyModule",
            };
            const rule = new ExcludeSemesterRule(params);
            const startYear = 2023;
            const eventInExcludedSemester = eventFactory.build({
                year: startYear + 1,
                semester: "HS",
            });
            const eventWithPlacement = eventFactory.build({
                year: startYear,
                semester: "HS",
            });
            const events = [eventInExcludedSemester, eventWithPlacement];
            const module = scheduleModuleFactory.build({
                id: "some_other_module",
                events,
            });
            const placements: Array<SchedulePlacement> = [
                {
                    ...placementFactory.build({
                        moduleId: "yet_another_module",
                        year: eventWithPlacement.year,
                        semester: eventWithPlacement.semester,
                        dayTime: eventWithPlacement.dayTime,
                        timeWindow: eventWithPlacement.timeWindow,
                    }),
                    module: scheduleModuleFactory.build({
                        id: "yet_another_module",
                    }),
                    errors: [],
                },
            ];
            const data = {
                startYear: ref(startYear),
                placements: ref(placements),
            };
            const errorMessages: Array<ErrorMessage> = [];

            rule.validateModule(module, data, errorMessages);

            expect(errorMessages.length).toBe(0);
        });
    });

    describe("validateSelection", () => {
        it("should return dateAllowed: false for events in excluded semesters", () => {
            const startYear = 2023;
            const module: ScheduleModule = scheduleModuleFactory.build({
                events: [
                    eventFactory.build({
                        id: 1,
                        year: startYear,
                        semester: "FS",
                    }),
                    eventFactory.build({
                        id: 2,
                        year: startYear,
                        semester: "HS",
                    }),
                    eventFactory.build({
                        id: 3,
                        year: startYear + 2,
                        semester: "HS",
                    }),
                ],
            });
            const params = {
                excludePositions: [1, 4],
                moduleId: module.id,
            };
            const rule = new ExcludeSemesterRule(params);
            const selectionEventInfos: Map<number, SelectionEventInfo> =
                new Map();

            rule.validateSelection(
                module,
                { startYear: ref(startYear) },
                selectionEventInfos
            );

            expect(selectionEventInfos.size).toBe(module.events.length);
            expect(selectionEventInfos.get(1)!.dateAllowed).toBe(false);
            expect(selectionEventInfos.get(1)!.valid).toBe(true);
            expect(selectionEventInfos.get(2)!.dateAllowed).toBe(true);
            expect(selectionEventInfos.get(2)!.valid).toBe(true);
            expect(selectionEventInfos.get(3)!.dateAllowed).toBe(false);
            expect(selectionEventInfos.get(3)!.valid).toBe(true);
        });

        it("should ignore modules other than the specified one", () => {
            const startYear = 2023;
            const module: ScheduleModule = scheduleModuleFactory.build({
                events: [
                    eventFactory.build({
                        id: 1,
                        year: startYear,
                        semester: "HS",
                    }),
                ],
            });
            const params = {
                excludePositions: [0],
                moduleId: "some_other_module_id",
            };
            const rule = new ExcludeSemesterRule(params);
            const selectionEventInfos: Map<number, SelectionEventInfo> =
                new Map();

            rule.validateSelection(
                module,
                { startYear: ref(startYear) },
                selectionEventInfos
            );

            expect(selectionEventInfos.size).toBe(0);
        });
    });
});
