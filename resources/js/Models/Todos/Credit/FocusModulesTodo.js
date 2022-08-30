import { numToWord } from "num-words-de";
import { joinStrings } from "../../../helpers";
export default class FocusModulesTodo {
    getEntries({ focusSelections }, { creditedModulesByFocusSelection }) {
        return focusSelections.reduce((acc, cur) => {
            const modulesByFocusSelection =
                creditedModulesByFocusSelection.find(
                    (modulesByFocusSelection) =>
                        modulesByFocusSelection.focusSelectionId == cur.id
                );
            const creditedModuleIds = modulesByFocusSelection
                ? modulesByFocusSelection.moduleIds
                : [];
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
        }, []);
    }

    getLabel(focus) {
        const modules = focus.optionalModules;
        const number = focus.requiredNumberOfOptionalModules;
        if (modules.length == 1) {
            const module = modules[0];
            return `Rechnen Sie das das Modul ${module.id} an den SSP "${focus.name}" an.`;
        }
        const moduleNames = modules.map((module) => `${module.id}`);
        const moduleString = joinStrings(moduleNames, "oder");
        return `Rechnen Sie ${numToWord(number, {
            uppercase: false,
            indefinite_eines: true,
        })} der Module ${moduleString} an den SSP "${focus.name}" an.`;
    }

    validate(
        optionalModules,
        creditedModuleIds,
        requiredNumberOfOptionalModules
    ) {
        if (
            optionalModules.filter((optionalModule) =>
                creditedModuleIds.includes(optionalModule.id)
            ).length == requiredNumberOfOptionalModules
        )
            return true;
    }

    getProgressLabel(
        optionalModules,
        creditedModuleIds,
        requiredNumberOfOptionalModules
    ) {
        const current = optionalModules.filter((optionalModule) =>
            creditedModuleIds.includes(optionalModule.id)
        ).length;

        return `${current} / ${requiredNumberOfOptionalModules}`;
    }
}
