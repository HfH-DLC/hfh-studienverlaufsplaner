import Rule from "./Rule"
export default class SemesterRule extends Rule {

    constructor(params) {
        super("semester")
        this.excludePositions = params.excludePositions
        this.moduleId = params.moduleId
    }

    validateSlots(timeSlots, errors) {
        const semesters = this.getSemesters(timeSlots);
        const allowedSemesters = semesters.filter((semester, index) => {
            return !this.excludePositions.includes(index);
        })
        timeSlots.filter(slot => slot.module && slot.module.id == this.moduleId).forEach((slot) => {
            if (!allowedSemesters.includes(this.getSemesterKey(slot.year, slot.semester))) {
                const text = this.excludePositions.reduce((acc, cur, i, array) => {
                    return acc + (cur + 1) + '.' + (i < array.length - 2 ? ', ' : i < array.length - 1 ? ' oder ' : '')
                }, "");
                errors[slot.id].push(`<a href="#module-${slot.module.id}">${slot.module.number} ${slot.module.name}</a> kann nicht im ${text} Semester belegt werden.`);
            }
        })
    }

    validateModule(module, timeSlots, errors) {}

    validateSelection(module, timeSlots, status) {
        if (module.id !== this.moduleId) {
            return
        }
        const semesters = this.getSemesters(timeSlots);
        const allowedSemesters = semesters.filter((semester, index) => {
            return !this.excludePositions.includes(index);
        })
        timeSlots.forEach((slot) => {
            status[slot.id].dateAllowed = allowedSemesters.includes(this.getSemesterKey(slot.year, slot.semester));
        })
    }

    getSemesterKey(year, semester) {
        return `${year}-${semester}`;
    }

    getSemesters(timeSlots) {
        return [...new Set(timeSlots.map(timeSlot => {
            return this.getSemesterKey(timeSlot.year, timeSlot.semester);
        }))].sort((a, b) => a.localeCompare(b))
    }
}