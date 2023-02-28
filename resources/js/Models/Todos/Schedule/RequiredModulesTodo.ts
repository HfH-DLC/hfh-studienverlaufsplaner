import { ChecklistEntryData, ScheduleCategory, Todo } from "@/types";
import { Ref } from "vue";

export default class RequiredModulesTodo implements Todo {
    getEntries({ categories }: { categories: Ref<Array<ScheduleCategory>> }) {
        const requiredCategories = categories.value.filter(
            (category) => category.required
        );
        const entries: Array<ChecklistEntryData> = [];
        requiredCategories.forEach((category) => {
            entries.push({
                component: "RequiredModulesLabel",
                labelProps: {
                    category,
                },
                checked: this.validate(category),
                progressLabel: this.getProgressLabel(category),
            });
        });
        return entries;
    }

    validate(category: ScheduleCategory) {
        return !category.modules.some((module) => !module.placement);
    }

    getProgressLabel(category: ScheduleCategory) {
        const total = category.modules.length;
        const current = category.modules.filter(
            (module) => module.placement
        ).length;
        return `${current} / ${total}`;
    }
}
