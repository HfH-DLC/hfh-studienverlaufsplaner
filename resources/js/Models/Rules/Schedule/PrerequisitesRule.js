import { isPreviousSemester, isSameDate } from "../../../helpers";
import BaseScheduleRule from "./BaseScheduleRule";
export default class PrerequisitesRule extends BaseScheduleRule {
    constructor() {
        super("Prerequisites");
    }

    validatePlacements(state, { placements }, errors) {
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

    validateModule(module, state, { placements }, errors) {
        const prerequisites = module.prerequisites;
        if (prerequisites.length == 0) {
            return;
        }
        const prerequisitesMet = module.events.some((event) =>
            this.eventMeetsPrerequisites(event, placements, prerequisites)
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

    validateSelection(module, state, { placements }, status) {
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
        //Fail if the event's time slot is already taken
        if (placements.find((placement) => isSameDate(placement, event))) {
            return false;
        }
        //check if all preqs are met
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
}
