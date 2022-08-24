import BaseFocusCreditRule from "./BaseFocusCreditRule";
export default class AtLeastOneOfModulesPerFocusRule extends BaseFocusCreditRule {
    constructor(params) {
        super("AtLeastOneOfModulesPerFocusFocus");
        this.moduleIds = params.moduleIds;
    }

    validate(state, getters, errors) {
        state.focusSelections.forEach((focusSelection) => {
            const requriedModules = state.modules.filter((module) =>
                this.moduleIds.includes(module.id)
            );
            const requiredModuleCount = requriedModules.reduce((acc, cur) => {
                if (cur.creditedAgainst == focusSelection.id) {
                    acc++;
                }
                return acc;
            }, 0);
            if (requiredModuleCount < 1) {
                const moduleNames = requriedModules.map(
                    (module) => `${module.id} ${module.name}`
                );
                const moduleString =
                    moduleNames.slice(0, moduleNames.length - 1).join(", ") +
                    " oder " +
                    moduleNames[moduleNames.length - 1];
                errors.push(
                    `Sie müssen mindestens eines der Module ${moduleString} an den SSP ${this.getFocusName(
                        focusSelection.id,
                        state.focusSelections
                    )} anrechnen.`
                );
            }
        });
    }
}
