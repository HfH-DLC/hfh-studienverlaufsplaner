import {
    ChecklistEntryData,
    Focus,
    FocusSelection,
    Module,
    FocusCredit,
    Todo,
} from "@/types";
import { numToWord } from "num-words-de";
import { Ref } from "vue";
import { joinStrings } from "../../../helpers";
export default class FocusOptionalModulesTodo implements Todo {
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
                if (focus.optionalModules.length > 0) {
                    const entryOptional = {
                        label: this.getLabel(focus),
                        checked: this.validate(
                            focus.optionalModules,
                            creditedModuleIds,
                            focus.requiredNumberOfOptionalModules
                        ),
                        progressLabel: this.getProgressLabel(
                            focus.optionalModules,
                            creditedModuleIds,
                            focus.requiredNumberOfOptionalModules
                        ),
                    };
                    acc.push(entryOptional);
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
        const modules = focus.optionalModules;
        if (modules.length == 1) {
            const module = modules[0];
            return `Rechnen Sie das das Modul "${module.id}" an den SSP "${focus.name}" an.`;
        }
        const moduleNames = modules.map((module) => `${module.id}`);
        const number = focus.requiredNumberOfOptionalModules;
        const moduleString = joinStrings(moduleNames, "oder");
        return `Rechnen Sie ${numToWord(number, {
            uppercase: false,
            indefinite_eines: true,
        })} der Module ${moduleString} an den SSP "${focus.name}" an.`;
    }

    validate(
        modules: Array<Module>,
        creditedModuleIds: Array<string>,
        requiredNumber = -1
    ): boolean {
        if (requiredNumber < 0) {
            requiredNumber = modules.length;
        }
        return (
            modules.filter((module) => creditedModuleIds.includes(module.id))
                .length == requiredNumber
        );
    }

    getProgressLabel(
        modules: Array<Module>,
        creditedModuleIds: Array<string>,
        requiredNumber = -1
    ) {
        if (requiredNumber < 0) {
            requiredNumber = modules.length;
        }
        const current = modules.filter((module) =>
            creditedModuleIds.includes(module.id)
        ).length;

        return `${current} / ${requiredNumber}`;
    }
}
