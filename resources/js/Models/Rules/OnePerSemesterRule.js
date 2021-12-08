import Rule from "./Rule"
export default class OnePerSemesterRule extends Rule {

    constructor(modulIds) {
        super("onePerSemester")
        this.modulIds = modulIds
    }

    validateSlots(timeSlots, errors) {

        const takenSemesters = []

        timeSlots.forEach((slot) => {
            if (this.modulIds.includes(slot.moduleId)) {
                if (takenSemesters.find(semester => semester.year === slot.year && semester.semester === slot.semester)) {
                    slotErrors[slot.id] = this.getErrorMessage()
                }
                takenSemesters.push({ year: slot.year, semester: slot.semester });
            }
        })
    }

    doesMatchSelection(moduleId) {
        return this.modulIds.includes(moduleId)
    }

    validateSelection(module, timeSlots, errors) {
        const takenSemesters = []
        timeSlots.forEach((slot) => {
            if (this.modulIds.includes(slot.moduleId)) {
                takenSemesters.push({ year: slot.year, semester: slot.semester })
            }
        })
        takenSemesters.forEach(semester => {
            timeSlots.filter(slot => slot.year == semester.year && slot.semester == semester.semester).forEach(slot => {
                errors[slot.id].push(this.getErrorMessage());
            });
        })
    }

    getErrorMessage() {
        return `Only one of ${this.modulIds.join(', ')} is allowed per semester`
    }

}