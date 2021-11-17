export default class Plan {

    constructor(modules, timeSlots, rules) {
        this._modules = modules
        this._timeSlots = timeSlots
        this._rules = rules
        this._validate()
    }

    get modules() {
        const result = this._modules.map(module => {
            return {
                ...module,
                errors: this._moduleErrors[module.id]
            }
        })
        return result;
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
        const moduleIndex = this._modules.findIndex(module => module.id == moduleId);
        if (moduleIndex != -1) {
            const removedElements = this._modules.splice(moduleIndex, 1);
            const module = removedElements[0];
            slot.module = module;
        }
        this._validate();
    }

    _validate() {
        this._moduleErrors = [];
        this._slotErrors = [];
        this._rules.forEach(rule => {
            const moduleErrors = rule.validateModules(this);
            Object.entries(moduleErrors).forEach(([key, value]) => {
                if (!this._moduleErrors[key]) {
                    this._moduleErrors[key] = []
                }
                this._moduleErrors[key].push(value);
            })
            const slotErrors = rule.validateSlots(this);
            Object.entries(slotErrors).forEach(([key, value]) => {
                if (!this._slotErrors[key]) {
                    this._slotErrors[key] = []
                }
                this._slotErrors[key].push(value);
            })
        })
        console.log("ModuleErrors", this._moduleErrors);
        console.log("SlotErrors", this._slotErrors);
    }

    validateSelection(moduleId) {
        let selectionErrors = {}
        this._rules.forEach(rule => {
            if (rule.doesMatchSelection(moduleId)) {
                const errors = rule.validateSelection(moduleId, this);
                Object.entries(errors).forEach(([key, value]) => {
                    if (!selectionErrors[key]) {
                        selectionErrors[key] = []
                    }
                    selectionErrors[key].push(value);
                })
            }
        })
        console.log("SelectionErrors", selectionErrors);

        return selectionErrors;
    }
}