import BaseFocusCreditRule from "./BaseFocusCreditRule";
export default class ECTSPerFocusRule extends BaseFocusCreditRule {
    constructor(params) {
        super("ECTSPerFocus");
        this.minECTS = params.minECTS;
        this.maxECTS = params.maxECTS;
    }

    validate(state, getters, errors) {
        getters.creditedModulesByFocusSelection.forEach(
            ({ focusSelectionId, moduleIds }) => {
                const modules = state.modules.filter((module) =>
                    moduleIds.includes(module.id)
                );
                const totalECTS = modules.reduce((acc, cur) => {
                    return acc + cur.ects;
                }, 0);
                if (this.minECTS && totalECTS < this.minECTS) {
                    errors.push(
                        `Sie müssen mindestens ${
                            this.minECTS
                        } Kreditpunkte an den SSP ${this.getFocusName(
                            focusSelectionId,
                            state.focusSelections
                        )} anrechnen.`
                    );
                }
                if (this.maxECTS && totalECTS > this.maxECTS) {
                    errors.push(
                        `Sie dürfen höchstens ${
                            this.maxECTS
                        } Kreditpunkte an den SSP ${this.getFocusName(
                            focusSelectionId,
                            state.focusSelections
                        )} anrechnen.`
                    );
                }
            }
        );
    }
}
