import Rule from "./Rule"
export default class PrerequisitesRule extends Rule {

    constructor() {
        super("prerequisites")
    }

    validateSlots(timeSlots, errors) {

        let beforeSlots = []

        //todo ensure sorting
        const sortedTimeSlots = timeSlots.sort((a, b) => {
            return a.year - b.year || a.semester.localeCompare(b.semester)
        });
        sortedTimeSlots.forEach((slot) => {
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
                errors[slot.id].push(this.getSlotErrorMessage(slot.module, missingPrerequisites));
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
        const sortedTimeSlots = timeSlots.sort((a, b) => {
            return a.year - b.year || a.semester.localeCompare(b.semester)
        });
        sortedTimeSlots.forEach((slot) => {
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
            errors.push(this.getModuleErrorMessage(module, module.prerequisites))
        }
    }

    validateSelection(module, timeSlots, status) {

        const beforeSlots = []

        //todo ensure sorting
        const sortedTimeSlots = timeSlots.sort((a, b) => {
            return a.year - b.year || a.semester.localeCompare(b.semester)
        });
        sortedTimeSlots.forEach((slot) => {
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
                status[slot.id].selectable = false;
            }
            if (slot.module) {
                beforeSlots.push(slot)
            }
        })
    }

    getModuleErrorMessage(module, missingPrerequisites) {
            if (missingPrerequisites.length === 1) {
                const prerequisite = missingPrerequisites[0];
                return `<a href="#module-${prerequisite.id}">${prerequisite.number} ${prerequisite.name}</a> muss vor diesem Modul belegt werden.`
            }
            return `Die Module ${missingPrerequisites.map(prerequisite => `<a href="#module-${prerequisite.id}">${prerequisite.number} ${prerequisite.name}</a>`).join(", ")} müssen vor diesem Modul belegt werden.`
}

    getSlotErrorMessage(module, missingPrerequisites) {
            if (missingPrerequisites.length === 1) {
                const prerequisite = missingPrerequisites[0];
                return `<a href="#module-${prerequisite.id}">${prerequisite.number} ${prerequisite.name}</a> muss vor <a href="#module-${module.id}">${module.number} ${module.name}</a> belegt werden.`
            }
            return `Die Module ${missingPrerequisites.map(prerequisite => `<a href="#module-${prerequisite.id}">${prerequisite.number} ${prerequisite.name}</a>`).join(", ")} müssen vor <a href="#module-${module.id}">${module.number} ${module.name}</a> belegt werden.`
    }

}