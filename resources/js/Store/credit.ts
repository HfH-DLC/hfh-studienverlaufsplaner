import { useEmitter } from "@/composables/useEmitter";
import {
    ChecklistEntryData,
    CreditInitParams,
    CreditModule,
    ErrorMessage,
    FocusSelection,
    FlashType,
    ModuleIdsByFocusSelection,
    SaveStatus,
    Todo,
    TodoData,
    TourData,
} from "@/types";
import { defineStore } from "pinia";
import { toRefs } from "vue";

import DataAdapter from "../DataAdapter";
import { getTodo } from "../Models/Todos/Credit/TodoFactory";

let dataAdapter: DataAdapter;
const emitter = useEmitter();

export const useCreditStore = defineStore("credit", {
    state: () => ({
        focusSelections: [] as Array<FocusSelection>,
        errors: [] as Array<ErrorMessage>,
        initialized: false,
        modules: [] as Array<CreditModule>,
        readOnly: false,
        saveStatus: SaveStatus.Saved,
        todos: [] as Array<Todo>,
        todoEntries: [] as Array<ChecklistEntryData>,
        tour: null as TourData | null,
        tourActive: false,
        tourCompleted: false,
        tourCurrentStepIndex: 0,
        valid: false,
    }),
    actions: {
        init({
            planerSlug,
            plan,
            modules,
            focusSelections,
            todos,
            tour,
        }: CreditInitParams) {
            dataAdapter = new DataAdapter(planerSlug, plan.slug);
            this.$reset();
            this.readOnly = plan.readOnly;
            this.focusSelections = focusSelections;
            this.modules = modules;
            this.setTodos(todos);
            this.tour = tour;
            this.tourCompleted = plan.creditTourCompleted;
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
        setTodos(todos: Array<TodoData>) {
            this.todos = todos.reduce((array: Array<Todo>, todo) => {
                try {
                    array.push(getTodo(todo.name, todo.params));
                } catch (error) {
                    console.error(error);
                }
                return array;
            }, [] as Array<Todo>);
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
            this.validateTodos();
            this.valid =
                this.errors.length == 0 &&
                this.todoEntries.every((todo) => todo.checked);
        },
        validateTodos() {
            this.todoEntries = this.todos.reduce((acc, cur) => {
                acc.push(...cur.getEntries(toRefs(this)));
                return acc;
            }, [] as Array<ChecklistEntryData>);
        },
    },
    getters: {
        creditedModulesByFocusSelection(): Array<ModuleIdsByFocusSelection> {
            return this.focusSelections.reduce((acc, cur) => {
                const modulesByFocusSelection = {
                    focusSelectionId: cur.id,
                    moduleIds: this.modules
                        .filter((module) => module.creditedAgainst == cur.id)
                        .map((module) => module.id),
                };
                acc.push(modulesByFocusSelection);
                return acc;
            }, [] as Array<ModuleIdsByFocusSelection>);
        },
    },
});
