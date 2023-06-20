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

export default class FocusOptionalModulesTodo implements Todo {
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

        return this.validate(placements.value, foci);
    }
    validate(
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

        return foci.reduce((acc: Array<ChecklistEntryData>, cur: Focus) => {
            if (cur.optionalModules.length > 0) {
                const ids = path[cur.id] || [];
                const entry = this.getEntry(cur, ids);
                acc.push(entry);
            }
            return acc;
        }, []);
    }

    getEntry(focus: Focus, ids: Array<string>): ChecklistEntryData {
        return {
            component: markRaw(OptionalFocusModulesLabel),
            labelProps: {
                focusName: focus.name,
                modules: focus.optionalModules,
                requiredNumber: focus.requiredNumberOfOptionalModules,
            },
            checked: ids.length == focus.requiredNumberOfOptionalModules,
            progressLabel: `${ids.length} / ${focus.requiredNumberOfOptionalModules}`,
        };
    }
}
