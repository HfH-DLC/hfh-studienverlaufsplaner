import AtLeastOneOfModulesPerFocusTodo from "@/Models/Todos/Credit/AtLeastOneOfModulesPerFocusTodo";
import { creditModuleFactory } from "@/tests/factories/CreditModuleFactory";
import { focusSelectionFactory } from "@/tests/factories/FocusSelectionFactory";
import { describe } from "vitest";
import { ref } from "vue";

describe("AtLeastOneOfModulesPerFocusTodo", () => {
    describe("getEntries", () => {
        it("should return an entry for each focusSelection", () => {
            const requiredModuleIds: Array<String> = [];
            const todo = new AtLeastOneOfModulesPerFocusTodo({
                moduleIds: requiredModuleIds,
            });
            const data = {
                focusSelections: ref([
                    focusSelectionFactory.build(),
                    focusSelectionFactory.build(),
                    focusSelectionFactory.build(),
                ]),
                modules: ref([]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(3);
        });

        it("should return an entry with checked = false for a focusSelection which has none of the required modules credited against it", () => {
            const requiredModuleIds: Array<String> = ["req_mod_1", "req_mod_2"];
            const todo = new AtLeastOneOfModulesPerFocusTodo({
                moduleIds: requiredModuleIds,
            });
            const data = {
                focusSelections: ref([focusSelectionFactory.build({ id: 1 })]),
                modules: ref([
                    creditModuleFactory.build({
                        id: "req_mod_1",
                        creditedAgainst: 2,
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("0");
        });
    });

    it("should return an entry with checked = true for a focusSelection which has one of the required modules credited against it", () => {
        const requiredModuleIds: Array<String> = ["req_mod_1", "req_mod_2"];
        const todo = new AtLeastOneOfModulesPerFocusTodo({
            moduleIds: requiredModuleIds,
        });
        const data = {
            focusSelections: ref([focusSelectionFactory.build({ id: 1 })]),
            modules: ref([
                creditModuleFactory.build({
                    id: "req_mod_1",
                    creditedAgainst: 1,
                }),
            ]),
        };

        const entries = todo.getEntries(data);

        expect(entries.length).toBe(1);
        expect(entries[0].checked).toBe(true);
        expect(entries[0].progressLabel).toBe("1");
    });

    it("should return an entry with checked = true for a focusSelection which has more than one of the required modules credited against it", () => {
        const requiredModuleIds: Array<String> = ["req_mod_1", "req_mod_2"];
        const todo = new AtLeastOneOfModulesPerFocusTodo({
            moduleIds: requiredModuleIds,
        });
        const data = {
            focusSelections: ref([focusSelectionFactory.build({ id: 1 })]),
            modules: ref([
                creditModuleFactory.build({
                    id: "req_mod_1",
                    creditedAgainst: 1,
                }),
                creditModuleFactory.build({
                    id: "req_mod_2",
                    creditedAgainst: 1,
                }),
            ]),
        };

        const entries = todo.getEntries(data);

        expect(entries.length).toBe(1);
        expect(entries[0].checked).toBe(true);
        expect(entries[0].progressLabel).toBe("2");
    });
});
