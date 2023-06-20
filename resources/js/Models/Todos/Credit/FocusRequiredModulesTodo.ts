import {
    ChecklistEntryData,
    Focus,
    FocusSelection,
    Module,
    FocusCredit,
    Todo,
} from "@/types";
import { Ref } from "vue";
import { joinStrings } from "../../../helpers";
export default class FocusRequiredModulesTodo implements Todo {
    getEntries({
        focusSelections,
        creditedModulesByFocusSelection,
    }: {
        focusSelections: Ref<Array<FocusSelection>>;
        creditedModulesByFocusSelection: Ref<Array<FocusCredit>>;
    }): Array<ChecklistEntryData> {
        return focusSelections.value.reduce(
            (acc: Array<ChecklistEntryData>, cur: FocusSelection) => {
                const creditedModuleIds = this.getCreditedModuleIds(
                    cur,
                    creditedModulesByFocusSelection.value
                );
                const focus = cur.focus;
                if (focus.requiredModules.length > 0) {
                    const entry = {
                        label: this.getLabel(focus),
                        checked: this.validate(
                            focus.requiredModules,
                            creditedModuleIds
                        ),
                        progressLabel: this.getProgressLabel(
                            focus.requiredModules,
                            creditedModuleIds
                        ),
                    };
                    acc.push(entry);
                }
                return acc;
            },
            []
        );
    }

    getCreditedModuleIds(
        focusSelection: FocusSelection,
        creditedModulesByFocusSelection: Array<FocusCredit>
    ): Array<string> {
        const modulesByFocusSelection = creditedModulesByFocusSelection.find(
            (modulesByFocusSelection: FocusCredit) =>
                modulesByFocusSelection.focusSelectionId == focusSelection.id
        );
        return modulesByFocusSelection ? modulesByFocusSelection.moduleIds : [];
    }

    getLabel(focus: Focus): string {
        const modules = focus.requiredModules;
        if (modules.length == 1) {
            const module = modules[0];
            return `Rechnen Sie das das Modul "${module.id}" an den SSP "${focus.name}" an.`;
        }
        const moduleNames = modules.map((module) => `${module.id}`);
        const moduleString = joinStrings(moduleNames, "und");
        return `Rechnen Sie die Module ${moduleString} an den SSP "${focus.name}" an.`;
    }

    validate(
        modules: Array<Module>,
        creditedModuleIds: Array<string>
    ): boolean {
        return modules.every((module) => creditedModuleIds.includes(module.id));
    }

    getProgressLabel(modules: Array<Module>, creditedModuleIds: Array<string>) {
        const current = modules.filter((module) =>
            creditedModuleIds.includes(module.id)
        ).length;

        return `${current} / ${modules.length}`;
    }
}
