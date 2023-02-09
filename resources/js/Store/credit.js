import { defineStore } from "pinia";

import {
    SAVE_STATUS_ERROR,
    SAVE_STATUS_SAVED,
    SAVE_STATUS_SAVING,
} from "../constants";
import DataAdapter from "../DataAdapter";
import emitter from "../emitter";
import flashTypes from "../flashTypes";
import { getTodo } from "../Models/Todos/Credit/TodoFactory";

let dataAdapter;

export const useCreditStore = defineStore("credit", {
    state: () => ({
        focusSelections: [],
        errors: [],
        initialized: false,
        modules: [],
        readOnly: false,
        saveStatus: SAVE_STATUS_SAVED,
        todoEntries: [],
        tour: null,
        tourActive: false,
        tourCompleted: false,
        valid: false,
    }),
    actions: {
        init({ planerSlug, plan, modules, focusSelections, todos, tour }) {
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
        creditModuleAgainstFocusSelection({ moduleId, focusSelectionId }) {
            const module = this.modules.find((module) => module.id == moduleId);
            module.creditedAgainst = focusSelectionId;
            this.validate();
            this.save();
        },
        setTodos(todos) {
            this.todos = todos.reduce((array, todo) => {
                try {
                    array.push(getTodo(todo));
                } catch (error) {
                    console.error(error);
                }
                return array;
            }, []);
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
                this.saveStatus = SAVE_STATUS_SAVING;
                await dataAdapter.saveCredit(
                    this.creditedModulesByFocusSelection,
                    this.tourCompleted,
                    this.valid
                );
                this.saveStatus = SAVE_STATUS_SAVED;
                return true;
            } catch (error) {
                this.saveStatus = SAVE_STATUS_ERROR;
                emitter.emit("flash", {
                    type: flashTypes.ERROR,
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
                acc.push(...cur.getEntries(this));
                return acc;
            }, []);
        },
    },
    getters: {
        creditedModulesByFocusSelection() {
            return this.focusSelections.reduce((acc, cur) => {
                acc.push({
                    focusSelectionId: cur.id,
                    moduleIds: this.modules
                        .filter((module) => module.creditedAgainst == cur.id)
                        .map((module) => module.id),
                });
                return acc;
            }, []);
        },
    },
});
