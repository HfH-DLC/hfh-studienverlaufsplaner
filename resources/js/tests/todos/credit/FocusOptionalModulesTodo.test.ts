import FocusOptionalModulesTodo from "@/Models/Todos/Credit/FocusOptionalModulesTodo";
import { creditModuleFactory } from "@/tests/factories/CreditModuleFactory";
import { focusFactory } from "@/tests/factories/FocusFactory";
import { focusSelectionFactory } from "@/tests/factories/FocusSelectionFactory";
import { describe } from "vitest";
import { ref } from "vue";

describe("FocusOptionalModulesTodo", () => {
    describe("getEntries", () => {
        it("should return an entry for each focusSelection of a focus with one or more optional modules", () => {
            const todo = new FocusOptionalModulesTodo();
            const optionalModule1 = creditModuleFactory.build({});
            const optionalModule2 = creditModuleFactory.build();
            const focus1 = focusFactory.build({
                id: "focus_1",
                optionalModules: [optionalModule1, optionalModule2],
            });
            const focus2 = focusFactory.build({
                id: "focus_2",
                optionalModules: [],
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

        it("should return an entry with checked = true for a focusSelection where the required number of its focus' optional modules are credited against it", () => {
            const todo = new FocusOptionalModulesTodo();
            const optionalModule1 = creditModuleFactory.build({
                id: "opt_mod_1",
                creditedAgainst: 1,
            });
            const optionalModule2 = creditModuleFactory.build({
                id: "opt_mod_2",
                creditedAgainst: 1,
            });
            const optionalModule3 = creditModuleFactory.build({
                id: "opt_mod_3",
            });
            const focus1 = focusFactory.build({
                id: "focus_1",
                optionalModules: [
                    optionalModule1,
                    optionalModule2,
                    optionalModule3,
                ],
                requiredNumberOfOptionalModules: 2,
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
                        moduleIds: [optionalModule1.id, optionalModule2.id],
                    },
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("2 / 2");
        });

        it("should return an entry with checked = false for a focusSelection where more than the required number of its focus' optional modules are credited against it", () => {
            const todo = new FocusOptionalModulesTodo();
            const optionalModule1 = creditModuleFactory.build({
                id: "opt_mod_1",
                creditedAgainst: 1,
            });
            const optionalModule2 = creditModuleFactory.build({
                id: "opt_mod_2",
                creditedAgainst: 1,
            });
            const optionalModule3 = creditModuleFactory.build({
                id: "opt_mod_3",
                creditedAgainst: 1,
            });
            const focus1 = focusFactory.build({
                id: "focus_1",
                optionalModules: [
                    optionalModule1,
                    optionalModule2,
                    optionalModule3,
                ],
                requiredNumberOfOptionalModules: 2,
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
                        moduleIds: [
                            optionalModule1.id,
                            optionalModule2.id,
                            optionalModule3.id,
                        ],
                    },
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("3 / 2");
        });

        it("should return an entry with checked = false for a focusSelection where less than the required number of its focus' optional modules are credited against it", () => {
            const todo = new FocusOptionalModulesTodo();
            const optionalModule1 = creditModuleFactory.build({
                id: "opt_mod_1",
                creditedAgainst: 1,
            });
            const optionalModule2 = creditModuleFactory.build({
                id: "opt_mod_2",
            });
            const optionalModule3 = creditModuleFactory.build({
                id: "opt_mod_3",
            });
            const focus1 = focusFactory.build({
                id: "focus_1",
                optionalModules: [
                    optionalModule1,
                    optionalModule2,
                    optionalModule3,
                ],
                requiredNumberOfOptionalModules: 2,
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
                        moduleIds: [optionalModule1.id],
                    },
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("1 / 2");
        });
    });
});
