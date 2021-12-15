import Rule from "./Rule"
export default class PrerequisitesRule extends Rule {

    constructor() {
        super("prerequisites")
    }

    validateSlots(timeSlots, errors) {

        let beforeSlots = []

        //todo ensure sorting
        timeSlots.forEach((slot) => {
            const prerequisites = slot.module ? slot.module.prerequisites : [];
            const missingPrerequisites = [];
            prerequisites.forEach(prerequisite => {
                const module = beforeSlots.find(beforeSlot => {
                    return prerequisite.id === beforeSlot.module.id && this.isPreviousSemester(beforeSlot, slot);
                })
                if (!module) {
                    missingPrerequisites.push(prerequisite)
                }
            });

            if (missingPrerequisites.length > 0) {
                errors[slot.id].push(this.getErrorMessage(slot.module, missingPrerequisites));
            }
            if (slot.module) {
                beforeSlots.push(slot)
            }
        })
    }

    isPreviousSemester(before, after) {
        if (before.year > after.year) {
            return false;
        }
        if (before.year === after.year) {
            return before.semester === 'HS' && after.semester === 'FS'
        }
        return true;
    }

    validateModule(module, timeSlots, errors) {

        const beforeSlots = []

        let hasValidSlot;

        //todo ensure sorting
        timeSlots.forEach((slot) => {
            const missingPrerequisites = [];
            module.prerequisites.forEach(prerequisite => {
                const module = beforeSlots.find(beforeSlot => {
                    return prerequisite.id === beforeSlot.module.id && this.isPreviousSemester(beforeSlot, slot);
                })
                if (!module) {
                    missingPrerequisites.push(prerequisite)
                }
            });

            if (missingPrerequisites.length === 0 && !slot.module) {
                hasValidSlot = true
            }
            if (slot.module) {
                beforeSlots.push(slot)
            }
        })

        if (!hasValidSlot) {
            errors.push(this.getErrorMessage(module, module.prerequisites))
        }
    }

    validateSelection(module, timeSlots, selectableStatus) {

        const beforeSlots = []

        //todo ensure sorting
        timeSlots.forEach((slot) => {
            const missingPrerequisites = [];
            module.prerequisites.forEach(prerequisite => {
                const module = beforeSlots.find(beforeSlot => {
                    return prerequisite.id === beforeSlot.module.id && this.isPreviousSemester(beforeSlot, slot);
                })
                if (!module) {
                    missingPrerequisites.push(prerequisite)
                }
            });

            if (missingPrerequisites.length > 0) {
                selectableStatus[slot.id] = false;
            }
            if (slot.module) {
                beforeSlots.push(slot)
            }
        })
    }

    getErrorMessage(module, missingPrerequisites) {
            if (missingPrerequisites.length === 1) {
                const prerequisite = missingPrerequisites[0];
                return `${prerequisite.number} ${prerequisite.name} muss vor ${module.number} ${module.name} belegt werden.`
            }
            return `Die Module ${missingPrerequisites.map(prerequisite => `${prerequisite.number} ${prerequisite.name}`).join(", ")} müssen vor ${module.number} ${module.name} belegt werden.`
    }

}