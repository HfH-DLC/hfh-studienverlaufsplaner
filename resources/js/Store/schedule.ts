import { defineStore } from "pinia";

import DataAdapter from "../DataAdapter";
import { getRule } from "../Models/Rules/Schedule/RuleFactory";
import { getTodo } from "../Models/Todos/Schedule/TodoFactory";
import {
    getCalendarYear,
    isSameDate,
    joinStrings,
    orderDay,
    orderSemester,
    orderTime,
    orderTimeWindow,
    pluralize,
} from "../helpers";
import {
    Category,
    ChecklistEntryData,
    ErrorMessage,
    Event,
    EventDate,
    FlashType,
    Focus,
    FocusSelection,
    Location,
    Placement,
    Rule,
    SaveStatus,
    ScheduleInitParams,
    ScheduleCategory,
    ScheduleModule,
    SchedulePlacement,
    Selection,
    SelectionEventInfo,
    SelectableEvent,
    Todo,
    TourData,
} from "@/types";
import { useEmitter } from "@/composables/useEmitter";
import { toRefs } from "vue";

const TOUR_SELECTED_MODULE: ScheduleModule = {
    id: "WP2_04.2",
    name: "Heilpädagogik im Bereich Hören 2",
    prerequisites: [
        {
            id: "WP2_04.1",
            name: "Heilpädagogik im Bereich Hören 1",
            ects: 5,
            events: [],
            prerequisites: [],
        },
    ],
    ects: 5,
    events: [],
    infos: [],
    misplaced: false,
    placement: undefined,
    selected: true,
};

let dataAdapter: DataAdapter;
const emitter = useEmitter();

function getLocalId(array: Array<{ id: number }>): number {
    const currentMaxId: number = array.reduce(
        (acc: number, cur: { id: number }) => {
            if (cur.id > acc) {
                acc = cur.id;
            }
            return acc;
        },
        0
    );
    return currentMaxId + 1;
}

