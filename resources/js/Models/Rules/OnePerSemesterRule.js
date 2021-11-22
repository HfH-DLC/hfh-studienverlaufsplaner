export default class OnePerSemesterRule {

    constructor(modulIds) {
        this._modulIds = modulIds
    }

    validateModules(plan) {
        const moduleErrors = {}

        const selectableModules = plan.modules.filter(module => this._modulIds.includes(module.id))

        if (selectableModules.length > 0) {
            const slotsPerSemester = plan.timeSlots.reduce((map, slot) => {
                if (!map.has(slot.semester)) {
                    map.set(slot.semester, [])
                }
                map.get(slot.semester).push(slot)
                return map
            }, new Map())

            let hasFreeSemester = false

            slotsPerSemester.forEach(semesterSlots => {
                if (semesterSlots.find(slot => !slot.module)) {
                    const conflictingSlot = semesterSlots.find(slot => {
                        return slot.module && this._modulIds.includes(slot.module.id)
                    })
                    if (!conflictingSlot) {
                        hasFreeSemester = true
                    }
                }
            })

            if (!hasFreeSemester) {
                selectableModules.forEach(module => {
                    moduleErrors[module.id] = this.getErrorMessage()
                })
            }
        }

        return moduleErrors
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

    validateSelection(moduleId, plan) {
        const selectionErrors = {}

        const takenSemesters = []

        plan.timeSlots.forEach((slot) => {
            if (takenSemesters.includes(slot.semester)) {
                selectionErrors[slot.id] = this.getErrorMessage()
            }
            if (slot.module && this._modulIds.includes(slot.module.id)) {
                takenSemesters.push(slot.semester)
            }
        })

        return selectionErrors
    }

    getErrorMessage() {
        return `Only one of ${this._modulIds.join(', ')} is allowed per semester`
    }

}