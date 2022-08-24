import BaseScheduleRule from "./BaseScheduleRule";

export default class CategoriesECTSRule extends BaseScheduleRule {

    constructor() {
        super('CategoriesECTS');
    }

    validatePlacement(state, { categories }, errors) {
        categories.forEach((category) => {
            if (category.currentECTS > category.maxECTS) {
                errors.push(`Sie können im Bereich ${category.name} maximal ${category.maxECTS} Kreditpunkte belegen.`);
            }
            if (category.currentECTS < category.minECTS) {
                errors.push(`Sie müssen im Bereich ${category.name} mindestens ${category.minECTS} Kreditpunkte belegen.`);
            }
        });
    }

    validateModule() {}

    validateSelection() {}
}