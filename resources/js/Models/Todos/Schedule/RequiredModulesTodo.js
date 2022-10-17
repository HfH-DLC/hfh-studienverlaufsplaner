import { pluralize, joinStrings } from "../../../helpers";
export default class RequiredModulesTodo {
    getEntries(state, { categories }) {
        const requiredCategories = categories.filter(
            (category) => category.required
        );
        const entries = [];
        requiredCategories.forEach((category) => {
            entries.push({
                label: this.getLabel(category),
                checked: this.validate(category),
                progressLabel: this.getProgressLabel(category),
            });
        });
        return entries;
    }

    getLabel(category) {
        return `Belegen Sie alle Module des Bereiches "${category.name}"`;
    }

    validate(category) {
        return !category.modules.some((module) => !module.placement);
    }

    getProgressLabel(category) {
        const total = category.modules.length;
        const current = category.modules.filter(
            (module) => module.placement
        ).length;
        return `${current} / ${total}`;
    }
}
