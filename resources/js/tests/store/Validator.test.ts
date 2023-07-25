import { describe, expect, it, vi } from "vitest";
import Validator from "@/Validator";
import { MessageType, Rule, ScheduleModule, Todo } from "@/types";
import { ChecklistEntryData, Message } from "@/types";
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

        const checklistEntries = validator.getTodoEntries(data);

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
            { label: "error1.1", type: MessageType.Error },
            { label: "error1.2", type: MessageType.Error },
            { label: "error2.1", type: MessageType.Error },
            { label: "error2.2", type: MessageType.Error },
        ];
        const rule1: Rule = {
            getModuleErrors: vi
                .fn()
                .mockImplementation(
                    (
                        module: ScheduleModule,
                        data: Record<string, any>,
                        errors: Array<Message>
                    ) => {
                        errors.push(expectedErrorMessages[0]);
                        errors.push(expectedErrorMessages[1]);
                    }
                ),
            getGlobalInfos: vi.fn,
            getPlacementErrors: vi.fn,
            getSelectionStatus: vi.fn,
        };
        const rule2: Rule = {
            getModuleErrors: vi
                .fn()
                .mockImplementation(
                    (
                        module: ScheduleModule,
                        data: Record<string, any>,
                        errors: Array<Message>
                    ) => {
                        errors.push(expectedErrorMessages[2]);
                        errors.push(expectedErrorMessages[3]);
                    }
                ),
            getGlobalInfos: vi.fn,
            getPlacementErrors: vi.fn,
            getSelectionStatus: vi.fn,
        };
        const rules: Array<Rule> = [rule1, rule2];
        const validator = new Validator([], rules);
        const data: Record<string, Ref<any>> = {
            modules: ref(modules),
        };

        const errorMessages = validator.getModuleErrors(data);

        rules.forEach((rule) => {
            expect(rule.getModuleErrors).toHaveBeenCalledTimes(modules.length);
        });
        modules.forEach((module) => {
            let moduleErrorMessages = errorMessages.get(module.id);
            expect(moduleErrorMessages?.length).toBe(
                expectedErrorMessages.length
            );
        });
    });

    it("should validate placements", () => {
        const expectedErrorMessages: Array<Array<Message>> = [
            [
                { label: "error0.1", type: MessageType.Error },
                { label: "error0.2", type: MessageType.Error },
            ],
            [
                { label: "error1.1", type: MessageType.Error },
                { label: "error1.2", type: MessageType.Error },
            ],
            [
                { label: "error2.1", type: MessageType.Error },
                { label: "error2.2", type: MessageType.Error },
            ],
            [
                { label: "error3.1", type: MessageType.Error },
                { label: "error3.2", type: MessageType.Error },
            ],
        ];
        const rule1: Rule = {
            getPlacementErrors: vi.fn().mockImplementation((data, errors) => {
                errors.set(0, expectedErrorMessages[0]);
                errors.set(1, expectedErrorMessages[1]);
            }),
            getGlobalInfos: vi.fn,
            getModuleErrors: vi.fn,
            getSelectionStatus: vi.fn,
        };
        const rule2: Rule = {
            getPlacementErrors: vi.fn().mockImplementation((data, errors) => {
                errors.set(2, expectedErrorMessages[2]);
                errors.set(3, expectedErrorMessages[3]);
            }),
            getGlobalInfos: vi.fn,
            getModuleErrors: vi.fn,
            getSelectionStatus: vi.fn,
        };
        const rules: Array<Rule> = [rule1, rule2];
        const validator = new Validator([], rules);
        const data = {
            modules: ref([]),
            placements: ref([]),
        };

        const errorMessages = validator.getPlacementErrors(data);

        rules.forEach((rule) => {
            expect(rule.getPlacementErrors).toHaveBeenCalledOnce();
        });
        for (let i = 0; i < expectedErrorMessages.length; i++) {
            expect(errorMessages.get(i)).toBe(expectedErrorMessages[i]);
        }
    });

    it("should validate", () => {
        const validator = new Validator([], []);
        const todosSpy = vi.spyOn(validator, "getTodoEntries");
        const modulesSpy = vi.spyOn(validator, "getModuleErrors");
        const placementsSpy = vi.spyOn(validator, "getPlacementErrors");

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
            getGlobalInfos: () => {},
            getPlacementErrors: () => {},
            getModuleErrors: () => {},
            getSelectionStatus: () => {},
        };
        const rule2: Rule = {
            getGlobalInfos: () => {},
            getPlacementErrors: () => {},
            getModuleErrors: () => {},
            getSelectionStatus: () => {},
        };
        const spy1 = vi.spyOn(rule1, "getSelectionStatus");
        const spy2 = vi.spyOn(rule2, "getSelectionStatus");
        const validator = new Validator([], [rule1, rule2]);
        const module = scheduleModuleFactory.build();

        const result = validator.getSelectionStatus(module, {});

        expect(result.moduleId).toBe(module.id);
        expect(spy1).toHaveBeenCalledOnce();
        expect(spy2).toHaveBeenCalledOnce();
    });
});
