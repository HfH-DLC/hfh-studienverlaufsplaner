import Rule from "./Rule"
export default class SemesterRule extends Rule {

    constructor(params) {
        super("semester")
        this.excludePositions = params.excludePositions
        this.moduleId = params.moduleId
    }

    validatePlacements(placements, errors) {
        const semesters = this.getSemesters(placements);
        const allowedSemesters = semesters.filter((semester, index) => {
            return !this.excludePositions.includes(index);
        })
        placements.filter(placement => placement.moduleId == this.moduleId).forEach((placement) => {
            if (!allowedSemesters.includes(this.getSemesterKey(placement.year, placement.semester))) {
                const text = this.excludePositions.reduce((acc, cur, i, array) => {
                    return acc + (cur + 1) + '.' + (i < array.length - 2 ? ', ' : i < array.length - 1 ? ' oder ' : '')
                }, "");
                errors[placement.id].push(`<a href="#module-${placement.module.id}">${placement.module.number} ${placement.module.name}</a> kann nicht im ${text} Semester belegt werden.`);
            }
        })
    }

    validateModule(module, placements, errors) {}

    validateSelection(module, placements, status) {
        if (module.id !== this.moduleId) {
            return
        }
        const semesters = this.getSemesters(module.events);
        const allowedSemesters = semesters.filter((semester, index) => {
            return !this.excludePositions.includes(index);
        })
        module.events.forEach((event) => {
            status[event.id].dateAllowed = allowedSemesters.includes(this.getSemesterKey(event.year, event.semester));
        })
    }

    getSemesterKey(year, semester) {
        return `${year}-${semester}`;
    }

    getSemesters(date) {
        return [...new Set(date.map(date => {
            return this.getSemesterKey(date.year, date.semester);
        }))].sort((a, b) => a.localeCompare(b))
    }
}