export const useScheduleStore = defineStore("schedule", {
    state: () => ({
        foci: [] as Array<Focus>,
        focusSelections: [] as Array<FocusSelection>,
        initialized: false,
        locations: [] as Array<Location>,
        moduleInfos: new Map<string, Array<ErrorMessage>>(),
        requiredECTS: null as number | null,
        rawCategories: [] as Array<Category>,
        rawPlacements: [] as Array<Placement>,
        placementErrors: new Map<number, Array<ErrorMessage>>(),
        readOnly: false,
        rules: [] as Array<Rule>,
        saveStatus: SaveStatus.Saved,
        selectionStatus: {} as Selection,
        startYear: null as number | null,
        todoEntries: [] as Array<ChecklistEntryData>,
        todos: [] as Array<Todo>,
        tour: null as TourData | null,
        tourActive: false,
        tourCompleted: false,
        tourSelectedModule: null as ScheduleModule | null,
    }),
    actions: {
        init({
            planerSlug,
            plan,
            categories,
            rules,
            todos,
            foci,
            locations,
            requiredECTS,
            tour,
        }: ScheduleInitParams) {
            dataAdapter = new DataAdapter(planerSlug, plan.slug);
            this.$reset();
            this.readOnly = plan.readOnly;
            this.requiredECTS = requiredECTS;
            this.rawCategories = categories;
            this.foci = foci;
            this.focusSelections = plan.focusSelections;
            this.locations = locations.map((location) => {
                let checked = location.default;
                if (plan.locations.length > 0) {
                    checked = plan.locations.some(
                        (planLocation) => location.id == planLocation.id
                    );
                }
                return { ...location, checked };
            });
            this.rawPlacements = plan.placements;
            this.todos = todos.reduce((array: Array<Todo>, todoData) => {
                try {
                    array.push(getTodo(todoData));
                } catch (error) {
                    console.error(error);
                }
                return array;
            }, []);
            this.rules = rules.reduce((array: Array<Rule>, rule) => {
                try {
                    array.push(getRule(rule));
                } catch (error) {
                    console.error(error);
                }
                return array;
            }, []);
            this.startYear = plan.startYear;
            this.tour = tour;
            this.tourCompleted = plan.scheduleTourCompleted;
            this.validate();
            this.initialized = true;
        },
        async save() {
            try {
                this.saveStatus = SaveStatus.Saving;
                await dataAdapter.saveSchedule(
                    this.rawPlacements,
                    this.focusSelections,
                    this.tourCompleted,
                    this.valid,
                    this.locations
                        .filter((location) => location.checked)
                        .map((location) => location.id)
                );
                this.saveStatus = SaveStatus.Saved;
                return true;
            } catch (error) {
                this.saveStatus = SaveStatus.Error;
                emitter.emit("flash", {
                    type: FlashType.Error,
                    message:
                        "Beim automatischen Speichern Ihres Plans ist ein Fehler aufgetreten.",
                    actionMessage: "Erneut versuchen",
                    actionEvent: "retry-save",
                });
                console.error(error);
                return false;
            }
        },
        selectModule(moduleId: string) {
            const module = this.moduleById(moduleId);
            if (module) {
                const selectionEventInfos: Map<number, SelectionEventInfo> =
                    module.events.reduce(
                        (acc: Map<number, SelectionEventInfo>, cur: Event) => {
                            acc.set(cur.id, {
                                valid: true,
                                dateAllowed: true,
                            });
                            return acc;
                        },
                        new Map()
                    );
                this.rules.forEach((rule) => {
                    rule.validateSelection(
                        module,
                        toRefs(this),
                        selectionEventInfos
                    );
                });
                this.selectionStatus = {
                    moduleId,
                    selectionEventInfos,
                };
            } else {
                console.log(
                    `selectModule: Module with id ${moduleId} not found.`
                );
            }
        },
        deselectModule() {
            this.selectionStatus = {
                moduleId: null,
                selectionEventInfos: new Map(),
            };
        },
        placeModule(event: Event) {
            if (!this.selectionStatus.moduleId) {
                return;
            }
            const existingPlacement = this.placements.find(
                (placement) =>
                    placement.moduleId == this.selectionStatus.moduleId
            );
            if (existingPlacement) {
                this.removePlacement(existingPlacement);
            }
            this.addPlacement({
                id: getLocalId(this.placements),
                moduleId: this.selectionStatus.moduleId,
                year: event.year,
                semester: event.semester,
                timeWindow: event.timeWindow,
                day: event.day,
                time: event.time,
                location: event.location,
            });
            this.deselectModule();
            this.validate();
            this.save();
        },
        addPlacement(placement: Placement) {
            this.rawPlacements.push(placement);
        },
        removePlacement(placement: Placement) {
            this.rawPlacements = this.rawPlacements.filter(
                (p) => p.id !== placement.id
            );
        },
        removeModule(placement: Placement) {
            this.removePlacement(placement);
            this.deselectModule();
            this.validate();
            this.save();
        },
        selectFocus(position: number, focusId: string) {
            this.focusSelections = this.focusSelections.filter(
                (f) => f.position != position
            );
            const focus = this.foci.find((focus) => focus.id == focusId);
            if (focus) {
                const id = getLocalId(this.focusSelections);
                this.focusSelections.push({ id, position, focus });
            }
            this.validate();
            this.save();
        },
        validate(): void {
            this.validateTodos();
            this.validateModules();
            this.validatePlacements();
        },
        validateTodos(): void {
            this.todoEntries = this.todos.reduce(
                (acc: Array<ChecklistEntryData>, cur) => {
                    acc.push(...cur.getEntries(toRefs(this)));
                    return acc;
                },
                []
            );
        },
        validateModules(): void {
            this.moduleInfos = new Map();
            this.modules.forEach((module) => {
                this.moduleInfos.set(module.id, []);
                this.rules.forEach((rule) => {
                    let errorMessages = this.moduleInfos.get(module.id);
                    if (!errorMessages) {
                        errorMessages = [];
                        this.moduleInfos.set(module.id, errorMessages);
                    }
                    rule.validateModule(module, toRefs(this), errorMessages);
                });
            });
        },
        validatePlacements(): void {
            this.placementErrors = new Map();
            this.rules.forEach((rule) => {
                rule.validatePlacements(toRefs(this), this.placementErrors);
            });
        },
        startTour() {
            this.tourActive = true;
            this.save();
        },
        completeTour() {
            this.tourActive = false;
            this.tourCompleted = true;
            this.save();
        },
        setShowTourSelectedModule(value: boolean) {
            this.tourSelectedModule = value ? TOUR_SELECTED_MODULE : null;
        },
        setLocationChecked(index: number, checked: boolean) {
            this.locations[index].checked = checked;
            this.save();
        },
    },
    getters: {
        categories(): Array<ScheduleCategory> {
            return this.rawCategories.map((category) => {
                const categoryModules: Array<ScheduleModule> =
                    category.modules.map((module): ScheduleModule => {
                        const moduleInfos =
                            this.moduleInfos.get(module.id) || [];
                        const placement = this.rawPlacements.find(
                            (placement) => placement.moduleId == module.id
                        );
                        let misplaced = false;
                        if (placement) {
                            const errors = this.placementErrors.get(
                                placement.id
                            );
                            if (errors) {
                                misplaced = errors.length > 0;
                            }
                        }
                        return {
                            ...module,
                            infos: moduleInfos,
                            selected:
                                this.selectionStatus &&
                                this.selectionStatus.moduleId == module.id,
                            placement: placement,
                            misplaced,
                        };
                    });
                const currentECTS = categoryModules.reduce((acc, cur) => {
                    if (cur.placement) {
                        acc += cur.ects;
                    }
                    return acc;
                }, 0);

                return {
                    ...category,
                    placedNumber: categoryModules.filter(
                        (module) => module.placement
                    ).length,
                    modules: categoryModules,
                    currentECTS,
                };
            });
        },
        ects(): number {
            return this.placements
                .map((placements) => placements.module)
                .reduce(
                    (total, module) => (module ? total + module.ects : total),
                    0
                );
        },
        modules(): Array<ScheduleModule> {
            return this.categories.reduce(
                (acc: Array<ScheduleModule>, cur: ScheduleCategory) => {
                    acc.push(...cur.modules);
                    return acc;
                },
                []
            );
        },
        moduleById(): (id: string | null) => ScheduleModule {
            return (id: string | null) =>
                this.modules.find((module: ScheduleModule) => module.id == id)!;
        },
        modulesByDateGroupedByLocations(): (
            year: number,
            semester: string,
            timeWindow: string,
            day: string,
            time: string
        ) => Map<string, Array<ScheduleModule>> {
            return (
                year: number,
                semester: string,
                timeWindow: string,
                day: string,
                time: string
            ) => {
                const result = new Map();
                this.checkedLocations.forEach((location) => {
                    const matchingModules = this.modules.filter((module) => {
                        return module.events.some(
                            (event) =>
                                isSameDate(event, {
                                    year,
                                    semester,
                                    timeWindow,
                                    day,
                                    time,
                                }) && event.location == location
                        );
                    });
                    if (matchingModules.length > 0) {
                        result.set(location, matchingModules);
                    }
                });
                return result;
            };
        },
        selectedModule(): ScheduleModule | undefined {
            return this.moduleById(this.selectionStatus.moduleId);
        },
        placements(): Array<SchedulePlacement> {
            return this.rawPlacements.map((placement) => {
                return {
                    ...placement,
                    module: this.moduleById(placement.moduleId),
                    errors: this.placementErrors.get(placement.id) || [],
                };
            });
        },
        placementById() {
            return (id: number) =>
                this.placements.find((placements) => placements.id == id);
        },
        placementByDate() {
            return (
                year: number,
                semester: string,
                timeWindow: string,
                day: string,
                time: string
            ) =>
                this.placements.find((placement) => {
                    return (
                        placement.year == year &&
                        placement.semester == semester &&
                        placement.timeWindow == timeWindow &&
                        placement.day == day &&
                        placement.time == time
                    );
                });
        },
        placementErrorMessages(): Array<ErrorMessage> {
            const result: Array<ErrorMessage> = [];
            this.placementErrors.forEach((errors, placementId) => {
                const placement = this.placementById(placementId);
                if (placement) {
                    errors.forEach((error) => {
                        result.push(error);
                    });
                }
            });
            return result;
        },
        years() {
            const dates: Array<EventDate> = [
                ...this.events,
                ...this.placements,
            ];
            const years = [...new Set(dates.map((date) => date.year))].sort();
            return years
                .sort((a, b) => a - b)
                .map((year) => {
                    const yearDates = dates.filter(
                        (date) => date.year === year
                    );
                    const semesters = [
                        ...new Set(yearDates.map((date) => date.semester)),
                    ]
                        .sort(orderSemester)
                        .map((semester) => {
                            const semesterDates = yearDates.filter(
                                (date) => date.semester === semester
                            );
                            return {
                                value: semester,
                                calendarYear: getCalendarYear(semester, year),
                                timeWindows: [
                                    ...new Set(
                                        semesterDates.map(
                                            (date) => date.timeWindow
                                        )
                                    ),
                                ].sort(orderTimeWindow),
                                days: [
                                    ...new Set(
                                        semesterDates.map((date) => date.day)
                                    ),
                                ].sort(orderDay),
                                times: [
                                    ...new Set(
                                        semesterDates.map((date) => date.time)
                                    ),
                                ].sort(orderTime),
                            };
                        });

                    return {
                        value: year,
                        semesters,
                    };
                });
        },
        events(): Array<Event> {
            return this.modules.reduce(
                (acc: Array<Event>, cur: ScheduleModule) => {
                    acc.push(...cur.events);
                    return acc;
                },
                []
            );
        },
        selectableEvents(): Array<SelectableEvent> {
            if (!this.selectedModule) {
                return [];
            }
            return this.selectedModule.events.reduce(
                (acc: Array<SelectableEvent>, cur: Event) => {
                    const selectionEventInfo =
                        this.selectionStatus.selectionEventInfos.get(cur.id);
                    if (
                        selectionEventInfo &&
                        selectionEventInfo.dateAllowed &&
                        this.checkedLocations.includes(cur.location)
                    ) {
                        acc.push({
                            ...cur,
                            ...selectionEventInfo,
                        });
                    }
                    return acc;
                },
                []
            );
        },
        selectableEventsByDate(): (
            year: number,
            semester: string,
            timeWindow: string,
            day: string,
            time: string
        ) => Array<SelectableEvent> {
            return (year, semester, timeWindow, day, time) => {
                const result = this.selectableEvents.filter((event) => {
                    return (
                        event.year == year &&
                        event.semester == semester &&
                        event.timeWindow == timeWindow &&
                        event.day == day &&
                        event.time == time
                    );
                });
                return result;
            };
        },
        selectableLocations(): Array<Location> {
            return this.locations.filter((location) =>
                new Set(this.events.map((event) => event.location)).has(
                    location.id
                )
            );
        },
        checkedLocations(): Array<string> {
            return this.locations
                .filter((location) => location.checked)
                .map((location) => location.id);
        },
        infos(): Array<string> {
            let infos: Array<string> = [];
            this.focusSelections.forEach((focusSelection) => {
                const modules = [
                    ...focusSelection.focus.requiredModules,
                    ...focusSelection.focus.optionalModules,
                ];
                const moduleIds = modules.map((module) => module.id);
                const notAvailableModuleIds = moduleIds.filter((id) => {
                    const module = this.moduleById(id);
                    if (module) {
                        return !module.events.find((event) => {
                            return this.checkedLocations.includes(
                                event.location
                            );
                        });
                    }
                    return false;
                });
                if (notAvailableModuleIds.length > 0) {
                    const moduleString = pluralize(
                        notAvailableModuleIds.length,
                        "ist das Modul",
                        "sind die Module"
                    );
                    const locationString = pluralize(
                        this.checkedLocations.length,
                        "am Standort",
                        "an den Standorten"
                    );

                    const locationNames: Array<string> =
                        this.checkedLocations.reduce(
                            (acc: Array<string>, cur: string) => {
                                const location = this.locations.find(
                                    (location) => location.id == cur
                                );
                                if (location) {
                                    acc.push(location.name);
                                }
                                return acc;
                            },
                            []
                        );

                    infos.push(
                        `Für den SSP "${
                            focusSelection.focus.name
                        }" ${moduleString} ${joinStrings(
                            notAvailableModuleIds.map((id) => {
                                return `<button data-action="focus-module" data-module=${id}>${id}</button>`;
                            }),
                            "und"
                        )} ${locationString} ${joinStrings(
                            locationNames,
                            "und"
                        )} nicht verfügbar.`
                    );
                }
            });
            return infos;
        },
        valid(): boolean {
            return (
                this.todoEntries.every((todo) => todo.checked) &&
                this.placements.every(
                    (placement) => placement.errors.length == 0
                )
            );
        },
    },
});
