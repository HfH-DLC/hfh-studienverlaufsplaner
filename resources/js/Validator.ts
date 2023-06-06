import {
    ChecklistEntryData,
    Event,
    SelectionEventInfo,
    Rule,
    Todo,
    ScheduleModule,
    ErrorMessage,
} from "./types";
import { Ref } from "vue";

export default class Validator {
    todos: Array<Todo>;
    rules: Array<Rule>;

    constructor(todos: Array<Todo>, rules: Array<Rule>) {
        this.todos = todos;
        this.rules = rules;
    }

    validate(data: Record<string, Ref<any>>) {
        return {
            todoEntries: this.validateTodos(data),
            moduleInfos: this.validateModules(data),
            placementErrors: this.validatePlacements(data),
        };
    }

    validateTodos(data: Record<string, any>): Array<ChecklistEntryData> {
        return this.todos.reduce(
            (acc: Array<ChecklistEntryData>, cur: Todo) => {
                acc.push(...cur.getEntries(data));
                return acc;
            },
            []
        );
    }
    validateModules(
        data: Record<string, Ref<any>>
    ): Map<string, Array<ErrorMessage>> {
        const moduleInfos = new Map();
        data.modules.value.forEach((module: ScheduleModule) => {
            moduleInfos.set(module.id, []);
            this.rules.forEach((rule) => {
                let errorMessages = moduleInfos.get(module.id);
                if (!errorMessages) {
                    errorMessages = [];
                    moduleInfos.set(module.id, errorMessages);
                }
                rule.validateModule(module, data, errorMessages);
            });
        });
        return moduleInfos;
    }
    validatePlacements(
        data: Record<string, Ref<any>>
    ): Map<number, Array<ErrorMessage>> {
        const placementErrors = new Map();
        this.rules.forEach((rule) => {
            rule.validatePlacements(data, placementErrors);
        });
        return placementErrors;
    }

    validateSelection(
        module: ScheduleModule,
        data: Record<string, Ref<any>>
    ): {
        moduleId: string;
        selectionEventInfos: Map<number, SelectionEventInfo>;
    } {
        const selectionEventInfos = module.events.reduce(
            (acc: Map<number, SelectionEventInfo>, cur: Event) => {
                acc.set(cur.id, {
                    valid: true,
                    dateAllowed: true,
                });
                return acc;
            },
            new Map()
        );
        this.rules.forEach((rule) => {
            rule.validateSelection(module, data, selectionEventInfos);
        });
        return {
            moduleId: module.id,
            selectionEventInfos,
        };
    }
}
