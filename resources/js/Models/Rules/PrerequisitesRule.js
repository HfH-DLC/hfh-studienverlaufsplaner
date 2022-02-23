import Rule from "./Rule"
import { isPreviousSemester, isSameDate } from "../../helpers"
export default class PrerequisitesRule extends Rule {

    constructor() {
        super("prerequisites")
    }

    validatePlacements(placements, errors) {
        placements.forEach(placement => {
            const missingPrerequisites = [];
            const prerequisites = placement.module.prerequisites;

            prerequisites.forEach(prerequisite => {
                const meetsPrerequisite = placements
                    .filter(prerequisitePlacement => {
                        return prerequisitePlacement.moduleId == prerequisite.id
                    })
                    .some(prerequisitePlacement => {
                        return isPreviousSemester(prerequisitePlacement, placement);
                    })
                if (!meetsPrerequisite) {
                    missingPrerequisites.push(prerequisite);
                }
            });

            if (missingPrerequisites.length > 0) {
                errors[placement.id].push(this.getPlacementErrorMessage(placement.module, missingPrerequisites))
            }
        })
    }


    validateModule(module, placements, errors) {
        const prerequisites = module.prerequisites;
        const prerequisitesMet = module.events.some(event => this.eventMeetsPrerequisites(event, placements, prerequisites))
        if (!prerequisitesMet) {
            errors.push(this.getModuleErrorMessage(module, module.prerequisites))
        }
    }

    validateSelection(module, placements, status) {
        const prerequisites = module.prerequisites;

        module.events.forEach(event => {
            if (!this.eventMeetsPrerequisites(event, placements, prerequisites)) {
                status[event.id].valid = false
            }
        })
    }

    eventMeetsPrerequisites(event, placements, prerequisites) {
        //Fail if the event's time slot is already taken
        if (placements.find(placement => isSameDate(placement, event))) {
            return false;
        }
        //check if all preqs are met
        return prerequisites.every(prerequisite => {
            return placements
                .filter(placement => {
                    return placement.moduleId == prerequisite.id
                })
                .some(placement => {
                    return isPreviousSemester(placement, event);
                })
        });
    }

    getModuleErrorMessage(module, missingPrerequisites) {
            if (missingPrerequisites.length === 1) {
                const prerequisite = missingPrerequisites[0];
                return `<a href="#module-${prerequisite.id}">${prerequisite.id} ${prerequisite.name}</a> muss vor diesem Modul belegt werden.`
            }
            return `Die Module ${missingPrerequisites.map(prerequisite => `<a href="#module-${prerequisite.id}">${prerequisite.id} ${prerequisite.name}</a>`).join(", ")} müssen vor diesem Modul belegt werden.`
}

    getPlacementErrorMessage(module, missingPrerequisites) {
            if (missingPrerequisites.length === 1) {
                const prerequisite = missingPrerequisites[0];
                return `<a href="#module-${prerequisite.id}">${prerequisite.id} ${prerequisite.name}</a> muss vor <a href="#module-${module.id}">${module.id} ${module.name}</a> belegt werden.`
            }
            return `Die Module ${missingPrerequisites.map(prerequisite => `<a href="#module-${prerequisite.id}">${prerequisite.id} ${prerequisite.name}</a>`).join(", ")} müssen vor <a href="#module-${module.id}">${module.id} ${module.name}</a> belegt werden.`
    }

}