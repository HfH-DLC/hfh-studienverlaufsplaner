import PrerequisitesRule from "@/Models/Rules/Schedule/PrerequisitesRule";
import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { SchedulePlacement } from "@/types";
import { schedulePlacementFactory } from "@/tests/factories/SchedulePlacementFactory";
import { scheduleModuleFactory } from "@/tests/factories/ScheduleModuleFactory";

describe("PrerequisitesRule", () => {
    describe("validatePlacements", () => {
        it("should return an error if none of a placement's prerequisites are met", () => {
            const rule = new PrerequisitesRule();
            const errorMessages = new Map();
            const prerequisite1 = scheduleModuleFactory.build();
            const prerequisite2 = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                prerequisites: [prerequisite1, prerequisite2],
            });
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
            };

            rule.validatePlacements(data, errorMessages);

            expect(
                errorMessages.get(placementWithPrerequisites.id)?.length
            ).toBe(1);
        });
        it("should return an error if only  some a placement's prerequisites are met", () => {
            const rule = new PrerequisitesRule();
            const errorMessages = new Map();
            const prerequisite1 = scheduleModuleFactory.build();
            const prerequisite2 = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                prerequisites: [prerequisite1, prerequisite2],
            });
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
            };

            rule.validatePlacements(data, errorMessages);

            expect(
                errorMessages.get(placementWithPrerequisites.id)?.length
            ).toBe(1);
        });
        it("should return an error if a placement's prerequisites are placed in the same semester", () => {
            const rule = new PrerequisitesRule();
            const errorMessages = new Map();
            const prerequisite = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                prerequisites: [prerequisite],
            });
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
            };

            rule.validatePlacements(data, errorMessages);

            expect(
                errorMessages.get(placementWithPrerequisites.id)?.length
            ).toBe(1);
        });
        it("should return an error if a placement's prerequisites are placed in a later semester", () => {
            const rule = new PrerequisitesRule();
            const errorMessages = new Map();
            const prerequisite = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                prerequisites: [prerequisite],
            });
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
            };

            rule.validatePlacements(data, errorMessages);

            expect(
                errorMessages.get(placementWithPrerequisites.id)?.length
            ).toBe(1);
        });
        it("should return an error if a placement's prerequisites are placed in a later year", () => {
            const rule = new PrerequisitesRule();
            const errorMessages = new Map();
            const prerequisite = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                prerequisites: [prerequisite],
            });
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
            };

            rule.validatePlacements(data, errorMessages);

            expect(
                errorMessages.get(placementWithPrerequisites.id)?.length
            ).toBe(1);
        });
        it("should not return an error if a placement's prerequisites are met", () => {
            const rule = new PrerequisitesRule();
            const errorMessages = new Map();
            const prerequisite1 = scheduleModuleFactory.build();
            const prerequisite2 = scheduleModuleFactory.build();
            const moduleWithPrerequisites = scheduleModuleFactory.build({
                prerequisites: [prerequisite1, prerequisite2],
            });
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
            };

            rule.validatePlacements(data, errorMessages);

            expect(errorMessages.size).toBe(0);
        });
        it("should not return an error if a placement has no prerequisites", () => {
            const rule = new PrerequisitesRule();
            const errorMessages = new Map();
            const placementWithoutPrerequisites: SchedulePlacement =
                schedulePlacementFactory.build();
            const data = {
                placements: ref([placementWithoutPrerequisites]),
            };

            rule.validatePlacements(data, errorMessages);

            expect(errorMessages.size).toBe(0);
        });
    });
});
