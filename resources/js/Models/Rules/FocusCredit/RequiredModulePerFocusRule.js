import BaseFocusCreditRule from './BaseFocusCreditRule';
export default class RequiredModulesPerFocusRule extends BaseFocusCreditRule {

    constructor(params) {
        super('RequiredModulesPerFocus');
        this.params = params
    }

    validate(focusCredits, focusSelections, modules, errors) {
        const requiredModuleIds = this.params.moduleIds
        console.log(this.params)
        Object.entries(focusCredits).forEach(([focusSelectionId, moduleIds]) => {
            const requiredModuleCount = moduleIds.reduce((acc, cur) => {
                if (requiredModuleIds.includes(cur)) {
                    acc++;
                }
                return acc;
            }, 0)
            if (requiredModuleCount < 1) {
                const moduleString = requiredModuleIds.slice(0, requiredModuleIds.length - 1).join(", ") + " oder " + requiredModuleIds[moduleIds.length - 1];
                errors.push(`Sie müssen mindestens eines der Module ${moduleString} an den SSP ${this.getFocusName(focusSelectionId, focusSelections)} anrechnen.`)
            }
        })
    }
}