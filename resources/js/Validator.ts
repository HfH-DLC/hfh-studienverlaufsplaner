import {
    ChecklistEntryData,
    Event,
    RuleData,
    SelectionEventInfo,
    TodoData,
} from "./types";
import { Rule, Todo, ScheduleModule, ErrorMessage } from "./types";

import { getTodo } from "./Models/Todos/Schedule/TodoFactory";
import { getRule } from "./Models/Rules/Schedule/RuleFactory";
import SettingsRule from "./Models/Rules/Schedule/SettingsRule";

export default class Validator {
    todos: Array<Todo>;
    rules: Array<Rule>;

    constructor(todosData: Array<TodoData>, rulesData: Array<RuleData>) {
        const todos = todosData.reduce(
            (array: Array<Todo>, todoData: TodoData) => {
                try {
                    array.push(getTodo(todoData));
                } catch (error) {
                    console.error(error);
                }
                return array;
            },
            []
        );
        const rules = rulesData.reduce((array: Array<Rule>, rule) => {
            try {
                array.push(getRule(rule));
            } catch (error) {
                console.error(error);
            }
            return array;
        }, []);
        rules.push(new SettingsRule()); //todo would it make more sense to have all default rules like this?
        this.todos = todos;
        this.rules = rules;
    }

    validate(data: Record<string, any>) {
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
        data: Record<string, any>
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
        data: Record<string, any>
    ): Map<number, Array<ErrorMessage>> {
        const placementErrors = new Map();
        this.rules.forEach((rule) => {
            rule.validatePlacements(data, placementErrors);
        });
        return placementErrors;
    }

    validateSelection(module: ScheduleModule, data: Record<string, any>) {
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
