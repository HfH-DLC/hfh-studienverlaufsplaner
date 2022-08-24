import BaseFocusCreditRule from './BaseFocusCreditRule';
export default class ECTSPerFocusRule extends BaseFocusCreditRule {

    constructor(params) {
        super('ECTSPerFocus');
        this.params = params
    }

    validate(focusCredits, focusSelections, modules, addError) {
        Object.entries(focusCredits).forEach(([focusSelectionId, moduleIds]) => {
            const totalECTS = moduleIds.map(id => modules.find(module => module.id === id)).reduce((acc, cur) => {
                return acc + cur.ects;
            }, 0);
            if (this.params.minECTS && totalECTS < this.params.minECTS) {
                addError('global', `Sie müssen mindestens ${this.params.minECTS} Kreditpunkte an den SSP ${this.getFocusName(focusSelectionId, focusSelections)} anrechnen.`)
            }
            if (this.params.maxECTS && totalECTS > this.params.maxECTS) {
                addError('global', `Sie dürfen höchstens ${this.params.maxECTS} Kreditpunkte an den SSP ${this.getFocusName(focusSelectionId, focusSelections)} anrechnen.`)
            }
        })
    }
}