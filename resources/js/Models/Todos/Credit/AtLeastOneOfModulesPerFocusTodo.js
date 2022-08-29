import { joinStrings } from "../../../helpers";
export default class AtLeastOneOfModulesPerFocusTodo {
    constructor(params) {
        this.moduleIds = params.moduleIds;
    }

    getEntries({ focusSelections, modules }, getters) {
        return focusSelections.reduce((acc, cur) => {
            acc.push({
                label: this.getLabel(cur.focus),
                checked: this.validate(cur, modules),
            });
            return acc;
        }, []);
    }

    getLabel(focus) {
        const moduleString = joinStrings(this.moduleIds, "oder");
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
}
