import { expect, test, describe, beforeEach, vi, Mocked } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useScheduleStore } from "@/Store/schedule";
import {
    Placement,
    SaveStatus,
    ScheduleInitParams,
    ScheduleModule,
} from "@/types";
import DataAdapter from "@/DataAdapter";
import Validator from "@/Validator";
import { placementFactory } from "../factories/PlacementFactory";
import { dayTimeFactory } from "../factories/DayTimeFactory";
import { locationFactory } from "../factories/LocationFactory";
import { priorLearnignFactory } from "../factories/PriorLearningFactory";
import { eventFactory } from "../factories/EventFactory";
import { scheduleModuleFactory } from "../factories/ScheduleModuleFactory";
vi.mock("@/DataAdapter");

function getInitializedStore(
    params: Partial<ScheduleInitParams> | null = null
) {
    const store = useScheduleStore();

    const defaultParams: ScheduleInitParams = {
        dataAdapter: new DataAdapter("test-planer", "test-plan"),
        validator: new Validator([], []),
        plan: {
            creditTourCompleted: false,
            dayTimes: [],
            focusSelections: [],
            locations: [],
            placements: [],
            priorLearnings: [],
            scheduleTourCompleted: false,
            slug: "test-plan",
            startYear: 0,
            readOnly: false,
        },
        categories: [],
        foci: [],
        requiredECTS: 0,
        tour: {
            steps: [],
        },
    };
    const mergedParams: ScheduleInitParams = { ...defaultParams, ...params };
    store.init(mergedParams);
    const dataAdapter = mergedParams.dataAdapter;
    const validator = mergedParams.validator;
    return { store, dataAdapter, validator };
}

