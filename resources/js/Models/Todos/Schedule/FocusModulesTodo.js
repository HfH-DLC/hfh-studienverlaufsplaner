import { numToWord } from "num-words-de";
import { joinStrings } from "../../../helpers";
import { bestPath } from "../../../tree.js";

function intersection(a, b) {
    return new Set([...a].filter((x) => b.has(x)));
}

export default class FocusModulesTodo {
    getEntries({ focusSelections, placements }, getters) {
        const foci = focusSelections.map(
            (focusSelection) => focusSelection.focus
        );

        const entriesRequired = focusSelections.reduce((acc, cur) => {
            const focus = cur.focus;
            if (focus.requiredModules.length > 0) {
                const entryRequired = {
                    label: this.getLabelRequired(focus),
                    checked: this.validateRequired(
                        focus.requiredModules,
                        placements
                    ),
                    progressLabel: this.getProgressLabelRequired(
                        focus.requiredModules,
                        placements
                    ),
                };
                acc.push(entryRequired);
            }
            return acc;
        }, []);

        const entriesOptional = this.validateOptional(placements, foci);

        return [...entriesRequired, ...entriesOptional];
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
        const moduleNames = modules.map(
            (module) => `<a href="#module-${module.id}">${module.id}</a>`
        );
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

    validateOptional(placements, foci) {
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

        let entries = [];
        foci.forEach((focus) => {
            const ids = path[focus.id] || [];

            const entryOptional = {
                label: this.getLabelOptional(focus),
                checked: ids.length == focus.requiredNumberOfOptionalModules,
                progressLabel: `${ids.length} / ${focus.requiredNumberOfOptionalModules}`,
            };
            entries.push(entryOptional);
        });
        return entries;
    }

    getProgressLabelRequired(modules, placements) {
        const current = modules.filter((module) =>
            placements.find((placement) => placement.moduleId == module.id)
        ).length;
        return `${current} / ${modules.length}`;
    }
}
