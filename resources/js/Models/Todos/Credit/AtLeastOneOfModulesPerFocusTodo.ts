import {
    ChecklistEntryData,
    CreditModule,
    Focus,
    FocusSelection,
} from "@/types";
import { Ref } from "vue";
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
        return focusSelections.value.reduce(
            (acc: Array<ChecklistEntryData>, cur: FocusSelection) => {
                acc.push({
                    component: "AtLeastOneOfModulesPerFocusLabel",
                    labelProps: {
                        moduleIds: this.moduleIds,
                        focusName: cur.focus.name,
                    },
                    checked: this.validate(cur, modules.value),
                    progressLabel: this.getProgressLabel(cur, modules.value),
                });
                return acc;
            },
            []
        );
    }

    getLabel(focus: Focus): string {
        const moduleString = joinStrings(
            this.moduleIds.map((id) => {
                return `<label for=credit-${id}>${id}</label>`;
            }),
            "oder"
        );
        return `Rechnen Sie mindestens eines der Module ${moduleString} an den SSP ${focus.name} an.`;
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
