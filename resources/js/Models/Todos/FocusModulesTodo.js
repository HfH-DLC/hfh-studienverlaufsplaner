import { numToWord } from "num-words-de";
import { joinStrings } from "../../helpers";
export default class FocusModulesTodo {
    getEntries({ focusSelections, placements }, getters) {
        return focusSelections.reduce((acc, cur) => {
            const focus = cur.focus;
            if (focus.requiredModules.length > 0) {
                const entryRequired = {
                    label: this.getLabelRequired(focus),
                    checked: this.validateRequired(
                        focus.requiredModules,
                        placements
                    ),
                };
                acc.push(entryRequired);
            }
            if (focus.optionalModules.length > 0) {
                const entryOptional = {
                    label: this.getLabelOptional(focus),
                    checked: this.validateOptional(
                        focus.optionalModules,
                        placements,
                        focus.requiredNumberOfOptionalModules
                    ),
                };
                acc.push(entryOptional);
            }
            return acc;
        }, []);
    }

    getLabelRequired(focus) {
        const modules = focus.requiredModules;
        if (modules.length == 1) {
            const module = modules[0];
            return `Belegen Sie für den SSP "${focus.name}" das Modul <a href="#module-${module.id}">${module.id}</a>.`;
        }
        const moduleNames = modules.map(
            (module) => `<a href="#module-${module.id}">${module.id}</a>`
        );
        const moduleString = joinStrings(moduleNames, "und");
        return `Belegen Sie für den SSP "${focus.name}" die Module ${moduleString}.`;
    }

    getLabelOptional(focus) {
        const modules = focus.optionalModules;
        const number = focus.requiredNumberOfOptionalModules;
        if (modules.length == 1) {
            const module = modules[0];
            return `Belegen Sie für den SSP "${focus.name}" das Modul <a href="#module-${module.id}">${module.id}</a>.`;
        }
        const moduleNames = modules.map((module) => `${module.id}`);
        const moduleString = joinStrings(moduleNames, "oder");
        return `Belegen Sie für den SSP "${focus.name}" ${numToWord(number, {
            uppercase: false,
            indefinite_eines: true,
        })} der Module ${moduleString}.`;
    }

    validateRequired(modules, placements) {
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

    validateOptional(modules, placements, requiredNumberOfOptionalModules) {
        if (
            modules.filter((module) =>
                placements.find((placement) => placement.moduleId == module.id)
            ).length == requiredNumberOfOptionalModules
        )
            return true;
    }
}
