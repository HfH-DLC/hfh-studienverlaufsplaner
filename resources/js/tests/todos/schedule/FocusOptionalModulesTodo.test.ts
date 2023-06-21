import FocusOptionalModulesTodo from "@/Models/Todos/Schedule/FocusOptionalModulesTodo";
import { focusFactory } from "@/tests/factories/FocusFactory";
import { focusSelectionFactory } from "@/tests/factories/FocusSelectionFactory";
import { priorLearnignFactory } from "@/tests/factories/PriorLearningFactory";
import { scheduleModuleFactory } from "@/tests/factories/ScheduleModuleFactory";
import { schedulePlacementFactory } from "@/tests/factories/SchedulePlacementFactory";
import { describe } from "vitest";
import { ref } from "vue";

describe("FocusOptionalModulesTodo", () => {
    describe("getEntries", () => {
        it("should return an entry for each focusSelection with a focus with optional modules", () => {
            const todo = new FocusOptionalModulesTodo();
            const focus1 = focusFactory.build({
                optionalModules: [scheduleModuleFactory.build()],
            });
            const focus2 = focusFactory.build({
                optionalModules: [],
            });
            const focus3 = focusFactory.build({
                optionalModules: [
                    scheduleModuleFactory.build(),
                    scheduleModuleFactory.build(),
                ],
            });
            const focusSelection1 = focusSelectionFactory.build({
                focus: focus1,
            });
            const focusSelection2 = focusSelectionFactory.build({
                focus: focus2,
            });
            const focusSelection3 = focusSelectionFactory.build({
                focus: focus3,
            });
            const data = {
                focusSelections: ref([
                    focusSelection1,
                    focusSelection2,
                    focusSelection3,
                ]),
                placements: ref([]),
                priorLearnings: ref([]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(2);
        });

        it("should return an entry with checked = true for a focusSelection where the required number of optional modules are placed", () => {
            const todo = new FocusOptionalModulesTodo();
            const placement1 = schedulePlacementFactory.build();
            const placement2 = schedulePlacementFactory.build();
            const unplacedModule = scheduleModuleFactory.build();
            const focus = focusFactory.build({
                optionalModules: [
                    placement1.module,
                    placement2.module,
                    unplacedModule,
                ],
                requiredNumberOfOptionalModules: 2,
            });
            const focusSelection = focusSelectionFactory.build({
                focus: focus,
            });

            const data = {
                focusSelections: ref([focusSelection]),
                placements: ref([placement1, placement2]),
                priorLearnings: ref([]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("2 / 2");
        });

        it("should return an entry with checked = true for a focusSelection where the required number of optional modules are in prior learnings", () => {
            const todo = new FocusOptionalModulesTodo();
            const module1 = scheduleModuleFactory.build();
            const module2 = scheduleModuleFactory.build();
            const module3 = scheduleModuleFactory.build();
            const focus = focusFactory.build({
                optionalModules: [module1, module2, module3],
                requiredNumberOfOptionalModules: 2,
            });
            const focusSelection = focusSelectionFactory.build({
                focus: focus,
            });

            const data = {
                focusSelections: ref([focusSelection]),
                placements: ref([]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: module1.id,
                    }),
                    priorLearnignFactory.build({
                        countsAsModuleId: module3.id,
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("2 / 2");
        });

        it("should return an entry with checked = true for a focusSelection where the required number of optional modules are either placed or in prior learnings", () => {
            const todo = new FocusOptionalModulesTodo();
            const placement1 = schedulePlacementFactory.build();
            const module2 = scheduleModuleFactory.build();
            const module3 = scheduleModuleFactory.build();
            const focus = focusFactory.build({
                optionalModules: [placement1.module, module2, module3],
                requiredNumberOfOptionalModules: 2,
            });
            const focusSelection = focusSelectionFactory.build({
                focus: focus,
            });

            const data = {
                focusSelections: ref([focusSelection]),
                placements: ref([placement1]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: module3.id,
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("2 / 2");
        });

        it("should return an entry with checked = false for a focusSelection where less than the required number of optional modules are placed or prior learnings", () => {
            const todo = new FocusOptionalModulesTodo();
            const placement1 = schedulePlacementFactory.build();
            const module2 = scheduleModuleFactory.build();
            const module3 = scheduleModuleFactory.build();
            const module4 = scheduleModuleFactory.build();
            const focus = focusFactory.build({
                optionalModules: [placement1.module, module2, module3, module4],
                requiredNumberOfOptionalModules: 3,
            });
            const focusSelection = focusSelectionFactory.build({
                focus: focus,
            });

            const data = {
                focusSelections: ref([focusSelection]),
                placements: ref([placement1]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: module3.id,
                    }),
                    priorLearnignFactory.build({
                        countsAsModuleId: "someOtherModuleId",
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("2 / 3");
        });

        it("should return an entry with checked = true for a focusSelection where more than the required number of optional modules are placed", () => {
            const todo = new FocusOptionalModulesTodo();
            const placement1 = schedulePlacementFactory.build();
            const placement2 = schedulePlacementFactory.build();
            const placement3 = schedulePlacementFactory.build();
            const focus = focusFactory.build({
                optionalModules: [
                    placement1.module,
                    placement2.module,
                    placement3.module,
                ],
                requiredNumberOfOptionalModules: 2,
            });
            const focusSelection = focusSelectionFactory.build({
                focus: focus,
            });

            const data = {
                focusSelections: ref([focusSelection]),
                placements: ref([placement1, placement2, placement3]),
                priorLearnings: ref([]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            //Only the required number will be counted, even if more are placed
            expect(entries[0].progressLabel).toBe("2 / 2");
        });

        it("should return an entry with checked = true for a focusSelection where more than the required number of optional modules are in prior learnings", () => {
            const todo = new FocusOptionalModulesTodo();
            const module1 = scheduleModuleFactory.build();
            const module2 = scheduleModuleFactory.build();
            const module3 = scheduleModuleFactory.build();
            const focus = focusFactory.build({
                optionalModules: [module1, module2, module3],
                requiredNumberOfOptionalModules: 2,
            });
            const focusSelection = focusSelectionFactory.build({
                focus: focus,
            });

            const data = {
                focusSelections: ref([focusSelection]),
                placements: ref([]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: module1.id,
                    }),
                    priorLearnignFactory.build({
                        countsAsModuleId: module2.id,
                    }),
                    priorLearnignFactory.build({
                        countsAsModuleId: module3.id,
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            //Only the required number will be counted, even if more are placed
            expect(entries[0].progressLabel).toBe("2 / 2");
        });
    });
});
