import FocusRequiredModulesTodo from "@/Models/Todos/Credit/FocusRequiredModulesTodo";
import { creditModuleFactory } from "@/tests/factories/CreditModuleFactory";
import { focusFactory } from "@/tests/factories/FocusFactory";
import { focusSelectionFactory } from "@/tests/factories/FocusSelectionFactory";
import { describe } from "vitest";
import { ref } from "vue";

describe("FocusRequiredModulesTodo", () => {
    describe("getEntries", () => {
        it("should return an entry for each focusSelection of a focus with one or more required modules", () => {
            const todo = new FocusRequiredModulesTodo();
            const requiredModule1 = creditModuleFactory.build({});
            const requiredModule2 = creditModuleFactory.build();
            const focus1 = focusFactory.build({
                id: "focus_1",
                requiredModules: [requiredModule1, requiredModule2],
            });
            const focus2 = focusFactory.build({
                id: "focus_2",
                requiredModules: [],
            });
            const focusSelection1 = focusSelectionFactory.build({
                id: 1,
                focus: focus1,
            });
            const focusSelection2 = focusSelectionFactory.build({
                id: 2,
                focus: focus2,
            });
            const focusSelection3 = focusSelectionFactory.build({
                id: 3,
                focus: focus1,
            });

            const data = {
                focusSelections: ref([
                    focusSelection1,
                    focusSelection2,
                    focusSelection3,
                ]),
                creditedModulesByFocusSelection: ref([]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(2);
        });

        it("should return an entry with checked = true for a focusSelection where all of its focus' required modules are credited against it", () => {
            const todo = new FocusRequiredModulesTodo();
            const requiredModule1 = creditModuleFactory.build({
                id: "req_mod_1",
                creditedAgainst: 1,
            });
            const requiredModule2 = creditModuleFactory.build({
                id: "req_mod_2",
                creditedAgainst: 1,
            });
            const focus1 = focusFactory.build({
                id: "focus_1",
                requiredModules: [requiredModule1, requiredModule2],
            });
            const focusSelection1 = focusSelectionFactory.build({
                id: 1,
                focus: focus1,
            });

            const data = {
                focusSelections: ref([focusSelection1]),
                creditedModulesByFocusSelection: ref([
                    {
                        focusSelectionId: 1,
                        moduleIds: [requiredModule1.id, requiredModule2.id],
                    },
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("2 / 2");
        });

        it("should return an entry with checked = false for a focusSelection where not all of its focus' required modules are credited against it", () => {
            const todo = new FocusRequiredModulesTodo();
            const requiredModule1 = creditModuleFactory.build({
                id: "req_mod_1",
                creditedAgainst: 1,
            });
            const requiredModule2 = creditModuleFactory.build({
                id: "req_mod_2",
            });
            const focus1 = focusFactory.build({
                id: "focus_1",
                requiredModules: [requiredModule1, requiredModule2],
            });
            const focusSelection1 = focusSelectionFactory.build({
                id: 1,
                focus: focus1,
            });

            const data = {
                focusSelections: ref([focusSelection1]),
                creditedModulesByFocusSelection: ref([
                    {
                        focusSelectionId: 1,
                        moduleIds: [requiredModule1.id],
                    },
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("1 / 2");
        });

        it("should return an entry with checked = false for a focusSelection where none of its focus' required modules are credited against it", () => {
            const todo = new FocusRequiredModulesTodo();
            const requiredModule1 = creditModuleFactory.build({
                id: "req_mod_1",
            });
            const requiredModule2 = creditModuleFactory.build({
                id: "req_mod_2",
            });
            const focus1 = focusFactory.build({
                id: "focus_1",
                requiredModules: [requiredModule1, requiredModule2],
            });
            const focusSelection1 = focusSelectionFactory.build({
                id: 1,
                focus: focus1,
            });

            const data = {
                focusSelections: ref([focusSelection1]),
                creditedModulesByFocusSelection: ref([
                    {
                        focusSelectionId: 1,
                        moduleIds: [],
                    },
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("0 / 2");
        });
    });
});
