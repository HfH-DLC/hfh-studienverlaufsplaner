export default class Plan {

    constructor(categories, timeSlots, rules) {
        this._categories = categories
        this._timeSlots = timeSlots
        this._rules = rules
        this._validate()
    }

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
            return {
                ...slot,
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

    placeModule(slotId, moduleId) {
        const slot = this._timeSlots.find(slot => slot.id == slotId);
        const module = this._removeModule(moduleId);
        if (module) {
            slot.module = module;
        }
        this._validate();
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
        console.log("SlotErrors", this._slotErrors);
    }

    _validateModules() {
        this._moduleSelectable = {}
        this.modules.forEach(module => {
            const selectionStatus = this.validateSelection(module.id);
            this._moduleSelectable[module.id] = Object.values(selectionStatus).some(status => status.selectable);
        });
    }

    validateSelection(moduleId) {
        let selectionStatus = this._timeSlots.reduce((acc, cur) => {
            acc[cur.id] = {
                selectable: !cur.module,
                errors: []
            }
            return acc;
        }, {});
        this._rules.forEach(rule => {
            if (rule.doesMatchSelection(moduleId)) {
                rule.validateSelection(moduleId, this, selectionStatus);
            }
        })
        return selectionStatus;
    }
}