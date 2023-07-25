import { describe, it, expect } from "vitest";
import ECTSPerFocusTodo from "@/Models/Todos/Credit/ECTSPerFocusTodo";
import { ref } from "vue";
import { focusSelectionFactory } from "@/tests/factories/FocusSelectionFactory";
import { FocusCredit, FocusSelection, CreditModule } from "@/types";
import { creditModuleFactory } from "@/tests/factories/CreditModuleFactory";

describe("ECTSPerFocusTodo", () => {
    describe("getEntries", () => {
        it("should return one entry for each focusSelection", () => {
            const params = {
                minECTS: 30,
                maxECTS: 50,
            };
            const todo = new ECTSPerFocusTodo(params);
            const focusSelections = [
                focusSelectionFactory.build(),
                focusSelectionFactory.build(),
                focusSelectionFactory.build(),
            ];
            const modules: Array<CreditModule> = [];
            const data = getData(focusSelections, modules);

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(3);
        });

        it("should return an entry with checked = false if totalECTS < minECTS", () => {
            const params = {
                minECTS: 30,
                maxECTS: 50,
            };
            const todo = new ECTSPerFocusTodo(params);
            const focusSelections = [focusSelectionFactory.build({ id: 1 })];
            const modules: Array<CreditModule> = [
                creditModuleFactory.build({ creditedAgainst: 1, ects: 5 }),
                creditModuleFactory.build({ creditedAgainst: 1, ects: 10 }),
                creditModuleFactory.build({ creditedAgainst: 1, ects: 10 }),
            ];
            const data = getData(focusSelections, modules);

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("25");
        });

        it("should return an entry with checked = false if totalECTS > maxECTS", () => {
            const params = {
                minECTS: 0,
                maxECTS: 10,
            };
            const todo = new ECTSPerFocusTodo(params);
            const focusSelections = [focusSelectionFactory.build({ id: 1 })];
            const modules: Array<CreditModule> = [
                creditModuleFactory.build({ creditedAgainst: 1, ects: 5 }),
                creditModuleFactory.build({ creditedAgainst: 1, ects: 5 }),
                creditModuleFactory.build({ creditedAgainst: 1, ects: 5 }),
            ];
            const data = getData(focusSelections, modules);

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("15");
        });

        it("should return an entry with checked = true if minECTS < totalECTS < maxECTS", () => {
            const params = {
                minECTS: 5,
                maxECTS: 20,
            };
            const todo = new ECTSPerFocusTodo(params);
            const focusSelections = [focusSelectionFactory.build({ id: 1 })];
            const modules: Array<CreditModule> = [
                creditModuleFactory.build({ creditedAgainst: 1, ects: 5 }),
                creditModuleFactory.build({ creditedAgainst: 1, ects: 5 }),
                creditModuleFactory.build({ creditedAgainst: 1, ects: 5 }),
            ];
            const data = getData(focusSelections, modules);

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("15");
        });

        it("should return an entry with checked = true if minECTS = totalECTS < maxECTS", () => {
            const params = {
                minECTS: 5,
                maxECTS: 15,
            };
            const todo = new ECTSPerFocusTodo(params);
            const focusSelections = [focusSelectionFactory.build({ id: 1 })];
            const modules: Array<CreditModule> = [
                creditModuleFactory.build({ creditedAgainst: 1, ects: 5 }),
            ];
            const data = getData(focusSelections, modules);

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("5");
        });

        it("should return an entry with checked = true if minECTS < totalECTS = maxECTS", () => {
            const params = {
                minECTS: 5,
                maxECTS: 15,
            };
            const todo = new ECTSPerFocusTodo(params);
            const focusSelections = [focusSelectionFactory.build({ id: 1 })];
            const modules: Array<CreditModule> = [
                creditModuleFactory.build({ creditedAgainst: 1, ects: 5 }),
                creditModuleFactory.build({ creditedAgainst: 1, ects: 10 }),
            ];
            const data = getData(focusSelections, modules);

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("15");
        });
    });
});

function getData(
    focusSelections: Array<FocusSelection>,
    modules: Array<CreditModule>
) {
    return {
        focusSelections: ref(focusSelections),
        modules: ref(modules),
        creditedModulesByFocusSelection: ref(
            getCreditedModulesByFocusSelection(focusSelections, modules)
        ),
    };
}

function getCreditedModulesByFocusSelection(
    focusSelections: Array<FocusSelection>,
    modules: Array<CreditModule>
) {
    return focusSelections.reduce((acc, cur) => {
        const modulesByFocusSelection = {
            focusSelectionId: cur.id,
            moduleIds: modules
                .filter((module) => module.creditedAgainst == cur.id)
                .map((module) => module.id),
        };
        acc.push(modulesByFocusSelection);
        return acc;
    }, [] as Array<FocusCredit>);
}
