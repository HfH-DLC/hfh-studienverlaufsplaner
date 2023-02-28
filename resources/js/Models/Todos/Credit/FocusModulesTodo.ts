import {
    ChecklistEntryData,
    Focus,
    FocusSelection,
    Module,
    ModuleIdsByFocusSelection,
    Todo,
} from "@/types";
import { numToWord } from "num-words-de";
import { Ref } from "vue";
import { joinStrings } from "../../../helpers";
export default class FocusModulesTodo implements Todo {
    getEntries({
        focusSelections,
        creditedModulesByFocusSelection,
    }: {
        focusSelections: Ref<Array<FocusSelection>>;
        creditedModulesByFocusSelection: Ref<Array<ModuleIdsByFocusSelection>>;
    }): Array<ChecklistEntryData> {
        return focusSelections.value.reduce(
            (acc: Array<ChecklistEntryData>, cur: FocusSelection) => {
                const modulesByFocusSelection =
                    creditedModulesByFocusSelection.value.find(
                        (modulesByFocusSelection: ModuleIdsByFocusSelection) =>
                            modulesByFocusSelection.focusSelectionId == cur.id
                    );
                const creditedModuleIds = modulesByFocusSelection
                    ? modulesByFocusSelection.moduleIds
                    : [];
                const focus = cur.focus;
                if (focus.requiredModules.length > 0) {
                    const entryOptional = {
                        label: this.getLabel(focus, true),
                        checked: this.validate(
                            focus.requiredModules,
                            creditedModuleIds
                        ),
                        progressLabel: this.getProgressLabel(
                            focus.requiredModules,
                            creditedModuleIds
                        ),
                    };
                    acc.push(entryOptional);
                }
                if (focus.optionalModules.length > 0) {
                    const entryOptional = {
                        label: this.getLabel(focus, false),
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

    getLabel(focus: Focus, isRequired: boolean): string {
        const modules = isRequired
            ? focus.requiredModules
            : focus.optionalModules;
        if (modules.length == 1) {
            const module = modules[0];
            return `Rechnen Sie das das Modul "${module.id}" an den SSP "${focus.name}" an.`;
        }
        const moduleNames = modules.map((module) => `${module.id}`);
        if (isRequired) {
            const moduleString = joinStrings(moduleNames, "und");
            return `Rechnen Sie die Module ${moduleString} an den SSP "${focus.name}" an.`;
        } else {
            const number = focus.requiredNumberOfOptionalModules;
            const moduleString = joinStrings(moduleNames, "oder");
            return `Rechnen Sie ${numToWord(number, {
                uppercase: false,
                indefinite_eines: true,
            })} der Module ${moduleString} an den SSP "${focus.name}" an.`;
        }
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
