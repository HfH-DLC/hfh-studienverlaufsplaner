export default class OnePerSemesterRule {

    constructor(modulIds) {
        this._modulIds = modulIds
    }

    validateSlots(plan) {
        const slotErrors = {}

        const takenSemesters = []

        plan.timeSlots.forEach((slot) => {
            if (slot.module && this._modulIds.includes(slot.module.id)) {
                if (takenSemesters.includes(slot.semester)) {
                    slotErrors[slot.id] = this.getErrorMessage()
                }
                takenSemesters.push(slot.semester)
            }
        })

        return slotErrors
    }

    doesMatchSelection(moduleId) {
        return this._modulIds.includes(moduleId)
    }

    validateSelection(moduleId, plan, slotStatus) {
        const selectionErrors = {}

        const takenSemesters = []

        plan.timeSlots.forEach((slot) => {
            if (slot.module && this._modulIds.includes(slot.module.id)) {
                takenSemesters.push(slot.semester)
            }
        })

        takenSemesters.forEach(semester => {
            plan.timeSlots.filter(slot => slot.semester == semester).forEach(slot => {
                slotStatus[slot.id].selectable = false;
                slotStatus[slot.id].errors.push(this.getErrorMessage());
                selectionErrors[slot.id] = this.getErrorMessage();
            });
        })

        return selectionErrors
    }

    getErrorMessage() {
        return `Only one of ${this._modulIds.join(', ')} is allowed per semester`
    }

}