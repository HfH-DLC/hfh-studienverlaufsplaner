export default class ECTSPerFocusTodo {
    constructor(params) {
        this.minECTS = params.minECTS;
        this.maxECTS = params.maxECTS;
    }

    getEntries(
        { focusSelections, modules },
        { creditedModulesByFocusSelection }
    ) {
        return creditedModulesByFocusSelection.reduce(
            (acc, { focusSelectionId, moduleIds }) => {
                const focusSelection = focusSelections.find(
                    (focusSelection) => focusSelection.id == focusSelectionId
                );
                if (focusSelection) {
                    acc.push({
                        label: this.getLabel(focusSelection.focus),
                        checked: this.validate(moduleIds, modules),
                    });
                }
                return acc;
            },
            []
        );
    }

    getLabel(focus) {
        let label;
        if (this.minECTS && this.maxECTS) {
            if (this.minECTS == this.maxECTS) {
                label = `Rechnen Sie ${this.minECTS} ECTS Kreditpunkte an den SSP "${focus.name}" an.`;
            } else {
                label = `Rechnen Sie zwischen ${this.minECTS} und ${this.maxECTS} ECTS Kreditpunkte and den SSP "${focus.name}" an.`;
            }
        } else {
            if (this.minECTS) {
                label = `Rechnen Sie mindestens ${this.minECTS} ECTS Kreditpunkte an den Fokus "${focus.name}" an.`;
            }
            if (this.maxECTS) {
                label = `Rechnen Sie bis zu ${this.maxECTS} ECTS Kreditpunkte an den Fokus "${focus.name}" an.`;
            }
        }
        return label;
    }

    validate(moduleIds, modules) {
        modules = modules.filter((module) => moduleIds.includes(module.id));
        const totalECTS = modules.reduce((acc, cur) => {
            return acc + cur.ects;
        }, 0);
        if (this.minECTS && totalECTS < this.minECTS) {
            return false;
        }
        if (this.maxECTS && totalECTS > this.maxECTS) {
            return false;
        }
        return true;
    }
}
