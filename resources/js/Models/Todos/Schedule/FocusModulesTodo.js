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
                    component: "RequiredFocusModulesLabel",
                    labelProps: {
                        focusName: focus.name,
                        modules: focus.requiredModules,
                    },
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
            if (focus.optionalModules.length > 0) {
                const ids = path[focus.id] || [];

                const entryOptional = {
                    component: "OptionalFocusModulesLabel",
                    labelProps: {
                        focusName: focus.name,
                        modules: focus.optionalModules,
                        requiredNumber: focus.requiredNumberOfOptionalModules,
                    },
                    checked:
                        ids.length == focus.requiredNumberOfOptionalModules,
                    progressLabel: `${ids.length} / ${focus.requiredNumberOfOptionalModules}`,
                };
                entries.push(entryOptional);
            }
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
