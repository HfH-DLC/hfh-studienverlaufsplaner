export const ALL_REQUIRED = -1;

export default class Category {
    constructor(name, modules = [], requiredNumber = ALL_REQUIRED) {
        this.name = name
        this._modules = modules
        if (requiredNumber == ALL_REQUIRED) {
            this.requiredNumber = modules.length
        } else {
            this.requiredNumber = requiredNumber
        }
        this.placedNumber = 0
    }

    get modules() {
        return this._modules
    }

    hasModule(moduleId) {
        return this._modules.findIndex(module => module.id == moduleId) != -1
    }

    removeModule(moduleId) {
        const index = this._modules.findIndex(module => module.id == moduleId)
        if (index == -1) {
            return
        }
        const module = this._modules[index];
        this.modules.splice(index, 1);

        this.placedNumber++;

        return module;
    }
}