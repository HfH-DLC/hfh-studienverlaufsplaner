import {
    ChecklistEntryData,
    CreditModule,
    Focus,
    FocusSelection,
    Module,
    FocusCredit,
    Todo,
} from "@/types";
import { Ref } from "vue";

export default class ECTSPerFocusTodo implements Todo {
    private minECTS: number;
    private maxECTS: number;

    constructor(params: Record<string, any>) {
        this.minECTS = params.minECTS;
        this.maxECTS = params.maxECTS;
    }

    getEntries({
        focusSelections,
        modules,
        creditedModulesByFocusSelection,
    }: {
        focusSelections: Ref<Array<FocusSelection>>;
        modules: Ref<Array<CreditModule>>;
        creditedModulesByFocusSelection: Ref<Array<FocusCredit>>;
    }): Array<ChecklistEntryData> {
        return creditedModulesByFocusSelection.value.reduce(
            (
                acc: Array<ChecklistEntryData>,
                { focusSelectionId, moduleIds }: FocusCredit
            ) => {
                const focusSelection = focusSelections.value.find(
                    (focusSelection: FocusSelection) =>
                        focusSelection.id == focusSelectionId
                );
                if (focusSelection) {
                    const focusModules = modules.value.filter(
                        (module: Module) => moduleIds.includes(module.id)
                    );
                    acc.push({
                        label: this.getLabel(focusSelection.focus),
                        checked: this.validate(focusModules),
                        progressLabel: this.getProgressLabel(focusModules),
                    });
                }
                return acc;
            },
            []
        );
    }

    getLabel(focus: Focus): string {
        let label = "";
        if (this.minECTS && this.maxECTS) {
            if (this.minECTS == this.maxECTS) {
                label = `Rechnen Sie ${this.minECTS} ECTS Kreditpunkte an den SSP "${focus.name}" an.`;
            } else {
                label = `Rechnen Sie zwischen ${this.minECTS} und ${this.maxECTS} ECTS Kreditpunkte an den SSP "${focus.name}" an.`;
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

    validate(modules: Array<Module>) {
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

    getProgressLabel(modules: Array<Module>) {
        const current = modules.reduce((acc, cur) => {
            return acc + cur.ects;
        }, 0);
        return `${current}`;
    }
}
