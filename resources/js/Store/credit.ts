import { useEmitter } from "@/composables/useEmitter";
import {
    ChecklistEntryData,
    CreditInitParams,
    CreditModule,
    FocusSelection,
    FlashType,
    FocusCredit,
    SaveStatus,
    TourData,
} from "@/types";
import { defineStore } from "pinia";
import { toRefs } from "vue";

import DataAdapter from "../DataAdapter";
import Validator from "@/Validator";

let dataAdapter: DataAdapter;
let validator: Validator;
const emitter = useEmitter();

export const useCreditStore = defineStore("credit", {
    state: () => ({
        focusSelections: [] as Array<FocusSelection>,
        initialized: false,
        modules: [] as Array<CreditModule>,
        readOnly: false,
        saveStatus: SaveStatus.Saved,
        todoEntries: [] as Array<ChecklistEntryData>,
        tour: null as TourData | null,
        tourActive: false,
        tourCompleted: false,
        tourCurrentStepIndex: 0,
        valid: false,
    }),
    actions: {
        init(params: CreditInitParams) {
            this.$reset();
            dataAdapter = params.dataAdapter;
            validator = params.validator;
            this.readOnly = params.plan.readOnly;
            this.focusSelections = params.focusSelections;
            this.modules = params.modules;
            this.tour = params.tour;
            this.tourCompleted = params.plan.creditTourCompleted;
            this.validate();
            this.initialized = true;
        },
        creditModuleAgainstFocusSelection(
            moduleId: string,
            focusSelectionId: number
        ) {
            const module = this.modules.find((module) => module.id == moduleId);
            if (module) {
                module.creditedAgainst = focusSelectionId;
                this.validate();
                this.save();
            } else {
                console.log(
                    `creditModuleAgainstFocusSelection: module with id ${moduleId} not found`
                );
            }
        },
        startTour() {
            this.tourActive = true;
            this.save();
        },
        completeTour() {
            this.tourActive = false;
            this.tourCompleted = true;
            this.save();
        },
        async save() {
            try {
                this.saveStatus = SaveStatus.Saving;
                await dataAdapter.saveCredit(
                    this.creditedModulesByFocusSelection,
                    this.tourCompleted,
                    this.valid
                );
                this.saveStatus = SaveStatus.Saved;
                return true;
            } catch (error) {
                this.saveStatus = SaveStatus.Error;
                emitter.emit("flash", {
                    type: FlashType.Error,
                    message:
                        "Beim automatischen Speichern Ihres Plans ist ein Fehler aufgetreten.",
                    actionMessage: "Erneut versuchen",
                    actionEvent: "retry-save",
                });
                console.error(error);
                return false;
            }
        },
        validate() {
            this.todoEntries = validator.validateTodos(toRefs(this));
            this.valid = this.todoEntries.every((todo) => todo.checked);
        },
    },
    getters: {
        creditedModulesByFocusSelection(): Array<FocusCredit> {
            return this.focusSelections.reduce((acc, cur) => {
                const modulesByFocusSelection = {
                    focusSelectionId: cur.id,
                    moduleIds: this.modules
                        .filter((module) => module.creditedAgainst == cur.id)
                        .map((module) => module.id),
                };
                acc.push(modulesByFocusSelection);
                return acc;
            }, [] as Array<FocusCredit>);
        },
    },
});
