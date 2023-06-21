import RequiredFocusModulesLabel from "@/Components/Todos/Schedule/RequiredFocusModulesLabel.vue";
import {
    Todo,
    Placement,
    Module,
    ChecklistEntryData,
    FocusSelection,
    SchedulePlacement,
    Focus,
    PriorLearning,
} from "@/types/index.js";
import { markRaw, Ref } from "vue";

export default class FocusRequiredModulesTodo implements Todo {
    getEntries({
        focusSelections,
        placements,
        priorLearnings,
    }: {
        focusSelections: Ref<Array<FocusSelection>>;
        placements: Ref<Array<SchedulePlacement>>;
        priorLearnings: Ref<Array<PriorLearning>>;
    }) {
        return focusSelections.value.reduce((acc, cur) => {
            const focus = cur.focus;
            if (focus.requiredModules.length > 0) {
                const entry = this.getEntry(
                    focus,
                    placements.value,
                    priorLearnings.value
                );
                acc.push(entry);
            }
            return acc;
        }, [] as Array<ChecklistEntryData>);
    }

    getEntry(
        focus: Focus,
        placements: Array<SchedulePlacement>,
        priorLearnings: Array<PriorLearning>
    ) {
        return {
            component: markRaw(RequiredFocusModulesLabel),
            labelProps: {
                focusName: focus.name,
                modules: focus.requiredModules,
            },
            checked: this.validate(
                focus.requiredModules,
                placements,
                priorLearnings
            ),
            progressLabel: this.getProgressLabel(
                focus.requiredModules,
                placements,
                priorLearnings
            ),
        };
    }

    validate(
        modules: Array<Module>,
        placements: Array<Placement>,
        priorLearnings: Array<PriorLearning>
    ) {
        if (
            modules.some(
                (module) =>
                    !placements.some(
                        (placement) => placement.moduleId === module.id
                    ) &&
                    !priorLearnings.some(
                        (priorLearning) =>
                            priorLearning.countsAsModuleId === module.id
                    )
            )
        ) {
            return false;
        }
        return true;
    }

    getProgressLabel(
        modules: Array<Module>,
        placements: Array<Placement>,
        priorLearnings: Array<PriorLearning>
    ) {
        const current = modules.filter((module) => {
            return (
                placements.some(
                    (placement) => placement.moduleId === module.id
                ) ||
                priorLearnings.some(
                    (priorLearning) =>
                        priorLearning.countsAsModuleId === module.id
                )
            );
        }).length;
        return `${current} / ${modules.length}`;
    }
}
