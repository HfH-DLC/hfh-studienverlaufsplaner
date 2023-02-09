export default class ECTSPerCategoryTodo {
    getEntries({ categories }) {
        const entries = categories
            .filter((category) => category.minECTS || category.maxECTS)
            .map((category) => ({
                component: "ECTSPerCategoryLabel",
                labelProps: {
                    category,
                },
                progressLabel: `${category.currentECTS}`,
                checked: this.validate(category),
            }));
        return entries;
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
