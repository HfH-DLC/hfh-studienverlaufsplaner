import { Todo, TodoData } from "@/types";
import TodoMapping from "./TodoMapping";

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
    const TodoDetails = TodoMapping[name];
    if (TodoDetails) {
        if (TodoDetails.paramsRequired) {
            return new TodoDetails.Class(params);
        } else {
            return new TodoDetails.Class();
        }
    } else {
        throw "Unknown todo: " + name;
    }
};
