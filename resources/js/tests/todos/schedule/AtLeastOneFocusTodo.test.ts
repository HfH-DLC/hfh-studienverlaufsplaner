import AtLeastOneFocusTodo from "@/Models/Todos/Schedule/AtLeastOneFocusTodo";
import { focusSelectionFactory } from "@/tests/factories/FocusSelectionFactory";
import { describe, it, expect } from "vitest";
import { ref } from "vue";

describe("AtLeastOneFocusTodo", () => {
    describe("getEntries", () => {
        it("should return an entry with checked = false if no focusSelection exists", () => {
            const todo = new AtLeastOneFocusTodo();
            const data = { focusSelections: ref([]) };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("0");
        });

        it("should return an entry with checked = true if one focusSelection exists", () => {
            const todo = new AtLeastOneFocusTodo();
            const data = {
                focusSelections: ref([focusSelectionFactory.build()]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("1");
        });

        it("should return an entry with checked = true if more than one focusSelection exists", () => {
            const todo = new AtLeastOneFocusTodo();
            const data = {
                focusSelections: ref([
                    focusSelectionFactory.build(),
                    focusSelectionFactory.build(),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("2");
        });
    });
});
