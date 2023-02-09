import { isPreviousSemester, isSameDate } from "../../../helpers";
export default class PrerequisitesRule {
    validatePlacements({ placements }, errors) {
        placements.forEach((placement) => {
            const missingPrerequisites = [];
            const prerequisites = placement.module.prerequisites;
            if (prerequisites.length == 0) {
                return;
            }
            prerequisites.forEach((prerequisite) => {
                const meetsPrerequisite = placements
                    .filter((prerequisitePlacement) => {
                        return (
                            prerequisitePlacement.moduleId == prerequisite.id
                        );
                    })
                    .some((prerequisitePlacement) => {
                        return isPreviousSemester(
                            prerequisitePlacement,
                            placement
                        );
                    });
                if (!meetsPrerequisite) {
                    missingPrerequisites.push(prerequisite);
                }
            });

            if (missingPrerequisites.length > 0) {
                errors[placement.id].push({
                    component: "PrerequisitesRuleLabel",
                    labelProps: {
                        missingPrerequisites,
                        module: placement.module,
                    },
                });
            }
        });
    }

    validateModule(module, { placements }, errors) {
        const prerequisites = module.prerequisites;
        if (prerequisites.length == 0) {
            return;
        }

        const prerequisitesMet = module.events.some(
            (event) =>
                this.eventMeetsPrerequisites(
                    event,
                    placements,
                    prerequisites
                ) && this.timeSlotIsFree(module.id, event, placements)
        );
        if (!prerequisitesMet) {
            errors.push({
                component: "PrerequisitesRuleLabel",
                labelProps: {
                    missingPrerequisites: module.prerequisites,
                    module,
                },
            });
        }
    }

    validateSelection(module, { placements }, status) {
        const prerequisites = module.prerequisites;
        if (prerequisites.length == 0) {
            return;
        }
        module.events.forEach((event) => {
            if (
                !this.eventMeetsPrerequisites(event, placements, prerequisites)
            ) {
                status[event.id].dateAllowed = false;
            }
        });
    }

    eventMeetsPrerequisites(event, placements, prerequisites) {
        return prerequisites.every((prerequisite) => {
            return placements
                .filter((placement) => {
                    return placement.moduleId == prerequisite.id;
                })
                .some((placement) => {
                    return isPreviousSemester(placement, event);
                });
        });
    }

    timeSlotIsFree(moduleId, event, placements) {
        const placement = placements.find((placement) => {
            return isSameDate(placement, event);
        });
        if (!placement) {
            return true;
        }
        return placement.moduleId == moduleId;
    }
}
