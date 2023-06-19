import TotalECTSTodo from "@/Models/Todos/Schedule/TotalECTSTodo";
import { describe, it, expect } from "vitest";
import { ref } from "vue";

describe("TotalECTSTodo", () => {
    describe("getEntries", () => {
        it("should return an entry with checked = false if ects does not match required ects", () => {
            const todo = new TotalECTSTodo();
            const data = { ects: ref(15), requiredECTS: ref(80) };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("15 / 80");
        });

        it("should return an entry with checked = true if ects does match required ects", () => {
            const todo = new TotalECTSTodo();
            const data = { ects: ref(75), requiredECTS: ref(75) };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("75 / 75");
        });
    });
});
