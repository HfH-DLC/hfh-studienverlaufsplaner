import OptionalFocusModulesLabel from "@/Components/Todos/Schedule/OptionalFocusModulesLabel.vue";
import RequiredFocusModulesLabel from "@/Components/Todos/Schedule/RequiredFocusModulesLabel.vue";
import {
    Todo,
    Placement,
    Focus,
    Module,
    ChecklistEntryData,
    FocusSelection,
    SchedulePlacement,
} from "@/types/index.js";
import { markRaw, Ref } from "vue";
import { bestPath } from "../../../tree";

function intersection(a: Set<any>, b: Set<any>) {
    return new Set([...a].filter((x) => b.has(x)));
}

export default class FocusModulesTodo implements Todo {
    getEntries({
        focusSelections,
        placements,
    }: {
        focusSelections: Ref<Array<FocusSelection>>;
        placements: Ref<Array<SchedulePlacement>>;
    }) {
        const foci = focusSelections.value.map(
            (focusSelection) => focusSelection.focus
        );

        const entriesRequired: Array<ChecklistEntryData> =
            focusSelections.value.reduce((acc, cur) => {
                const focus = cur.focus;
                if (focus.requiredModules.length > 0) {
                    const entryRequired = {
                        component: markRaw(RequiredFocusModulesLabel),
                        labelProps: {
                            focusName: focus.name,
                            modules: focus.requiredModules,
                        },
                        checked: this.validateRequired(
                            focus.requiredModules,
                            placements.value
                        ),
                        progressLabel: this.getProgressLabelRequired(
                            focus.requiredModules,
                            placements.value
                        ),
                    };
                    acc.push(entryRequired);
                }
                return acc;
            }, [] as Array<ChecklistEntryData>);

        const entriesOptional = this.validateOptional(placements.value, foci);

        return [...entriesRequired, ...entriesOptional];
    }

    validateRequired(modules: Array<Module>, placements: Array<Placement>) {
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

    validateOptional(
        placements: Array<Placement>,
        foci: Array<Focus>
    ): Array<ChecklistEntryData> {
        let placedModuleIds = new Set(
            placements.map((placement) => placement.moduleId)
        );

        const optionalModuleIds = foci.reduce((acc, cur) => {
            cur.optionalModules
                .map((module) => module.id)
                .forEach((id) => acc.add(id));
            return acc;
        }, new Set());

        const moduleIdsToPlace = intersection(
            optionalModuleIds,
            placedModuleIds
        );

        const path = bestPath(foci, moduleIdsToPlace);

        let entries: Array<ChecklistEntryData> = [];
        foci.forEach((focus) => {
            if (focus.optionalModules.length > 0) {
                const ids = path[focus.id] || [];

                const entryOptional: ChecklistEntryData = {
                    component: markRaw(OptionalFocusModulesLabel),
                    labelProps: {
                        focusName: focus.name,
                        modules: focus.optionalModules,
                        requiredNumber: focus.requiredNumberOfOptionalModules,
                    },
                    checked:
                        ids.length == focus.requiredNumberOfOptionalModules,
                    progressLabel: `${ids.length} / ${focus.requiredNumberOfOptionalModules}`,
                };
                entries.push(entryOptional);
            }
        });
        return entries;
    }

    getProgressLabelRequired(
        modules: Array<Module>,
        placements: Array<Placement>
    ) {
        const current = modules.filter((module) =>
            placements.find((placement) => placement.moduleId == module.id)
        ).length;
        return `${current} / ${modules.length}`;
    }
}
