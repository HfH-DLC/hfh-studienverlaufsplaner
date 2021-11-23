export default class Plan {

    constructor(categories, timeSlots, rules) {
        this._categories = categories
        this._timeSlots = timeSlots
        this._rules = rules
        this._selectionStatus = this._intialSelectionStatus();
        this._validate()
    }

    //Getters

    get categories() {
        return this._categories.map(category => {
            return {
                ...category,
                modules: category.modules.map(module => {
                    return {
                        ...module,
                        selectable: this._moduleSelectable[module.id],
                    }
                })
            }
        })
    }

    get modules() {
        return this.categories.reduce((acc, category) => {
            category.modules.forEach(module => {
                acc.push(module)
            })
            return acc;
        }, [])
    }

    get timeSlots() {
        return this._timeSlots.map(slot => {
            const status = this._selectionStatus.slots[slot.id]
            return {
                ...slot,
                removable: status.removable,
                selectable: status.selectable,
                errors: this._slotErrors[slot.id]
            }
        })
    }

    get credits() {
        let result = 0;
        this._timeSlots.forEach(timeSlot => {
            if (timeSlot.module) {
                result += timeSlot.module.credits
            }
        })
        return result
    }

    get selectedModuleId() {
        return this._selectionStatus.id
    }

    get selectedModule() {
        return this.modules.find(module => module.id == this._selectionStatus.id)
    }

    get semesters() {
        return [
            ...new Set(
                this.timeSlots.map((slot) => {
                    return slot.semester;
                })
            ),
        ].map((semester) => {
            const slotsBySemester = this.timeSlots.filter(
                (slot) => slot.semester == semester
            );
            return {
                label: semester,
                weeks: new Set(slotsBySemester.map((slot) => slot.week)),
                days: new Set(slotsBySemester.map((slot) => slot.day)),
                times: new Set(slotsBySemester.map((slot) => slot.time)),
            };
        });
    }

    //External Methods

    placeModule(slotId) {
        const slot = this._timeSlots.find(slot => slot.id == slotId);
        const module = this._removeModule(this._selectionStatus.id);
        if (module) {
            slot.module = module;
        }
        this._selectionStatus = this._intialSelectionStatus();
        this._validate();
    }

    selectSlotModule(slotId) {
        const slot = this._timeSlots.find(slot => slot.id == slotId);
        const module = slot.module;
        slot.module = null;
        this._addModule(module);
        this._validate();
        this.toggleSelect(module.id);
    }

    toggleSelect(moduleId) {
        if (this._selectionStatus.id == moduleId) {
            this._selectionStatus = this._intialSelectionStatus();
        } else {
            this._selectionStatus = this._validateSelection(moduleId);
        }
    }

    //Internal Methods
    _intialSelectionStatus(moduleId) {
        const slots = this._timeSlots.reduce((acc, cur) => {
            acc[cur.id] = {
                removable: !moduleId && !!cur.module,
                selectable: moduleId && !cur.module,
                errors: []
            }
            return acc;
        }, {});

        return {
            id: moduleId,
            slots
        }
    }

    _addModule(module) {
        const category = this._categories.find((category => {
            return category.id == module.category.id
        }))
        if (category) {
            return category.addModule(module)
        }
    }

    _removeModule(moduleId) {
        const category = this._categories.find((category => {
            return category.hasModule(moduleId)
        }))
        if (category) {
            return category.removeModule(moduleId)
        }
    }

    _validate() {
        this._slotErrors = [];
        this._validateModules();
        this._rules.forEach(rule => {
            const slotErrors = rule.validateSlots(this);
            Object.entries(slotErrors).forEach(([key, value]) => {
                if (!this._slotErrors[key]) {
                    this._slotErrors[key] = []
                }
                this._slotErrors[key].push(value);
            })
        })
    }

    _validateModules() {
        this._moduleSelectable = {}
        this.modules.forEach(module => {
            const selectionStatus = this._validateSelection(module.id);
            this._moduleSelectable[module.id] = Object.values(selectionStatus.slots).some(status => status.selectable);
        });
    }

    _validateSelection(moduleId) {
        let selectionStatus = this._intialSelectionStatus(moduleId)
        this._rules.forEach(rule => {
            if (rule.doesMatchSelection(moduleId)) {
                rule.validateSelection(moduleId, this, selectionStatus.slots);
            }
        })
        return selectionStatus;
    }
}