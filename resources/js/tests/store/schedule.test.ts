import { expect, test, describe, beforeEach, vi, Mocked } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useScheduleStore } from "@/Store/schedule";
import {
    Placement,
    SaveStatus,
    ScheduleInitParams,
    ScheduleModule,
    EventDate,
} from "@/types";
import DataAdapter from "@/DataAdapter";
import Validator from "@/Validator";
import { placementFactory } from "../factories/PlacementFactory";
import { dayTimeFactory } from "../factories/DayTimeFactory";
import { locationFactory } from "../factories/LocationFactory";
import { priorLearnignFactory } from "../factories/PriorLearningFactory";
import { eventFactory } from "../factories/EventFactory";
import { moduleFactory } from "../factories/ModuleFactory";
import { scheduleModuleFactory } from "../factories/ScheduleModuleFactory";
import { schedulePlacementFactory } from "../factories/SchedulePlacementFactory";
import { categoryFactory } from "../factories/CategoryFactory";
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

    describe("getter ects", () => {
        it("returns the sum of the ects of all placements and prior learnings", () => {
            const { store } = getInitializedStore();
            const modules = [
                moduleFactory.build({ ects: 3 }),
                moduleFactory.build({ ects: 4 }),
            ];
            const placements = [
                placementFactory.build({
                    moduleId: modules[0].id,
                }),
                placementFactory.build({
                    moduleId: modules[1].id,
                }),
            ];
            const priorLearnings = [
                priorLearnignFactory.build({
                    ects: 5,
                }),
                priorLearnignFactory.build({
                    ects: 10,
                }),
            ];

            store.rawCategories = [
                categoryFactory.build({
                    modules: modules,
                }),
            ];
            store.rawPlacements = placements;
            store.priorLearnings = priorLearnings;

            const sum =
                modules.reduce((acc, cur) => acc + cur.ects, 0) +
                priorLearnings.reduce((acc, cur) => acc + cur.ects, 0);

            expect(store.ects).toBe(sum);
        });
    });

    describe("getter events", () => {
        it("returns an empty array if there are no modules", () => {
            const { store } = getInitializedStore();
            store.rawCategories = [categoryFactory.build({ modules: [] })];
            expect(store.modules).toStrictEqual([]);

            expect(store.events).toStrictEqual([]);
        });

        it("returns an array of the events of all modules", () => {
            const { store } = getInitializedStore();
            const events = eventFactory.buildList(10);
            store.rawCategories = [
                categoryFactory.build({
                    modules: [
                        scheduleModuleFactory.build({
                            events: [events[0], events[1]],
                        }),
                        scheduleModuleFactory.build({
                            events: [events[2], events[3], events[4]],
                        }),
                    ],
                }),
                categoryFactory.build({
                    modules: [
                        scheduleModuleFactory.build({
                            events: [events[5], events[6], events[7]],
                        }),
                        scheduleModuleFactory.build({
                            events: [events[8], events[9]],
                        }),
                    ],
                }),
            ];

            expect(store.events.length).toBe(10);
            events.forEach((event) => {
                expect(store.events.some((e) => event.id === e.id)).toBe(true);
            });
        });
    });

    describe("getter locationIds", () => {
        it("returns array of the locations' ids", () => {
            const { store } = getInitializedStore();
            const locations = [
                locationFactory.build({ id: "A" }),
                locationFactory.build({ id: "B" }),
                locationFactory.build({ id: "C" }),
            ];
            store.locations = locations;

            expect(store.locationIds).toStrictEqual(["A", "B", "C"]);
        });

        it("returns an empty array if there are no locations", () => {
            const { store } = getInitializedStore();
            store.locations = [];

            expect(store.locationIds).toStrictEqual([]);
        });
    });

    describe("getter modules", () => {
        it("returns an empty array if there are no categories", () => {
            const { store } = getInitializedStore();
            store.rawCategories = [];

            expect(store.modules).toStrictEqual([]);
        });

        it("returns an array of the modules of all categories", () => {
            const { store } = getInitializedStore();
            const modules = moduleFactory.buildList(10);
            store.rawCategories = [
                categoryFactory.build({
                    modules: [modules[0], modules[1], modules[2]],
                }),
                categoryFactory.build({
                    modules: [
                        modules[3],
                        modules[4],
                        modules[5],
                        modules[6],
                        modules[7],
                    ],
                }),
                categoryFactory.build({
                    modules: [modules[8], modules[9]],
                }),
            ];

            expect(store.modules.length).toBe(10);
            modules.forEach((module) => {
                expect(store.modules.some((m) => module.id === m.id)).toBe(
                    true
                );
            });
        });
    });

    describe("getter moduleById", () => {
        it("returns the module with the matching id", () => {
            const { store } = getInitializedStore();
            const modules = scheduleModuleFactory.buildList(10);
            store.rawCategories = [
                categoryFactory.build({
                    modules: [modules[0], modules[1], modules[2]],
                }),
                categoryFactory.build({
                    modules: [
                        modules[3],
                        modules[4],
                        modules[5],
                        modules[6],
                        modules[7],
                    ],
                }),
                categoryFactory.build({
                    modules: [modules[8], modules[9]],
                }),
            ];

            modules.forEach((module) => {
                expect(store.moduleById(module.id)).toStrictEqual(module);
            });
        });

        it("returns undefined if there is no module with a matching id", () => {
            const { store } = getInitializedStore();
            const modules = scheduleModuleFactory.buildList(10);
            store.rawCategories = [
                categoryFactory.build({
                    modules: [modules[0], modules[1], modules[2]],
                }),
                categoryFactory.build({
                    modules: [
                        modules[3],
                        modules[4],
                        modules[5],
                        modules[6],
                        modules[7],
                    ],
                }),
                categoryFactory.build({
                    modules: [modules[8], modules[9]],
                }),
            ];

            expect(store.moduleById("some_unknown_id")).toBeUndefined();
        });
    });

    describe("getter placements", () => {
        it("returns an array of SchedulePlacements", () => {
            const { store } = getInitializedStore();
            const modules = moduleFactory.buildList(3);
            const rawPlacements = [
                placementFactory.build({
                    moduleId: modules[0].id,
                }),
                placementFactory.build({
                    moduleId: modules[1].id,
                }),
                placementFactory.build({
                    moduleId: modules[2].id,
                }),
            ];
            store.rawCategories = [
                categoryFactory.build({
                    modules: [modules[0], modules[1], modules[2]],
                }),
            ];
            store.rawPlacements = [
                rawPlacements[0],
                rawPlacements[1],
                rawPlacements[2],
            ];
            store.placementErrors.set(rawPlacements[0].id, [
                {
                    label: "Error Message 1",
                },
                {
                    label: "Error Message 2",
                },
            ]);
            store.placementErrors.set(rawPlacements[2].id, [
                {
                    label: "Error Message 4",
                },
                {
                    label: "Error Message 5",
                },
                {
                    label: "Error Message 6",
                },
            ]);

            expect(store.placements.length).toBe(3);
            rawPlacements.forEach((rawPlacement, index) => {
                const placement = store.placements[index];
                expect(placement.id).toBe(rawPlacement.id);
                expect(placement.year).toBe(rawPlacement.year);
                expect(placement.semester).toBe(rawPlacement.semester);
                expect(placement.dayTime).toStrictEqual(rawPlacement.dayTime);
                expect(placement.timeWindow).toBe(rawPlacement.timeWindow);
                expect(placement.moduleId).toBe(rawPlacement.moduleId);
                expect(placement.location).toStrictEqual(rawPlacement.location);
                expect(placement.module.id).toBe(rawPlacement.moduleId);
                expect(placement.errors).toStrictEqual(
                    store.placementErrors.get(placement.id) || []
                );
            });
        });

        it("returns an empty array if there are no placements", () => {
            const { store } = getInitializedStore();
            store.rawPlacements = [];

            expect(store.placements).toStrictEqual([]);
        });
    });

    describe("getter placementById", () => {
        it("returns the placement with the matching id", () => {
            const { store } = getInitializedStore();
            const modules = moduleFactory.buildList(3);
            const rawPlacements = [
                placementFactory.build({
                    id: 1,
                    moduleId: modules[0].id,
                }),
                placementFactory.build({
                    id: 2,
                    moduleId: modules[1].id,
                }),
                placementFactory.build({
                    id: 3,
                    moduleId: modules[2].id,
                }),
            ];
            store.rawCategories = [
                categoryFactory.build({
                    modules: [modules[0], modules[1], modules[2]],
                }),
            ];
            store.rawPlacements = [
                rawPlacements[0],
                rawPlacements[1],
                rawPlacements[2],
            ];
            store.placementErrors.set(rawPlacements[0].id, [
                {
                    label: "Error Message 1",
                },
                {
                    label: "Error Message 2",
                },
            ]);
            store.placementErrors.set(rawPlacements[2].id, [
                {
                    label: "Error Message 4",
                },
                {
                    label: "Error Message 5",
                },
                {
                    label: "Error Message 6",
                },
            ]);

            rawPlacements.forEach((rawPlacement) => {
                const placement = store.placementById(rawPlacement.id);
                expect(placement).not.toBeUndefined;
                expect(placement!.id).toBe(rawPlacement.id);
                expect(placement!.id).toBe(rawPlacement.id);
                expect(placement!.year).toBe(rawPlacement.year);
                expect(placement!.semester).toBe(rawPlacement.semester);
                expect(placement!.dayTime).toStrictEqual(rawPlacement.dayTime);
                expect(placement!.timeWindow).toBe(rawPlacement.timeWindow);
                expect(placement!.moduleId).toBe(rawPlacement.moduleId);
                expect(placement!.location).toStrictEqual(
                    rawPlacement.location
                );
                expect(placement!.module.id).toBe(rawPlacement.moduleId);
                expect(placement!.errors).toStrictEqual(
                    store.placementErrors.get(placement!.id) || []
                );
            });
        });

        it("returns undefined if there is no placement with a matching id", () => {
            const { store } = getInitializedStore();
            const module = moduleFactory.build();
            const rawPlacements = [
                placementFactory.build({
                    id: 1,
                    moduleId: module.id,
                }),
            ];
            store.rawCategories = [
                categoryFactory.build({
                    modules: [module],
                }),
            ];
            store.rawPlacements = [rawPlacements[0]];

            expect(store.placementById(42)).toBe(undefined);
        });
    });

    describe("getter placementByDate", () => {
        it("returns the placement with the matching date", () => {
            const { store } = getInitializedStore();
            const modules = moduleFactory.buildList(3);
            const rawPlacements = [
                placementFactory.build({
                    id: 1,
                    moduleId: modules[0].id,
                    year: 2001,
                    semester: "HS",
                    dayTime: {
                        id: "a",
                        day: "Montag",
                        time: "Morgen",
                    },
                    timeWindow: "A",
                }),
                placementFactory.build({
                    id: 2,
                    moduleId: modules[1].id,
                    dayTime: {
                        id: "f",
                        day: "Donnerstag",
                        time: "Nachmittag",
                    },
                    timeWindow: "B",
                }),
                placementFactory.build({
                    id: 3,
                    moduleId: modules[2].id,
                    dayTime: {
                        id: "d",
                        day: "Dienstag",
                        time: "Nachmittag",
                    },
                    timeWindow: "C",
                }),
            ];
            store.rawCategories = [
                categoryFactory.build({
                    modules: [modules[0], modules[1], modules[2]],
                }),
            ];
            store.rawPlacements = [
                rawPlacements[0],
                rawPlacements[1],
                rawPlacements[2],
            ];
            store.placementErrors.set(rawPlacements[0].id, [
                {
                    label: "Error Message 1",
                },
                {
                    label: "Error Message 2",
                },
            ]);
            store.placementErrors.set(rawPlacements[2].id, [
                {
                    label: "Error Message 4",
                },
                {
                    label: "Error Message 5",
                },
                {
                    label: "Error Message 6",
                },
            ]);

            rawPlacements.forEach((rawPlacement) => {
                const date: EventDate = {
                    year: rawPlacement.year,
                    semester: rawPlacement.semester,
                    dayTime: rawPlacement.dayTime,
                    timeWindow: rawPlacement.timeWindow,
                };
                const placement = store.placementByDate(date);
                expect(placement).not.toBeUndefined;
                expect(placement!.id).toBe(rawPlacement.id);
                expect(placement!.id).toBe(rawPlacement.id);
                expect(placement!.year).toBe(rawPlacement.year);
                expect(placement!.semester).toBe(rawPlacement.semester);
                expect(placement!.dayTime).toStrictEqual(rawPlacement.dayTime);
                expect(placement!.timeWindow).toBe(rawPlacement.timeWindow);
                expect(placement!.moduleId).toBe(rawPlacement.moduleId);
                expect(placement!.location).toStrictEqual(
                    rawPlacement.location
                );
                expect(placement!.module.id).toBe(rawPlacement.moduleId);
                expect(placement!.errors).toStrictEqual(
                    store.placementErrors.get(placement!.id) || []
                );
            });
        });

        it("returns undefined if there is no placement with a matching date", () => {
            const { store } = getInitializedStore();
            const module = moduleFactory.build();
            const rawPlacements = [
                placementFactory.build({
                    id: 1,
                    moduleId: module.id,
                    year: 2001,
                    semester: "HS",
                    dayTime: {
                        id: "a",
                        day: "Montag",
                        time: "Morgen",
                    },
                    timeWindow: "A",
                }),
            ];
            store.rawCategories = [
                categoryFactory.build({
                    modules: [module],
                }),
            ];
            store.rawPlacements = [rawPlacements[0]];

            const otherDate: EventDate = {
                year: 2004,
                semester: "FS",
                dayTime: dayTimeFactory.build({
                    id: "g",
                    day: "Freitag",
                    time: "Morgen",
                }),
                timeWindow: "D",
            };
            expect(store.placementByDate(otherDate)).toBe(undefined);
        });
    });

    describe("getter selectedModule", () => {
        it("returns the selected module", () => {
            const { store } = getInitializedStore();
            const selectedModule = moduleFactory.build();
            store.rawCategories = [
                categoryFactory.build({
                    modules: [selectedModule],
                }),
            ];
            store.selectionStatus.moduleId = selectedModule.id;

            expect(store.selectedModule?.id).toBe(selectedModule.id);
        });

        it("returns undefined if there is no selected module", () => {
            const { store } = getInitializedStore();
            const selectedModule = moduleFactory.build();
            store.rawCategories = [
                categoryFactory.build({
                    modules: [selectedModule],
                }),
            ];
            store.selectionStatus.moduleId = null;

            expect(store.selectedModule).toBeUndefined();
        });
    });

    describe("getter tourSelectedModule", () => {
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

        it("returns null if no module is set on the tour step", () => {
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
            store.tourCurrentStepIndex = 0;

            expect(store.tourSelectedModule).toStrictEqual(null);
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
            store.tourCurrentStepIndex = 0;

            expect(store.tourSelectedModule).toStrictEqual(selectedModule);
        });
    });

    describe("getter valid", () => {
        it("should return true if there are no todoEntries and placements", () => {
            const { store } = getInitializedStore();
            store.todoEntries = [];
            store.rawPlacements = [];

            expect(store.valid).toBe(true);
        });

        it("should return false if there are unchecked todoEntries", () => {
            const { store } = getInitializedStore();
            store.todoEntries = [
                {
                    progressLabel: "some label",
                    checked: false,
                },
                {
                    progressLabel: "some label",
                    checked: true,
                },
            ];
            store.rawPlacements = [];

            expect(store.valid).toBe(false);
        });

        it("should return false if there are placements with errors", () => {
            const { store } = getInitializedStore();
            store.todoEntries = [];
            const schedulePlacement = schedulePlacementFactory.build();
            store.rawPlacements = [schedulePlacement];
            store.placementErrors.set(schedulePlacement.id, [
                {
                    label: "Some error message",
                },
            ]);
            expect(store.valid).toBe(false);
        });
    });

    // describe("getter selectableEvents", () => {
    //     it("returns an empty array if there is no selected module", () => {
    //         const { store } = getInitializedStore();
    //         expect(store.selectedModule).toBeUndefined();

    //         expect(store.selectableEvents).toStrictEqual([]);
    //     });
    // });
});
