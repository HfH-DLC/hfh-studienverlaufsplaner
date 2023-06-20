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

export const getTodo = ({ name }: TodoData): Todo => {
    const TodoDetails = TodoMapping[name];
    if (TodoDetails) {
        return new TodoDetails.Class();
    } else {
        throw "Unknown todo: " + name;
    }
};
