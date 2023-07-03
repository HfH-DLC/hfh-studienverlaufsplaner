import { joinStrings, pluralize } from "./helpers";
import {
    ChecklistEntryData,
    Event,
    SelectionEventInfo,
    Rule,
    Todo,
    ScheduleModule,
    Message,
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
        const todoEntries = this.getTodoEntries(data);
        const moduleErrors = this.getModuleErrors(data);
        const placementErrors = this.getPlacementErrors(data);
        const globalInfos = this.getGlobalInfos(data);

        const valid =
            todoEntries.every((entry) => entry.checked) &&
            [...placementErrors.values()].every(
                (errorArray) => errorArray.length == 0
            );

        return {
            todoEntries,
            moduleErrors,
            placementErrors,
            globalInfos,
            valid,
        };
    }

    getGlobalInfos(data: Record<string, Ref<any>>): Array<Message> {
        const infos: Array<Message> = [];
        this.rules.forEach((rule) => {
            rule.getGlobalInfos(data, infos);
        });
        return infos;
    }

    getTodoEntries(data: Record<string, any>): Array<ChecklistEntryData> {
        return this.todos.reduce(
            (acc: Array<ChecklistEntryData>, cur: Todo) => {
                acc.push(...cur.getEntries(data));
                return acc;
            },
            []
        );
    }

    getModuleErrors(
        data: Record<string, Ref<any>>
    ): Map<string, Array<Message>> {
        const moduleErrors = new Map();
        data.modules.value.forEach((module: ScheduleModule) => {
            moduleErrors.set(module.id, []);
            this.rules.forEach((rule) => {
                let errorMessages = moduleErrors.get(module.id);
                if (!errorMessages) {
                    errorMessages = [];
                    moduleErrors.set(module.id, errorMessages);
                }
                rule.getModuleErrors(module, data, errorMessages);
            });
        });
        return moduleErrors;
    }

    getPlacementErrors(
        data: Record<string, Ref<any>>
    ): Map<number, Array<Message>> {
        const placementErrors = new Map();
        this.rules.forEach((rule) => {
            rule.getPlacementErrors(data, placementErrors);
        });
        return placementErrors;
    }

    getSelectionStatus(
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
            rule.getSelectionStatus(module, data, selectionEventInfos);
        });
        return {
            moduleId: module.id,
            selectionEventInfos,
        };
    }
}
