export default class OnePerSemesterRule {

    constructor(modulIds) {
        this._modulIds = modulIds
    }

    validateSlots(timeSlots, errors) {

        const takenSemesters = []

        timeSlots.forEach((slot) => {
            if (this._modulIds.includes(slot.moduleId)) {
                if (takenSemesters.includes(slot.semester)) {
                    slotErrors[slot.id] = this.getErrorMessage()
                }
                takenSemesters.push(slot.semester)
            }
        })
    }

    doesMatchSelection(moduleId) {
        return this._modulIds.includes(moduleId)
    }

    validateSelection(module, timeSlots, errors) {
        const takenSemesters = []
        timeSlots.forEach((slot) => {
            if (this._modulIds.includes(slot.moduleId)) {
                takenSemesters.push(slot.semester)
            }
        })
        takenSemesters.forEach(semester => {
            timeSlots.filter(slot => slot.semester == semester).forEach(slot => {
                errors[slot.id].push(this.getErrorMessage());
            });
        })
    }

    getErrorMessage() {
        return `Only one of ${this._modulIds.join(', ')} is allowed per semester`
    }

}