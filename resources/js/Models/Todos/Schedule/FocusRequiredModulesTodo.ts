import RequiredFocusModulesLabel from "@/Components/Todos/Schedule/RequiredFocusModulesLabel.vue";
import {
    Todo,
    Placement,
    Module,
    ChecklistEntryData,
    FocusSelection,
    SchedulePlacement,
    Focus,
} from "@/types/index.js";
import { markRaw, Ref } from "vue";

export default class FocusRequiredModulesTodo implements Todo {
    getEntries({
        focusSelections,
        placements,
    }: {
        focusSelections: Ref<Array<FocusSelection>>;
        placements: Ref<Array<SchedulePlacement>>;
    }) {
        return focusSelections.value.reduce((acc, cur) => {
            const focus = cur.focus;
            if (focus.requiredModules.length > 0) {
                const entry = this.getEntry(focus, placements.value);
                acc.push(entry);
            }
            return acc;
        }, [] as Array<ChecklistEntryData>);
    }

    getEntry(focus: Focus, placements: Array<SchedulePlacement>) {
        return {
            component: markRaw(RequiredFocusModulesLabel),
            labelProps: {
                focusName: focus.name,
                modules: focus.requiredModules,
            },
            checked: this.validate(focus.requiredModules, placements),
            progressLabel: this.getProgressLabel(
                focus.requiredModules,
                placements
            ),
        };
    }

    validate(modules: Array<Module>, placements: Array<Placement>) {
        if (
            modules.some(
                (module) =>
                    !placements.find(
                        (placement) => placement.moduleId == module.id
                    )
            )
        ) {
            return false;
        }
        return true;
    }

    getProgressLabel(modules: Array<Module>, placements: Array<Placement>) {
        const current = modules.filter((module) =>
            placements.find((placement) => placement.moduleId == module.id)
        ).length;
        return `${current} / ${modules.length}`;
    }
}
