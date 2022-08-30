import { pluralize, joinStrings } from "../../../helpers";
export default class RequiredModulesTodo {
    getEntries(state, { categories }) {
        const requiredCategories = categories.filter(
            (category) => category.required
        );
        if (requiredCategories.length > 0) {
            return [
                {
                    label: this.getLabel(requiredCategories),
                    checked: this.validate(requiredCategories),
                    progressLabel: this.getProgressLabel(requiredCategories),
                },
            ];
        }
        return [];
    }

    getLabel(categories) {
        const categoryNames = categories.map(
            (category) => `"${category.name}"`
        );
        const categoryString = joinStrings(categoryNames, "und");
        return `Belegen Sie alle Module ${pluralize(
            categoryNames.length,
            "des Bereiches",
            "der Bereiche"
        )} ${categoryString}`;
    }

    validate(categories) {
        return !categories.some((category) =>
            category.modules.some((module) => !module.placement)
        );
    }

    getProgressLabel(categories) {
        const count = categories.reduce(
            (acc, cur) => {
                acc.total += cur.modules.length;
                acc.current += cur.modules.filter(
                    (module) => module.placement
                ).length;
                return acc;
            },
            { total: 0, current: 0 }
        );
        return `${count.current} / ${count.total}`;
    }
}
