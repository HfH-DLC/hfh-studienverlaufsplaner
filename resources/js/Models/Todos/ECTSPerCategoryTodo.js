export default class ECTSPerCategoryTodo {
    getEntries(state, { categories }) {
        const entries = categories
            .filter((category) => category.minECTS || category.maxECTS)
            .map((category) => ({
                label: this.getLabel(category),
                checked: this.validate(category),
            }));
        return entries;
    }

    getLabel(category) {
        let label;
        if (category.minECTS && category.maxECTS) {
            if (category.minECTS == category.maxECTS) {
                label = `Belegen Sie im Bereich "${category.name}" ${category.minECTS} ECTS Kreditpunkte.`;
            } else {
                label = `Belegen Sie im Bereich "${category.name}" zwischen ${category.minECTS} und ${category.maxECTS} ECTS Kreditpunkte.`;
            }
        } else {
            if (category.minECTS) {
                label = `Belegen Sie im Bereich "${category.name}" mindestens ${category.minECTS} ECTS Kreditpunkte.`;
            }
            if (category.maxECTS) {
                label = `Belegen Sie im Bereich "${category.name}" bis zu ${category.maxECTS} ECTS Kreditpunkte.`;
            }
        }
        return label;
    }

    validate(category) {
        if (category.minECTS && category.currentECTS < category.minECTS) {
            return false;
        }
        if (category.maxECTS && category.currentECTS > category.maxECTS) {
            return false;
        }
        return true;
    }

    getCategory(categories) {
        return categories.find((category) => category.id === this.categoryId);
    }
}
