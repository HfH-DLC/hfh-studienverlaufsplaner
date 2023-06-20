import { describe, vi } from "vitest";
import TodoMapping from "@/Models/Todos/Credit/TodoMapping";
import { getTodos } from "@/Models/Todos/Credit/TodoFactory";

const todoCases = Object.entries(TodoMapping).map(([name, details]) => {
    const params = details!.paramsRequired ? {} : undefined;
    return { todoData: { name, params }, Class: details!.Class };
});

describe("TodoFactory", () => {
    describe("getTodos", () => {
        it("creates a the correct todos", () => {
            const todos = getTodos(
                todoCases.map((todoCase) => todoCase.todoData)
            );
            expect(todos.length).toBe(todoCases.length);
            todoCases.forEach((todoCase, index) => {
                expect(todos[index]).toBeInstanceOf(todoCase.Class);
            });
        });

        it("throws an error when passed an unknown todo name", () => {
            const consoleErrorMock = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});

            const todos = getTodos([
                {
                    name: "UnknownTodo",
                },
            ]);

            expect(todos.length).toBe(0);
            expect(consoleErrorMock).toHaveBeenCalledOnce();
            consoleErrorMock.mockRestore();
        });
    });
});
