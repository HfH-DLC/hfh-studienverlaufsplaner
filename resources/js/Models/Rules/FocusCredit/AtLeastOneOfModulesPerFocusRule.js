import { joinStrings } from "../../../helpers";
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
            const count = requriedModules.reduce((acc, cur) => {
                if (cur.creditedAgainst == focusSelection.id) {
                    acc++;
                }
                return acc;
            }, 0);
            if (count < 1) {
                const moduleString = joinStrings(this.moduleIds, "oder");
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
