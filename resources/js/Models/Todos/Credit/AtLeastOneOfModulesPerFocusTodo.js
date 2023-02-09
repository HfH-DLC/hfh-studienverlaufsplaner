import { joinStrings } from "../../../helpers";
export default class AtLeastOneOfModulesPerFocusTodo {
    constructor(params) {
        this.moduleIds = params.moduleIds;
    }

    getEntries({ focusSelections, modules }) {
        return focusSelections.reduce((acc, cur) => {
            acc.push({
                component: "AtLeastOneOfModulesPerFocusLabel",
                labelProps: {
                    moduleIds: this.moduleIds,
                    focusName: cur.focus.name,
                },
                checked: this.validate(cur, modules),
                progressLabel: this.getProgressLabel(cur, modules),
            });
            return acc;
        }, []);
    }

    getLabel(focus) {
        const moduleString = joinStrings(
            this.moduleIds.map((id) => {
                return `<label for=credit-${id}>${id}</label>`;
            }),
            "oder"
        );
        return `Rechnen Sie mindestens eines der Module ${moduleString} an den SSP ${focus.name} an.`;
    }

    validate(focusSelection, modules) {
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

    getProgressLabel(focusSelection, modules) {
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
