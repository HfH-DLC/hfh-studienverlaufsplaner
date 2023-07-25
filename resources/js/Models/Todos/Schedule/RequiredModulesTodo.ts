import RequiredModulesLabel from "@/Components/Todos/Schedule/RequiredModulesLabel.vue";
import {
    ChecklistEntryData,
    PriorLearning,
    ScheduleCategory,
    Todo,
} from "@/types";
import { markRaw, Ref } from "vue";

export default class RequiredModulesTodo implements Todo {
    getEntries({
        categories,
        priorLearnings,
    }: {
        categories: Ref<Array<ScheduleCategory>>;
        priorLearnings: Ref<Array<PriorLearning>>;
    }) {
        const requiredCategories = categories.value.filter(
            (category) => category.required
        );
        const entries: Array<ChecklistEntryData> = [];
        requiredCategories.forEach((category) => {
            entries.push({
                component: markRaw(RequiredModulesLabel),
                labelProps: {
                    category,
                },
                checked: this.validate(category, priorLearnings.value),
                progressLabel: this.getProgressLabel(
                    category,
                    priorLearnings.value
                ),
            });
        });
        return entries;
    }

    validate(category: ScheduleCategory, priorLearnings: Array<PriorLearning>) {
        return !category.modules.some(
            (module) =>
                !module.placement &&
                !priorLearnings.some(
                    (priorLearning) =>
                        priorLearning.countsAsModuleId === module.id
                )
        );
    }

    getProgressLabel(
        category: ScheduleCategory,
        priorLearnings: Array<PriorLearning>
    ) {
        const total = category.modules.length;
        const current = category.modules.filter((module) => {
            return (
                module.placement ||
                priorLearnings.some(
                    (priorLearning) =>
                        module.id == priorLearning.countsAsModuleId
                )
            );
        }).length;
        return `${current} / ${total}`;
    }
}
