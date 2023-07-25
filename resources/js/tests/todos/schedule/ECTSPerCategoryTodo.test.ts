import ECTSPerCategoryTodo from "@/Models/Todos/Schedule/ECTSPerCategoryTodo";
import { scheduleCategoryFactory } from "@/tests/factories/ScheduleCategoryFactory";
import { describe, it, expect } from "vitest";
import { ref } from "vue";

describe("ECTSPerCategoryTodo", () => {
    describe("getEntries", () => {
        it("should return an entry for each category that has a minECTS or maxECTS value", () => {
            const todo = new ECTSPerCategoryTodo();
            const data = {
                categories: ref([
                    scheduleCategoryFactory.build({
                        id: 1,
                        minECTS: 5,
                        maxECTS: 0,
                    }),
                    scheduleCategoryFactory.build({
                        id: 2,
                        minECTS: 0,
                        maxECTS: 10,
                    }),
                    scheduleCategoryFactory.build({
                        id: 3,
                        minECTS: 0,
                        maxECTS: 0,
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(2);
        });

        it("should return an entry with checked = false for a category where currentECTS > maxECTS", () => {
            const todo = new ECTSPerCategoryTodo();
            const data = {
                categories: ref([
                    scheduleCategoryFactory.build({
                        id: 1,
                        maxECTS: 20,
                        currentECTS: 25,
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
        });

        it("should return an entry with checked = false for a category where currentECTS < minECTS", () => {
            const todo = new ECTSPerCategoryTodo();
            const data = {
                categories: ref([
                    scheduleCategoryFactory.build({
                        id: 1,
                        minECTS: 20,
                        currentECTS: 19,
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
        });

        it("should return an entry with checked = true for a category where currentECTS >= minECTS and <= maxECTS", () => {
            const todo = new ECTSPerCategoryTodo();
            const data = {
                categories: ref([
                    scheduleCategoryFactory.build({
                        id: 1,
                        minECTS: 10,
                        maxECTS: 30,
                        currentECTS: 20,
                    }),
                    scheduleCategoryFactory.build({
                        id: 1,
                        minECTS: 10,
                        maxECTS: 30,
                        currentECTS: 10,
                    }),
                    scheduleCategoryFactory.build({
                        id: 1,
                        minECTS: 10,
                        maxECTS: 30,
                        currentECTS: 30,
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(3);
            expect(entries[0].checked).toBe(true);
            expect(entries[1].checked).toBe(true);
            expect(entries[2].checked).toBe(true);
        });
    });
});
