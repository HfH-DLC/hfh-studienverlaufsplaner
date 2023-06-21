import OptionalFocusModulesLabel from "@/Components/Todos/Schedule/OptionalFocusModulesLabel.vue";
import {
    Todo,
    Placement,
    Focus,
    ChecklistEntryData,
    FocusSelection,
    SchedulePlacement,
    PriorLearning,
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
        priorLearnings,
    }: {
        focusSelections: Ref<Array<FocusSelection>>;
        placements: Ref<Array<SchedulePlacement>>;
        priorLearnings: Ref<Array<PriorLearning>>;
    }) {
        const foci = focusSelections.value.map(
            (focusSelection) => focusSelection.focus
        );

        return this.validate(placements.value, priorLearnings.value, foci);
    }
    validate(
        placements: Array<Placement>,
        priorLearnings: Array<PriorLearning>,
        foci: Array<Focus>
    ): Array<ChecklistEntryData> {
        let placedModuleIds = new Set([
            ...placements.map((placement) => placement.moduleId),
            ...priorLearnings.reduce((acc, cur) => {
                if (cur.countsAsModuleId) {
                    acc.push(cur.countsAsModuleId);
                }
                return acc;
            }, [] as Array<string>),
        ]);

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
