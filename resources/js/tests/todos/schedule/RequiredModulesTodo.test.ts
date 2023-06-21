import RequiredModulesTodo from "@/Models/Todos/Schedule/RequiredModulesTodo";
import { priorLearnignFactory } from "@/tests/factories/PriorLearningFactory";
import { scheduleCategoryFactory } from "@/tests/factories/ScheduleCategoryFactory";
import { scheduleModuleFactory } from "@/tests/factories/ScheduleModuleFactory";
import { schedulePlacementFactory } from "@/tests/factories/SchedulePlacementFactory";
import { describe } from "vitest";
import { ref } from "vue";

describe("RequiredModulesTodo", () => {
    describe("getEntries", () => {
        it("should return an entry for each required category", () => {
            const todo = new RequiredModulesTodo();
            const data = {
                categories: ref([
                    scheduleCategoryFactory.build({
                        required: true,
                    }),
                    scheduleCategoryFactory.build({
                        required: true,
                    }),
                    scheduleCategoryFactory.build({
                        required: false,
                    }),
                ]),
                priorLearnings: ref([]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(2);
        });

        it("should return an entry with checked = true if all modules of a required category are placed", () => {
            const todo = new RequiredModulesTodo();
            const placement1 = schedulePlacementFactory.build();
            const placement2 = schedulePlacementFactory.build();
            const data = {
                categories: ref([
                    scheduleCategoryFactory.build({
                        required: true,
                        modules: [placement1.module, placement2.module],
                    }),
                ]),
                priorLearnings: ref([]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("2 / 2");
        });

        it("should return an entry with checked = true if all modules of a required category are either placed or in prior learnings", () => {
            const todo = new RequiredModulesTodo();
            const placement1 = schedulePlacementFactory.build();
            const priorLearningModule = scheduleModuleFactory.build();
            const data = {
                categories: ref([
                    scheduleCategoryFactory.build({
                        required: true,
                        modules: [placement1.module, priorLearningModule],
                    }),
                ]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: priorLearningModule.id,
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("2 / 2");
        });

        it("should return an entry with checked = true if all modules of a required category are in prior learnings", () => {
            const todo = new RequiredModulesTodo();
            const module1 = scheduleModuleFactory.build();
            const module2 = scheduleModuleFactory.build();
            const data = {
                categories: ref([
                    scheduleCategoryFactory.build({
                        required: true,
                        modules: [module1, module2],
                    }),
                ]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: module1.id,
                    }),
                    priorLearnignFactory.build({
                        countsAsModuleId: module2.id,
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(true);
            expect(entries[0].progressLabel).toBe("2 / 2");
        });

        it("should return an entry with checked = false if not all modules of a required category are placed", () => {
            const todo = new RequiredModulesTodo();
            const placement = schedulePlacementFactory.build();
            const unplacedModule = scheduleModuleFactory.build();
            const data = {
                categories: ref([
                    scheduleCategoryFactory.build({
                        required: true,
                        modules: [placement.module, unplacedModule],
                    }),
                ]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: "someUnrelatedModuleId",
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("1 / 2");
        });

        it("should return an entry with checked = false if no modules of a required category are placed", () => {
            const todo = new RequiredModulesTodo();
            const unplacedModule1 = scheduleModuleFactory.build();
            const unplacedModule2 = scheduleModuleFactory.build();
            const data = {
                categories: ref([
                    scheduleCategoryFactory.build({
                        required: true,
                        modules: [unplacedModule1, unplacedModule2],
                    }),
                ]),
                priorLearnings: ref([
                    priorLearnignFactory.build({
                        countsAsModuleId: "someUnrelatedModuleId",
                    }),
                ]),
            };

            const entries = todo.getEntries(data);

            expect(entries.length).toBe(1);
            expect(entries[0].checked).toBe(false);
            expect(entries[0].progressLabel).toBe("0 / 2");
        });
    });
});
