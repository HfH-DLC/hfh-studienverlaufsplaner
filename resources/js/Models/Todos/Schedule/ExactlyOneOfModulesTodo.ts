import ExactlyOneOfModulesLabel from "@/Components/Todos/Schedule/ExactlyOneOfModulesLabel.vue";
import {
    Todo,
    ChecklistEntryData,
    SchedulePlacement,
    PriorLearning,
} from "@/types/index.js";
import { markRaw, Ref } from "vue";

export default class ExactlyOneOfModulesTodo implements Todo {
    private moduleIds: Array<string>;

    constructor(params: Record<string, any>) {
        this.moduleIds = params.moduleIds;
    }

    getEntries({
        placements,
        priorLearnings,
    }: {
        placements: Ref<Array<SchedulePlacement>>;
        priorLearnings: Ref<Array<PriorLearning>>;
    }): Array<ChecklistEntryData> {
        return [
            {
                component: markRaw(ExactlyOneOfModulesLabel),
                labelProps: {
                    moduleIds: this.moduleIds,
                },
                checked: this.validate(placements.value, priorLearnings.value),
                progressLabel: this.getProgressLabel(
                    placements.value,
                    priorLearnings.value
                ),
            },
        ];
    }

    validate(
        placements: Array<SchedulePlacement>,
        priorLearnings: Array<PriorLearning>
    ) {
        const count = this.moduleIds.reduce((acc, cur) => {
            if (placements.some((placement) => placement.moduleId === cur)) {
                acc++;
            }
            if (
                priorLearnings.some(
                    (priorLearning) => priorLearning.countsAsModuleId === cur
                )
            ) {
                acc++;
            }
            return acc;
        }, 0);

        return count === 1;
    }

    getProgressLabel(
        placements: Array<SchedulePlacement>,
        priorLearnings: Array<PriorLearning>
    ) {
        const count = this.moduleIds.reduce((acc, cur) => {
            if (placements.some((placement) => placement.moduleId === cur)) {
                acc++;
            }
            if (
                priorLearnings.some(
                    (priorLearning) => priorLearning.countsAsModuleId === cur
                )
            ) {
                acc++;
            }
            return acc;
        }, 0);

        return `${count} / 1`;
    }
}
