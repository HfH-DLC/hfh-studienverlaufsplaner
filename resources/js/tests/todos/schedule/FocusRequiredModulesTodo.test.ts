import FocusRequiredModulesTodo from "@/Models/Todos/Schedule/FocusRequiredModulesTodo";
import { focusFactory } from "@/tests/factories/FocusFactory";
import { focusSelectionFactory } from "@/tests/factories/FocusSelectionFactory";
import { scheduleModuleFactory } from "@/tests/factories/ScheduleModuleFactory";
import { schedulePlacementFactory } from "@/tests/factories/SchedulePlacementFactory";
import { describe } from "vitest";
import { ref } from "vue";

describe("FocusRequiredModulesTodo", () => {
    describe("getEntries", () => {
        it("should return an entry for each focusSelection with a focus with required modules", () => {
            const todo = new FocusRequiredModulesTodo();
            const focus1 = focusFactory.build({
                requiredModules: [scheduleModuleFactory.build()],
            });
            const focus2 = focusFactory.build({
                requiredModules: [],
            });
            const focus3 = focusFactory.build({
                requiredModules: [
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
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(2);
        });

        it("should return an entry with checked = true for a focusSelection where all required modules are placed", () => {
            const todo = new FocusRequiredModulesTodo();
            const placement1 = schedulePlacementFactory.build();
            const placement2 = schedulePlacementFactory.build();
            const focus = focusFactory.build({
                requiredModules: [placement1.module, placement2.module],
            });
            const focusSelection = focusSelectionFactory.build({
                focus: focus,
            });

            const data = {
                focusSelections: ref([focusSelection]),
                placements: ref([placement1, placement2]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("2 / 2");
        });

        it("should return an entry with checked = false for a focusSelection where not all required modules are placed", () => {
            const todo = new FocusRequiredModulesTodo();
            const placement1 = schedulePlacementFactory.build();
            const unplacedModule = scheduleModuleFactory.build();
            const focus = focusFactory.build({
                requiredModules: [placement1.module, unplacedModule],
            });
            const focusSelection = focusSelectionFactory.build({
                focus: focus,
            });

            const data = {
                focusSelections: ref([focusSelection]),
                placements: ref([placement1]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("1 / 2");
        });
    });
});
