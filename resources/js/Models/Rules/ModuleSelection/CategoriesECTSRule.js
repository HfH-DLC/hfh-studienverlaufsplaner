import BaseModuleSelectionRule from './BaseModuleSelectionRule';
export default class TotalECTSRule extends BaseModuleSelectionRule {

    constructor() {
        super('ECTSPerFocus');
    }

    validate(categories, addError) {
        categories.forEach((category) => {
            if (category.currentCredits > category.maxCredits) {
                addError(
                    `categories.${category.id}`,
                    `Sie können im Bereich ${category.name} maximal ${category.maxCredits} Kreditpunkte belegen.`
                );
            }
            if (category.currentCredits < category.minCredits) {
                addError(
                    `categories.${category.id}`,
                    `Sie müssen im Bereich ${category.name} mindestens ${category.minCredits} Kreditpunkte belegen.`
                );
            }
        });
    }
}