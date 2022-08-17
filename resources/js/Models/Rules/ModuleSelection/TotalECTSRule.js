import BaseModuleSelectionRule from './BaseModuleSelectionRule';
export default class TotalECTSRule extends BaseModuleSelectionRule {

    constructor(params) {
        super('ECTSPerFocus');
        this.params = params
    }

    validate(categories, addError) {
        const totalECTS = categories.reduce((acc, cur) => {
            return acc + cur.currentCredits;
        }, 0);
        if (totalECTS != this.params.requiredECTS) {
            addError(
                "total",
                `Sie müssen insgesamt ${this.params.requiredECTS} aus dem Wahlpflicht- und Wahlangebot Kreditpunkte belegen.`
            );
        }
    }
}