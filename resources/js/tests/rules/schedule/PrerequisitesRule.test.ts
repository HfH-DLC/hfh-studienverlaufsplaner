import PrerequisitesRule from "@/Models/Rules/Schedule/PrerequisitesRule";
import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { Message, SchedulePlacement } from "@/types";
import { schedulePlacementFactory } from "@/tests/factories/SchedulePlacementFactory";
import { scheduleModuleFactory } from "@/tests/factories/ScheduleModuleFactory";
import { eventFactory } from "@/tests/factories/EventFactory";
import { priorLearnignFactory } from "@/tests/factories/PriorLearningFactory";

describe("PrerequisitesRule", () => {
    describe("getPlacementErrors", () => {
        it("should return an error if none of a placement's prerequisites are met", () => {
            const errorMessages = new Map();
            const prerequisite1 = scheduleModuleFactory.build();
            const prerequisite2 = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build();

            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite1.id, prerequisite2.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);

            const placementWithPrerequisites: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: moduleWithPrerequisites.id,
                    module: moduleWithPrerequisites,
                    year: 1991,
                    semester: "FS",
                });
            moduleWithPrerequisites.placement = placementWithPrerequisites;

            const data = {
                placements: ref([placementWithPrerequisites]),
                priorLearnings: ref([]),
            };

            rule.getPlacementErrors(data, errorMessages);

            expect(
                errorMessages.get(placementWithPrerequisites.id)?.length
            ).toBe(1);
        });
        it("should return an error if only  some a placement's prerequisites are met", () => {
            const errorMessages = new Map();
            const prerequisite1 = scheduleModuleFactory.build();
            const prerequisite2 = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build();
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite1.id, prerequisite2.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);
            const prerequisite1Placement: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: prerequisite1.id,
                    module: prerequisite1,
                    year: 1990,
                    semester: "FS",
                });
            prerequisite1.placement = prerequisite1Placement;
            const placementWithPrerequisites: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: moduleWithPrerequisites.id,
                    module: moduleWithPrerequisites,
                    year: 1991,
                    semester: "FS",
                });
            moduleWithPrerequisites.placement = placementWithPrerequisites;

            const data = {
                placements: ref([
                    placementWithPrerequisites,
                    prerequisite1Placement,
                ]),
                priorLearnings: ref([]),
            };

            rule.getPlacementErrors(data, errorMessages);

            expect(
                errorMessages.get(placementWithPrerequisites.id)?.length
            ).toBe(1);
        });
        it("should return an error if a placement's prerequisites are placed in the same semester", () => {
            const errorMessages = new Map();
            const prerequisite = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build();
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);
            const prerequisitePlacement: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: prerequisite.id,
                    module: prerequisite,
                    year: 1991,
                    semester: "FS",
                });
            prerequisite.placement = prerequisitePlacement;
            const placementWithPrerequisites: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: moduleWithPrerequisites.id,
                    module: moduleWithPrerequisites,
                    year: 1991,
                    semester: "FS",
                });
            moduleWithPrerequisites.placement = placementWithPrerequisites;
            const data = {
                placements: ref([
                    placementWithPrerequisites,
                    prerequisitePlacement,
                ]),
                priorLearnings: ref([]),
            };

            rule.getPlacementErrors(data, errorMessages);

            expect(
                errorMessages.get(placementWithPrerequisites.id)?.length
            ).toBe(1);
        });
        it("should return an error if a placement's prerequisites are placed in a later semester", () => {
            const errorMessages = new Map();
            const prerequisite = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build();
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);
            const prerequisitePlacement: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: prerequisite.id,
                    module: prerequisite,
                    year: 1991,
                    semester: "FS",
                });
            prerequisite.placement = prerequisitePlacement;
            const placementWithPrerequisites: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: moduleWithPrerequisites.id,
                    module: moduleWithPrerequisites,
                    year: 1991,
                    semester: "HS",
                });
            moduleWithPrerequisites.placement = placementWithPrerequisites;
            const data = {
                placements: ref([
                    placementWithPrerequisites,
                    prerequisitePlacement,
                ]),
                priorLearnings: ref([]),
            };

            rule.getPlacementErrors(data, errorMessages);

            expect(
                errorMessages.get(placementWithPrerequisites.id)?.length
            ).toBe(1);
        });
        it("should return an error if a placement's prerequisites are placed in a later year", () => {
            const errorMessages = new Map();
            const prerequisite = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build();
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);
            const prerequisitePlacement: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: prerequisite.id,
                    module: prerequisite,
                    year: 1992,
                    semester: "HS",
                });
            prerequisite.placement = prerequisitePlacement;
            const placementWithPrerequisites: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: moduleWithPrerequisites.id,
                    module: moduleWithPrerequisites,
                    year: 1991,
                    semester: "HS",
                });
            moduleWithPrerequisites.placement = placementWithPrerequisites;
            const data = {
                placements: ref([
                    placementWithPrerequisites,
                    prerequisitePlacement,
                ]),
                priorLearnings: ref([]),
            };

            rule.getPlacementErrors(data, errorMessages);

            expect(
                errorMessages.get(placementWithPrerequisites.id)?.length
            ).toBe(1);
        });
        it("should return no errors if a placement's prerequisites are met", () => {
            const errorMessages = new Map();
            const prerequisite1 = scheduleModuleFactory.build();
            const prerequisite2 = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build();
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite1.id, prerequisite2.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);
            const prerequisite1Placement: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: prerequisite1.id,
                    module: prerequisite1,
                    year: 1990,
                    semester: "FS",
                });
            prerequisite1.placement = prerequisite1Placement;
            const prerequisite2Placement: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: prerequisite2.id,
                    module: prerequisite2,
                    year: 1991,
                    semester: "HS",
                });
            prerequisite2.placement = prerequisite2Placement;
            const placementWithPrerequisites: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: moduleWithPrerequisites.id,
                    module: moduleWithPrerequisites,
                    year: 1991,
                    semester: "FS",
                });
            moduleWithPrerequisites.placement = placementWithPrerequisites;
            const data = {
                placements: ref([
                    placementWithPrerequisites,
                    prerequisite1Placement,
                    prerequisite2Placement,
                ]),
                priorLearnings: ref([]),
            };

            rule.getPlacementErrors(data, errorMessages);

            expect(errorMessages.size).toBe(0);
        });
        it("should return no errors if a placement's prerequisites are met partially by prior learnings", () => {
            const errorMessages = new Map();
            const prerequisite1 = scheduleModuleFactory.build();
            const prerequisite2 = scheduleModuleFactory.build();
            const prerequisite1Placement: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: prerequisite1.id,
                    module: prerequisite1,
                    year: 1990,
                    semester: "FS",
                });
            prerequisite1.placement = prerequisite1Placement;
            const moduleWithPrerequisites = scheduleModuleFactory.build();
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite1.id, prerequisite2.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);
            const placementWithPrerequisites: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: moduleWithPrerequisites.id,
                    module: moduleWithPrerequisites,
                    year: 1991,
                    semester: "FS",
                });
            moduleWithPrerequisites.placement = placementWithPrerequisites;
            const data = {
                placements: ref([
                    placementWithPrerequisites,
                    prerequisite1Placement,
                ]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: prerequisite2.id,
                    }),
                ]),
            };

            rule.getPlacementErrors(data, errorMessages);

            expect(errorMessages.size).toBe(0);
        });
        it("should return no errors if a placement's prerequisites are met entirely by prior learnings", () => {
            const errorMessages = new Map();
            const prerequisite1 = scheduleModuleFactory.build();
            const prerequisite2 = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build();
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite1.id, prerequisite2.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);
            const placementWithPrerequisites: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: moduleWithPrerequisites.id,
                    module: moduleWithPrerequisites,
                    year: 1991,
                    semester: "FS",
                });
            moduleWithPrerequisites.placement = placementWithPrerequisites;
            const data = {
                placements: ref([placementWithPrerequisites]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: prerequisite1.id,
                    }),
                    priorLearnignFactory.build({
                        countsAsModuleId: prerequisite2.id,
                    }),
                ]),
            };

            rule.getPlacementErrors(data, errorMessages);

            expect(errorMessages.size).toBe(0);
        });
        it("should not return an error if a placement has no prerequisites", () => {
            const errorMessages = new Map();
            const placementWithoutPrerequisites: SchedulePlacement =
                schedulePlacementFactory.build();
            const data = {
                placements: ref([placementWithoutPrerequisites]),
                priorLearnings: ref([]),
            };
            const moduleWithoutPrerequisites = scheduleModuleFactory.build();
            const params: Record<string, any> = {
                moduleId: moduleWithoutPrerequisites.id,
                groups: [],
            };
            const rule = new PrerequisitesRule(params);

            rule.getPlacementErrors(data, errorMessages);

            expect(errorMessages.size).toBe(0);
        });
    });

    describe("getModuleErrors", () => {
        it("should return no errors if the module has no prerequisites", () => {
            const errorMessages = new Array<Message>();
            const data = { placements: ref([]), priorLearnings: ref([]) };
            const moduleWithoutPrerequisites = scheduleModuleFactory.build();
            const params: Record<string, any> = {
                moduleId: moduleWithoutPrerequisites.id,
                groups: [],
            };
            const rule = new PrerequisitesRule(params);

            rule.getModuleErrors(
                moduleWithoutPrerequisites,
                data,
                errorMessages
            );

            expect(errorMessages.length).toBe(0);
        });

        it("should return an error if a module with prerequisites has no events", () => {
            const errorMessages = new Array<Message>();
            const data = { placements: ref([]), priorLearnings: ref([]) };
            const prerequisite = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build();
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);

            rule.getModuleErrors(moduleWithPrerequisites, data, errorMessages);

            expect(errorMessages.length).toBe(1);
        });

        it("should return no error if some of a module's events meet the module's prerequisites", () => {
            const errorMessages = new Array<Message>();

            const prerequisite = scheduleModuleFactory.build();
            const prerequisitePlacement: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: prerequisite.id,
                    module: prerequisite,
                    year: 1992,
                    semester: "HS",
                });
            prerequisite.placement = prerequisitePlacement;
            const data = {
                placements: ref([prerequisitePlacement]),
                priorLearnings: ref([]),
            };
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                events: [
                    eventFactory.build({
                        year: 1991,
                        semester: "HS",
                    }),
                    eventFactory.build({
                        year: 1993,
                        semester: "FS",
                    }),
                ],
            });
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);

            rule.getModuleErrors(moduleWithPrerequisites, data, errorMessages);

            expect(errorMessages.length).toBe(0);
        });

        it("should return no error if the prerequisite is met by prior learnings", () => {
            const errorMessages = new Array<Message>();

            const prerequisite = scheduleModuleFactory.build();
            const data = {
                placements: ref([]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: prerequisite.id,
                    }),
                ]),
            };
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                events: [
                    eventFactory.build({
                        year: 1991,
                        semester: "HS",
                    }),
                    eventFactory.build({
                        year: 1993,
                        semester: "FS",
                    }),
                ],
            });

            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);

            rule.getModuleErrors(moduleWithPrerequisites, data, errorMessages);

            expect(errorMessages.length).toBe(0);
        });

        it("should return an error if none of a module's events meets the module's prerequisites", () => {
            const errorMessages = new Array<Message>();

            const prerequisite = scheduleModuleFactory.build();
            const prerequisitePlacement: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: prerequisite.id,
                    module: prerequisite,
                    year: 1992,
                    semester: "HS",
                });
            prerequisite.placement = prerequisitePlacement;
            const data = {
                placements: ref([prerequisitePlacement]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: "someDifferentModuleId",
                    }),
                ]),
            };
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                events: [
                    eventFactory.build({
                        year: 1992,
                        semester: "HS",
                    }),
                    eventFactory.build({
                        year: 1991,
                        semester: "FS",
                    }),
                ],
            });
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);

            rule.getModuleErrors(moduleWithPrerequisites, data, errorMessages);

            expect(errorMessages.length).toBe(1);
        });
    });

    describe("getSelectionStatus", () => {
        it("should return nothing if the module has no prerequisites", () => {
            const infos = new Map();
            const data = {
                placements: ref([]),
                priorLearnings: ref([]),
            };
            const moduleWithoutPrerequisites = scheduleModuleFactory.build();
            const params: Record<string, any> = {
                moduleId: moduleWithoutPrerequisites.id,
                groups: [],
            };
            const rule = new PrerequisitesRule(params);

            rule.getSelectionStatus(moduleWithoutPrerequisites, data, infos);

            expect(infos.size).toBe(0);
        });
        it("should return nothing for events that meet the prerequisites", () => {
            const infos = new Map();
            const prerequisite = scheduleModuleFactory.build();
            const prerequisitePlacement: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: prerequisite.id,
                    module: prerequisite,
                    year: 1992,
                    semester: "HS",
                });
            prerequisite.placement = prerequisitePlacement;
            const data = {
                placements: ref([prerequisitePlacement]),
                priorLearnings: ref([]),
            };
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                events: [
                    eventFactory.build({
                        year: 1992,
                        semester: "FS",
                    }),
                    eventFactory.build({
                        year: 1993,
                        semester: "FS",
                    }),
                ],
            });
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);

            rule.getSelectionStatus(moduleWithPrerequisites, data, infos);

            expect(infos.size).toBe(0);
        });
        it("should return nothing if the prerequisites are met by prior learnings", () => {
            const infos = new Map();
            const prerequisite = scheduleModuleFactory.build();
            const data = {
                placements: ref([]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: prerequisite.id,
                    }),
                ]),
            };
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                events: [
                    eventFactory.build({
                        year: 1992,
                        semester: "FS",
                    }),
                    eventFactory.build({
                        year: 1993,
                        semester: "FS",
                    }),
                ],
            });
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);

            rule.getSelectionStatus(moduleWithPrerequisites, data, infos);

            expect(infos.size).toBe(0);
        });
        it("should return dateAllowed=false for each event that does not meet the prerequisites", () => {
            const errorMessages = new Map();
            const prerequisite = scheduleModuleFactory.build();
            const prerequisitePlacement: SchedulePlacement =
                schedulePlacementFactory.build({
                    moduleId: prerequisite.id,
                    module: prerequisite,
                    year: 1992,
                    semester: "HS",
                });
            prerequisite.placement = prerequisitePlacement;
            const data = {
                placements: ref([prerequisitePlacement]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: "someDifferentModuleId",
                    }),
                ]),
            };
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                events: [
                    eventFactory.build({
                        id: 1,
                        year: 1992,
                        semester: "HS",
                    }),
                    eventFactory.build({
                        id: 2,
                        year: 1991,
                        semester: "FS",
                    }),
                ],
            });
            const params: Record<string, any> = {
                moduleId: moduleWithPrerequisites.id,
                groups: [
                    {
                        prerequisiteIds: [prerequisite.id],
                    },
                ],
            };
            const rule = new PrerequisitesRule(params);

            rule.getSelectionStatus(
                moduleWithPrerequisites,
                data,
                errorMessages
            );

            expect(errorMessages.size).toBe(2);
            expect(errorMessages.get(1).valid).toBe(true);
            expect(errorMessages.get(1).dateAllowed).toBe(false);
            expect(errorMessages.get(2).valid).toBe(true);
            expect(errorMessages.get(2).dateAllowed).toBe(false);
        });
    });
});
