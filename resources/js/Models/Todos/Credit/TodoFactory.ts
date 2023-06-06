import { Todo, TodoData } from "@/types";
import AtLeastOneOfModulesPerFocusTodo from "./AtLeastOneOfModulesPerFocusTodo";
import ECTSPerFocusTodo from "./ECTSPerFocusTodo";
import FocusModulesTodo from "./FocusModulesTodo";

export const getTodos = (todosData: Array<TodoData>) => {
    return todosData.reduce((array: Array<Todo>, todoData) => {
        try {
            array.push(getTodo(todoData));
        } catch (error) {
            console.error(error);
        }
        return array;
    }, []);
};

const getTodo = ({ name, params }: TodoData): Todo => {
    switch (name) {
        case "AtLeastOneOfModulesPerFocusTodo": {
            return new AtLeastOneOfModulesPerFocusTodo(params);
        }
        case "ECTSPerFocusTodo": {
            return new ECTSPerFocusTodo(params);
        }
        case "FocusModulesTodo": {
            return new FocusModulesTodo();
        }
        default:
            throw "Unknown todo: " + name;
    }
};
