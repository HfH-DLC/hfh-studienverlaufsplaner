import { describe, test, expect, beforeEach, vi, Mock, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import DataAdapter from "@/DataAdapter";
import { useCreditStore } from "@/Store/credit";
import Validator from "@/Validator";
import {
    CreditInitParams,
    ChecklistEntryData,
    SaveStatus,
    FocusCredit,
    CreditModule,
    FocusSelection,
} from "@/types";
import { creditModuleFactory } from "../factories/CreditModuleFactory";
import { checklistEntryDataFactory } from "../factories/ChecklistEntryDataFactory";
import { focusSelectionFactory } from "../factories/FocusSelectionFactory";

vi.mock("@/DataAdapter");
vi.mock("@/Validator");

function getInitializedStore(params: Partial<CreditInitParams> | null = null) {
    const store = useCreditStore();
    const defaultValidator = new Validator([], []);
    defaultValidator.getTodoEntries = vi.fn().mockImplementation(() => []);

    const defaultParams: CreditInitParams = {
        dataAdapter: new DataAdapter("test-planer", "test-plan"),
        validator: defaultValidator,
        tourCompleted: false,
        readOnly: false,
        modules: [],
        focusSelections: [],
        tour: {
            steps: [],
        },
    };
    const mergedParams: CreditInitParams = { ...defaultParams, ...params };
    store.init(mergedParams);
    const dataAdapter = mergedParams.dataAdapter;
    const validator = mergedParams.validator;
    (validator.getTodoEntries as Mock).mockClear();
    return { store, dataAdapter, validator };
}

describe("CreditStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setActivePinia(createPinia());
    });

    test("init", () => {
        const dataAdapter = new DataAdapter("test-planer", "test-plan");
        const validator = new Validator([], []);
        //Setup
        const mockTodoResults: Array<ChecklistEntryData> = [
            {
                checked: false,
                label: "Todo 1",
                progressLabel: "1/3",
            },
            {
                checked: true,
                label: "Todo 2",
                progressLabel: "2/2",
            },
        ];
        validator.getTodoEntries = vi.fn(() => mockTodoResults);
        const store = useCreditStore();
        const params: CreditInitParams = {
            dataAdapter,
            validator,
            focusSelections: [],
            modules: [],
            tourCompleted: false,
            readOnly: true,
            tour: {
                steps: [
                    { title: "Step 1", content: "Some Text" },
                    { title: "Step 2", content: "Some Text" },
                ],
            },
        };

        //Act
        store.init(params);

        //Assert
        expect(store.readOnly).toBe(params.readOnly);
        expect(store.focusSelections).toStrictEqual(params.focusSelections);
        expect(store.modules).toStrictEqual(params.modules);
        expect(store.tour).toStrictEqual(params.tour);
        expect(store.tourCompleted).toBe(params.tourCompleted);
        expect(store.initialized).toBe(true);
        expect(store.valid).toBe(false);
        expect(store.todoEntries).toStrictEqual(mockTodoResults);
    });

    test("creditModuleAgainstFocusSelection", () => {
        const creditModule = creditModuleFactory.build();
        const { store, validator, dataAdapter } = getInitializedStore({
            modules: [creditModule],
        });
        expect(creditModule.creditedAgainst).toBe(null);

        const moduleId = creditModule.id;
        const focusSelectionId = 13;

        store.creditModuleAgainstFocusSelection(moduleId, focusSelectionId);

        expect(validator.getTodoEntries).toHaveBeenCalledOnce();
        expect(dataAdapter.saveCredit).toHaveBeenCalledOnce();
        const module = store.modules.find((module) => module.id == moduleId);
        expect(module?.creditedAgainst).toBe(focusSelectionId);
    });

    test("save", async () => {
        const { store, dataAdapter } = getInitializedStore();
        const result = await store.save();
        expect(result).toBe(true);
        expect(dataAdapter.saveCredit).toHaveBeenCalledOnce();
        expect(store.saveStatus).toBe(SaveStatus.Saved);
    });

    test("save error", async () => {
        const { store, dataAdapter } = getInitializedStore();
        dataAdapter.saveCredit = vi.fn().mockImplementation(() => {
            throw new Error("TestError");
        });
        const consoleErrorMock = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        const result = await store.save();
        consoleErrorMock.mockRestore();
        expect(dataAdapter.saveCredit).toHaveBeenCalledOnce();
        expect(result).toBe(false);
        expect(store.saveStatus).toBe(SaveStatus.Error);
    });

    test("start tour", () => {
        const { store } = getInitializedStore();
        expect(store.tourActive).toBe(false);

        store.startTour();

        expect(store.tourActive).toBe(true);
    });

    test("complete tour", () => {
        const { store, dataAdapter } = getInitializedStore();
        store.tourActive = true;
        expect(store.tourCompleted).toBe(false);

        store.completeTour();

        expect(store.tourActive).toBe(false);
        expect(store.tourCompleted).toBe(true);
        expect(dataAdapter.saveCredit).toHaveBeenCalledOnce();
    });

    describe("validate", () => {
        it("should should return false for store.valid if no todo entries are checked", () => {
            const { store, validator } = getInitializedStore();
            const mockTodoEntries: Array<ChecklistEntryData> = [
                checklistEntryDataFactory.build({ checked: false }),
                checklistEntryDataFactory.build({ checked: false }),
            ];
            (validator.getTodoEntries as Mock).mockImplementation(() => {
                return mockTodoEntries;
            });
            store.valid = true;

            store.validate();

            expect(validator.getTodoEntries).toHaveBeenCalledOnce();
            expect(store.todoEntries).toStrictEqual(mockTodoEntries);
            expect(store.valid).toBe(false);
        });
        it("should should return false for store.valid if not all todo entries are checked", () => {
            const { store, validator } = getInitializedStore();
            const mockTodoEntries: Array<ChecklistEntryData> = [
                checklistEntryDataFactory.build({ checked: false }),
                checklistEntryDataFactory.build({ checked: true }),
            ];
            (validator.getTodoEntries as Mock).mockImplementation(() => {
                return mockTodoEntries;
            });
            store.valid = true;

            store.validate();

            expect(validator.getTodoEntries).toHaveBeenCalledOnce();
            expect(store.todoEntries).toStrictEqual(mockTodoEntries);
            expect(store.valid).toBe(false);
        });
        it("should should return true for store.valid if all todo entries are checked", () => {
            const { store, validator } = getInitializedStore();
            const mockTodoEntries: Array<ChecklistEntryData> = [
                checklistEntryDataFactory.build({ checked: true }),
                checklistEntryDataFactory.build({ checked: true }),
            ];
            (validator.getTodoEntries as Mock).mockImplementation(() => {
                return mockTodoEntries;
            });
            store.valid = false;

            store.validate();

            expect(validator.getTodoEntries).toHaveBeenCalledOnce();
            expect(store.todoEntries).toStrictEqual(mockTodoEntries);
            expect(store.valid).toBe(true);
        });
    });

    test("getter creditedModulesByFocusSelection", () => {
        const focusSelections: Array<FocusSelection> = [
            focusSelectionFactory.build({ id: 1 }),
            focusSelectionFactory.build({ id: 2 }),
            focusSelectionFactory.build({ id: 3 }),
        ];
        const modules: Array<CreditModule> = [
            creditModuleFactory.build({ id: "a", creditedAgainst: 1 }),
            creditModuleFactory.build({ id: "b", creditedAgainst: 2 }),
            creditModuleFactory.build({ id: "c", creditedAgainst: 2 }),
            creditModuleFactory.build({ id: "d", creditedAgainst: 3 }),
            creditModuleFactory.build({ id: "e", creditedAgainst: 3 }),
            creditModuleFactory.build({ id: "f", creditedAgainst: 3 }),
        ];

        const { store } = getInitializedStore({
            focusSelections,
            modules,
        });

        const output = store.creditedModulesByFocusSelection;

        const expectedOutput: Array<FocusCredit> = [
            { focusSelectionId: 1, moduleIds: ["a"] },
            { focusSelectionId: 2, moduleIds: ["b", "c"] },
            { focusSelectionId: 3, moduleIds: ["d", "e", "f"] },
        ];

        expect(output).toStrictEqual(expectedOutput);
    });
});
