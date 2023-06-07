import { describe, expect, it, vi } from "vitest";
import Validator from "@/Validator";
import { Rule, ScheduleModule, Todo } from "@/types";
import { ChecklistEntryData, ErrorMessage } from "@/types";
import { Ref, ref } from "vue";
import { scheduleModuleFactory } from "@/tests/factories/ScheduleModuleFactory";

describe("Validator", () => {
    it("should validate todos", () => {
        const expectedEntries: Array<ChecklistEntryData> = [
            { checked: true, progressLabel: "todo1.1" },
            { checked: true, progressLabel: "todo1.2" },
            { checked: false, progressLabel: "todo2.1" },
            { checked: false, progressLabel: "todo2.2" },
        ];
        const todo1: Todo = {
            getEntries: vi
                .fn()
                .mockImplementation(() => [
                    expectedEntries[0],
                    expectedEntries[1],
                ]),
        };
        const todo2: Todo = {
            getEntries: vi
                .fn()
                .mockImplementation(() => [
                    expectedEntries[2],
                    expectedEntries[3],
                ]),
        };
        const todos: Array<Todo> = [todo1, todo2];
        const validator = new Validator(todos, []);
        const data = {
            modules: { value: [] },
            placements: { value: [] },
        };

        const checklistEntries = validator.validateTodos(data);

        expect(todo1.getEntries).toHaveBeenCalledOnce();
        expect(todo2.getEntries).toHaveBeenCalledOnce();
        expectedEntries.forEach((expectedEntry) => {
            const index = checklistEntries.findIndex((entry) => {
                return (
                    entry.checked == expectedEntry.checked &&
                    entry.progressLabel == expectedEntry.progressLabel
                );
            });
            expect(index).toBeGreaterThanOrEqual(0);
        });
    });

    it("should validate modules", () => {
        const modules = scheduleModuleFactory.buildList(5);
        const expectedErrorMessages = [
            { label: "error1.1" },
            { label: "error1.2" },
            { label: "error2.1" },
            { label: "error2.2" },
        ];
        const rule1: Rule = {
            validateModule: vi
                .fn()
                .mockImplementation(
                    (
                        module: ScheduleModule,
                        data: Record<string, any>,
                        errors: Array<ErrorMessage>
                    ) => {
                        errors.push(expectedErrorMessages[0]);
                        errors.push(expectedErrorMessages[1]);
                    }
                ),
            validatePlacements: vi.fn,
            validateSelection: vi.fn,
        };
        const rule2: Rule = {
            validateModule: vi
                .fn()
                .mockImplementation(
                    (
                        module: ScheduleModule,
                        data: Record<string, any>,
                        errors: Array<ErrorMessage>
                    ) => {
                        errors.push(expectedErrorMessages[2]);
                        errors.push(expectedErrorMessages[3]);
                    }
                ),
            validatePlacements: vi.fn,
            validateSelection: vi.fn,
        };
        const rules: Array<Rule> = [rule1, rule2];
        const validator = new Validator([], rules);
        const data: Record<string, Ref<any>> = {
            modules: ref(modules),
        };

        const errorMessages = validator.validateModules(data);

        rules.forEach((rule) => {
            expect(rule.validateModule).toHaveBeenCalledTimes(modules.length);
        });
        modules.forEach((module) => {
            let moduleErrorMessages = errorMessages.get(module.id);
            expect(moduleErrorMessages?.length).toBe(
                expectedErrorMessages.length
            );
        });
    });

    it("should validate placements", () => {
        const expectedErrorMessages: Array<Array<ErrorMessage>> = [
            [{ label: "error0.1" }, { label: "error0.2" }],
            [{ label: "error1.1" }, { label: "error1.2" }],
            [{ label: "error2.1" }, { label: "error2.2" }],
            [{ label: "error3.1" }, { label: "error3.2" }],
        ];
        const rule1: Rule = {
            validatePlacements: vi.fn().mockImplementation((data, errors) => {
                errors.set(0, expectedErrorMessages[0]);
                errors.set(1, expectedErrorMessages[1]);
            }),
            validateModule: vi.fn,
            validateSelection: vi.fn,
        };
        const rule2: Rule = {
            validatePlacements: vi.fn().mockImplementation((data, errors) => {
                errors.set(2, expectedErrorMessages[2]);
                errors.set(3, expectedErrorMessages[3]);
            }),
            validateModule: vi.fn,
            validateSelection: vi.fn,
        };
        const rules: Array<Rule> = [rule1, rule2];
        const validator = new Validator([], rules);
        const data = {
            modules: ref([]),
            placements: ref([]),
        };

        const errorMessages = validator.validatePlacements(data);

        rules.forEach((rule) => {
            expect(rule.validatePlacements).toHaveBeenCalledOnce();
        });
        for (let i = 0; i < expectedErrorMessages.length; i++) {
            expect(errorMessages.get(i)).toBe(expectedErrorMessages[i]);
        }
    });

    it("should validate", () => {
        const validator = new Validator([], []);
        const todosSpy = vi.spyOn(validator, "validateTodos");
        const modulesSpy = vi.spyOn(validator, "validateModules");
        const placementsSpy = vi.spyOn(validator, "validatePlacements");

        validator.validate({
            modules: ref([]),
            placements: ref([]),
        });

        expect(todosSpy).toHaveBeenCalledOnce();
        expect(modulesSpy).toHaveBeenCalledOnce();
        expect(placementsSpy).toHaveBeenCalledOnce();
    });

    it("should validate selection", () => {
        const rule1: Rule = {
            validatePlacements: () => {},
            validateModule: () => {},
            validateSelection: () => {},
        };
        const rule2: Rule = {
            validatePlacements: () => {},
            validateModule: () => {},
            validateSelection: () => {},
        };
        const spy1 = vi.spyOn(rule1, "validateSelection");
        const spy2 = vi.spyOn(rule2, "validateSelection");
        const validator = new Validator([], [rule1, rule2]);
        const module = scheduleModuleFactory.build();

        const result = validator.validateSelection(module, {});

        expect(result.moduleId).toBe(module.id);
        expect(spy1).toHaveBeenCalledOnce();
        expect(spy2).toHaveBeenCalledOnce();
    });
});
