import ECTSPerCategoryLabel from "@/Components/Todos/Schedule/ECTSPerCategoryLabel.vue";
import { ScheduleCategory, Todo } from "@/types";
import { markRaw, Ref } from "vue";

export default class ECTSPerCategoryTodo implements Todo {
    getEntries({ categories }: { categories: Ref<Array<ScheduleCategory>> }) {
        const entries = categories.value
            .filter((category) => category.minECTS || category.maxECTS)
            .map((category) => ({
                component: markRaw(ECTSPerCategoryLabel),
                labelProps: {
                    category,
                },
                progressLabel: `${category.currentECTS}`,
                checked: this.validate(category),
            }));
        return entries;
    }

    validate(category: ScheduleCategory) {
        if (category.minECTS && category.currentECTS < category.minECTS) {
            return false;
        }
        if (category.maxECTS && category.currentECTS > category.maxECTS) {
            return false;
        }
        return true;
    }
}
