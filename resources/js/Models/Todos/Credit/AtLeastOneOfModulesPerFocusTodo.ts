import AtLeastOneOfModulesPerFocusLabel from "@/Components/Todos/Credit/AtLeastOneOfModulesPerFocusLabel.vue";
import {
    ChecklistEntryData,
    CreditModule,
    Focus,
    FocusSelection,
} from "@/types";
import { markRaw, Ref } from "vue";
import { joinStrings } from "../../../helpers";
export default class AtLeastOneOfModulesPerFocusTodo {
    private moduleIds: Array<string>;

    constructor(params: Record<string, any>) {
        this.moduleIds = params.moduleIds;
    }

    getEntries({
        focusSelections,
        modules,
    }: {
        focusSelections: Ref<Array<FocusSelection>>;
        modules: Ref<Array<CreditModule>>;
    }): Array<ChecklistEntryData> {
        return focusSelections.value.map((focusSelection: FocusSelection) => {
            return {
                component: markRaw(AtLeastOneOfModulesPerFocusLabel),
                labelProps: {
                    moduleIds: this.moduleIds,
                    focusName: focusSelection.focus.name,
                },
                checked: this.validate(focusSelection, modules.value),
                progressLabel: this.getProgressLabel(
                    focusSelection,
                    modules.value
                ),
            };
        });
    }

    validate(
        focusSelection: FocusSelection,
        modules: Array<CreditModule>
    ): boolean {
        const requriedModules = modules.filter((module) =>
            this.moduleIds.includes(module.id)
        );
        const count = requriedModules.reduce((acc, cur) => {
            if (cur.creditedAgainst == focusSelection.id) {
                acc++;
            }
            return acc;
        }, 0);
        if (count < 1) {
            return false;
        }
        return true;
    }

    getProgressLabel(
        focusSelection: FocusSelection,
        modules: Array<CreditModule>
    ): string {
        const requriedModules = modules.filter((module) =>
            this.moduleIds.includes(module.id)
        );
        const count = requriedModules.reduce((acc, cur) => {
            if (cur.creditedAgainst == focusSelection.id) {
                acc++;
            }
            return acc;
        }, 0);
        return `${count}`;
    }
}