describe("Schedule Store", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    test("init", () => {
        const dataAdapter = new DataAdapter("test-planer", "test-plan");
        const validator = new Validator([], []);
        vi.spyOn(validator, "validate");
        const store = useScheduleStore();
        const params: ScheduleInitParams = {
            dataAdapter,
            validator,
            plan: {
                creditTourCompleted: false,
                dayTimes: dayTimeFactory.buildList(5),
                focusSelections: [],
                locations: locationFactory.buildList(5),
                placements: placementFactory.buildList(5),
                priorLearnings: priorLearnignFactory.buildList(5),
                scheduleTourCompleted: false,
                slug: "",
                startYear: 1990,
                readOnly: false,
            },
            categories: [],
            foci: [],
            requiredECTS: 0,
            tour: {
                steps: [],
            },
        };
        store.init(params);
        expect(store.readOnly).toBe(params.plan.readOnly);
        expect(store.requiredECTS).toBe(params.requiredECTS);
        expect(store.rawCategories).toStrictEqual(params.categories);
        expect(store.foci).toStrictEqual(params.foci);
        expect(store.focusSelections).toStrictEqual(
            params.plan.focusSelections
        );
        expect(store.locations).toStrictEqual(params.plan.locations);
        expect(store.dayTimes).toStrictEqual(params.plan.dayTimes);
        expect(store.rawPlacements).toStrictEqual(params.plan.placements);
        expect(store.priorLearnings).toStrictEqual(params.plan.priorLearnings);
        expect(store.startYear).toBe(params.plan.startYear);
        expect(store.tour).toStrictEqual(params.tour);
        expect(store.tourCompleted).toBe(params.plan.creditTourCompleted);
        expect(store.initialized).toBe(true);
        expect(validator.validate).toHaveBeenCalledOnce();
    });

    test("save", async () => {
        const dataAdapter = new DataAdapter("test-planer", "test-plan");
        const { store } = getInitializedStore();
        const result = await store.save();
        expect(result).toBe(true);
        expect(dataAdapter.saveSchedule).toHaveBeenCalledOnce();
        expect(store.saveStatus).toBe(SaveStatus.Saved);
    });

    test("save error", async () => {
        const { store, dataAdapter } = getInitializedStore();
        (dataAdapter as Mocked<DataAdapter>).saveSchedule.mockImplementation(
            () => {
                throw new Error("TestError");
            }
        );
        const consoleErrorMock = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        const result = await store.save();
        consoleErrorMock.mockRestore();
        (dataAdapter as Mocked<DataAdapter>).saveSchedule.mockReset();
        expect(result).toBe(false);
        expect(store.saveStatus).toBe(SaveStatus.Error);
    });

    test("deselectModule", () => {
        const { store } = getInitializedStore();
        store.selectionStatus.moduleId = "P1_01";
        store.selectionStatus.selectionEventInfos = new Map();
        store.selectionStatus.selectionEventInfos.set(0, {
            valid: true,
            dateAllowed: true,
        });
        store.selectionStatus.selectionEventInfos.set(1, {
            valid: false,
            dateAllowed: false,
        });
        expect(store.selectionStatus.moduleId).toBe("P1_01");
        expect(store.selectionStatus.selectionEventInfos.size).toBe(2);

        store.deselectModule();

        expect(store.selectionStatus.moduleId).toBe(null);
        expect(store.selectionStatus.selectionEventInfos.size).toBe(0);
    });

    test("addPlacement", () => {
        const { store } = getInitializedStore();
        const placements = placementFactory.buildList(5);
        expect(store.rawPlacements.length).toBe(0);

        placements.forEach((placement) => store.addPlacement(placement));

        expect(store.rawPlacements.length).toBe(placements.length);
        placements.forEach((placement, index) => {
            expect(store.rawPlacements[index]).toStrictEqual(placement);
        });
    });

    test("removePlacement", () => {
        const { store } = getInitializedStore();
        const placement1: Placement = {
            id: 0,
            moduleId: "P1_01",
            year: 2020,
            semester: "FS",
            dayTime: {
                id: "b",
                day: "Montag",
                time: "Nachmittag",
                default: true,
                sortIndex: 0,
            },
            timeWindow: "Pflicht- und Wahlpflichtmodule",
            location: {
                id: "ZH",
                name: "Zürich",
                default: true,
            },
        };
        const placement2: Placement = {
            id: 1,
            moduleId: "P1_02",
            year: 2021,
            semester: "HS",
            dayTime: {
                id: "c",
                day: "Dienstag",
                time: "Morgen",
                default: true,
                sortIndex: 0,
            },
            timeWindow: "Pflicht- und Wahlpflichtmodule",
            location: {
                id: "GR",
                name: "Chur",
                default: true,
            },
        };
        store.rawPlacements = [placement1, placement2];

        store.removePlacement(placement1.id);

        expect(store.rawPlacements.length).toBe(1);
        expect(store.rawPlacements[0].id).toBe(placement2.id);

        store.removePlacement(placement2.id);

        expect(store.rawPlacements.length).toBe(0);
    });
    test("selectFocus", () => {
        const foci = [
            {
                id: "my-focus-id",
                name: "MyFocus",
                requiredNumberOfOptionalModules: 0,
                requiredModules: [],
                optionalModules: [],
            },
            {
                id: "my-focus-id-2",
                name: "MyFocus2",
                requiredNumberOfOptionalModules: 0,
                requiredModules: [],
                optionalModules: [],
            },
        ];
        const { store, validator, dataAdapter } = getInitializedStore({
            foci,
        });
        vi.spyOn(validator, "validate");

        store.selectFocus(0, "my-focus-id");

        expect(store.focusSelections.length).toBe(1);
        expect(store.focusSelections[0].position).toBe(0);
        expect(store.focusSelections[0].focus).toStrictEqual(foci[0]);
        expect(dataAdapter.saveSchedule).toHaveBeenCalledOnce();
        expect(validator.validate).toHaveBeenCalledOnce();

        store.selectFocus(0, "my-focus-id-2");

        expect(store.focusSelections.length).toBe(1);
        expect(store.focusSelections[0].position).toBe(0);
        expect(store.focusSelections[0].focus).toStrictEqual(foci[1]);

        store.selectFocus(1, "my-focus-id");

        expect(store.focusSelections.length).toBe(2);
        expect(store.focusSelections[1].position).toBe(1);
        expect(store.focusSelections[1].focus).toStrictEqual(foci[0]);
    });
    test("startTour", () => {
        const { store } = getInitializedStore();
        store.startTour();
        expect(store.tourActive).toBe(true);
    });
    test("completeTour", () => {
        const { store, dataAdapter } = getInitializedStore();
        store.startTour();
        expect(store.tourActive).toBe(true);
        expect(store.tourCompleted).toBe(false);

        store.completeTour();

        expect(store.tourActive).toBe(false);
        expect(store.tourCompleted).toBe(true);
        expect(dataAdapter.saveSchedule).toHaveBeenCalledWith(
            [],
            [],
            true,
            true
        );
    });
    test("validate", () => {
        const { store, validator } = getInitializedStore();
        vi.spyOn(validator, "validate");
        store.validate();
        expect(validator.validate).toHaveBeenCalledOnce();
    });

    /**
     ** getters
     **/
    test("getter tourSelectedModule", () => {
        it("returns null if tour does not exist", () => {
            const { store } = getInitializedStore({
                tour: undefined,
            });

            expect(store.tourSelectedModule).toBeNull;
        });

        it("returns null if tour is not active", () => {
            const { store } = getInitializedStore({
                tour: {
                    steps: [
                        {
                            title: "Step 1",
                            content: "Step 1 content",
                        },
                    ],
                },
            });

            expect(store.tourSelectedModule).toBeNull;
        });

        it("returns null if current step index > tour.steps.length", () => {
            const { store } = getInitializedStore({
                tour: {
                    steps: [
                        {
                            title: "Step 1",
                            content: "Step 1 content",
                        },
                    ],
                },
            });
            store.tourActive = true;
            store.tourCurrentStepIndex = 2;

            expect(store.tourSelectedModule).toBeNull;
        });

        it("returns the default module if no module is set on the tour step", () => {
            const defaultModule: ScheduleModule = {
                id: "",
                name: "",
                infos: [],
                misplaced: false,
                placement: undefined,
                selected: false,
                events: [],
                ects: 0,
                prerequisites: [],
            };

            const { store } = getInitializedStore({
                tour: {
                    steps: [
                        {
                            title: "Step 1",
                            content: "Step 1 content",
                        },
                    ],
                },
            });
            store.tourActive = true;

            expect(store.tourSelectedModule).toStrictEqual(defaultModule);
        });

        it("returns the specified module if a module is set on the tour step", () => {
            const selectedModule: ScheduleModule = {
                id: "selected_module",
                name: "My selected module",
                infos: [
                    {
                        label: "SomeErrorMessage",
                    },
                ],
                misplaced: true,
                placement: placementFactory.build(),
                selected: true,
                events: [eventFactory.build()],
                ects: 9,
                prerequisites: [scheduleModuleFactory.build()],
            };

            const { store } = getInitializedStore({
                tour: {
                    steps: [
                        {
                            title: "Step 1",
                            content: "Step 1 content",
                            selectedModule,
                        },
                    ],
                },
            });
            store.tourActive = true;

            expect(store.tourSelectedModule).toStrictEqual(selectedModule);
        });
    });
});
