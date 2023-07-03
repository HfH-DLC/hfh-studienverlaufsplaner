import { defineStore } from "pinia";
import { toRefs } from "vue";
import DataAdapter from "../DataAdapter";
import Validator from "../Validator";
import { getNestedDates, isSameDate } from "../helpers";
import {
    Category,
    ChecklistEntryData,
    Message,
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
    SelectableEvent,
    Todo,
    TourData,
    DayTime,
    EventDateWithOptionalTimeWindow,
    PriorLearning,
} from "@/types";
import { useEmitter } from "@/composables/useEmitter";

let dataAdapter: DataAdapter;
let validator: Validator;
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

const initialState = {
    foci: [] as Array<Focus>,
    focusSelections: [] as Array<FocusSelection>,
    initialized: false,
    infos: [] as Array<Message>,
    locations: [] as Array<Location>,
    dayTimes: [] as Array<DayTime>,
    requiredECTS: null as number | null,
    rawCategories: [] as Array<Category>,
    moduleErrors: new Map<string, Array<Message>>(),
    rawPlacements: [] as Array<Placement>,
    placementErrors: new Map<number, Array<Message>>(),
    priorLearnings: [] as Array<PriorLearning>,
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
    tourCurrentStepIndex: 0,
    valid: false,
};

export const useScheduleStore = defineStore("schedule", {
    state: () => initialState,
    actions: {
        init(params: ScheduleInitParams) {
            dataAdapter = params.dataAdapter;
            validator = params.validator;
            this.$reset();
            this.readOnly = params.plan.readOnly;
            this.priorLearnings = params.plan.priorLearnings;
            this.requiredECTS = params.requiredECTS;
            this.rawCategories = params.categories;
            this.foci = params.foci;
            this.focusSelections = params.plan.focusSelections;
            this.locations = params.plan.locations;
            this.dayTimes = params.plan.dayTimes;
            this.rawPlacements = params.plan.placements;
            this.startYear = params.plan.startYear;
            this.tour = params.tour;
            this.tourCompleted = params.plan.scheduleTourCompleted;
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
                    this.valid
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
                this.selectionStatus = validator.getSelectionStatus(
                    module,
                    toRefs(this)
                );
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
                this.removePlacement(existingPlacement.id);
            }
            this.addPlacement({
                id: getLocalId(this.placements),
                moduleId: this.selectionStatus.moduleId,
                year: event.year,
                semester: event.semester,
                timeWindow: event.timeWindow,
                dayTime: event.dayTime,
                location: event.location,
            });
            this.deselectModule();
            this.validate();
            this.save();
        },
        addPlacement(placement: Placement) {
            this.rawPlacements.push(placement);
        },
        removePlacement(placementId: number) {
            this.rawPlacements = this.rawPlacements.filter(
                (p) => p.id !== placementId
            );
        },
        removeModule(placement: Placement) {
            this.removePlacement(placement.id);
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
            const validationResult = validator.validate(toRefs(this));
            this.todoEntries = validationResult.todoEntries;
            this.moduleErrors = validationResult.moduleErrors;
            this.placementErrors = validationResult.placementErrors;
            this.infos = validationResult.globalInfos;
            this.valid = validationResult.valid;
        },
        startTour() {
            this.tourActive = true;
        },
        completeTour() {
            this.tourActive = false;
            this.tourCompleted = true;
            this.save();
        },
    },
    getters: {
        categoryModules(): (category: Category) => Array<ScheduleModule> {
            return (category: Category): Array<ScheduleModule> => {
                return category.modules.map((module): ScheduleModule => {
                    const moduleErrors = this.moduleErrors.get(module.id) || [];
                    const placement = this.rawPlacements.find(
                        (placement) => placement.moduleId == module.id
                    );
                    let misplaced = false;
                    if (placement) {
                        const errors = this.placementErrors.get(placement.id);
                        if (errors) {
                            misplaced = errors.length > 0;
                        }
                    }
                    return {
                        ...module,
                        errors: moduleErrors,
                        selected:
                            this.selectionStatus &&
                            this.selectionStatus.moduleId == module.id,
                        placement: placement,
                        misplaced,
                    };
                });
            };
        },
        categoryETCS(): (category: Category) => number {
            return (category: Category) => {
                return (
                    this.categoryModules(category).reduce((acc, cur) => {
                        if (cur.placement) {
                            acc += cur.ects;
                        }
                        return acc;
                    }, 0) +
                    this.priorLearnings.reduce((acc, cur) => {
                        console.log(cur.countsAsCategoryId === category.id);
                        console.log(category.name);
                        if (cur.countsAsCategoryId === category.id) {
                            acc += cur.ects;
                        }
                        return acc;
                    }, 0)
                );
            };
        },
        categories(): Array<ScheduleCategory> {
            return this.rawCategories.map((category) => {
                const categoryModules: Array<ScheduleModule> =
                    this.categoryModules(category);
                const currentECTS = this.categoryETCS(category);
                return {
                    ...category,
                    modules: categoryModules,
                    currentECTS,
                };
            });
        },
        ects(): number {
            return (
                this.placements
                    .map((placements) => placements.module)
                    .reduce((acc, cur) => (cur ? acc + cur.ects : acc), 0) +
                this.priorLearnings.reduce((acc, cur) => acc + cur.ects, 0)
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
            date: EventDateWithOptionalTimeWindow
        ) => Map<string, Array<ScheduleModule>> {
            return (date: EventDateWithOptionalTimeWindow) => {
                const result = new Map();
                this.locationIds.forEach((locationId) => {
                    const matchingModules = this.modules.filter((module) => {
                        return module.events.some(
                            (event) =>
                                event.location.id == locationId &&
                                this.dayTimes.some(
                                    (dayTime) => event.dayTime.id === dayTime.id
                                ) &&
                                isSameDate(event, date)
                        );
                    });
                    if (matchingModules.length > 0) {
                        result.set(locationId, matchingModules);
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
            return (date: EventDateWithOptionalTimeWindow) =>
                this.placements.find((placement) =>
                    isSameDate(placement, date)
                );
        },
        placementErrorMessages(): Array<Message> {
            return Array.from(this.placementErrors.values()).reduce(
                (acc, cur) => {
                    acc.push(...cur);
                    return acc;
                },
                []
            );
        },
        nestedDates() {
            const dates: Array<EventDate> = [
                ...this.events,
                ...this.placements,
            ];
            return getNestedDates(dates);
        },
        locationIds(): Array<string> {
            return this.locations.map((location) => location.id);
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
                        this.locationIds.includes(cur.location.id)
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
        selectableEventsByDate() {
            return (date: EventDate): Array<SelectableEvent> =>
                this.selectableEvents.filter((event) =>
                    isSameDate(event, date)
                );
        },
        tourSelectedModule(): ScheduleModule | null {
            if (
                this.tour &&
                this.tourActive &&
                this.tour.steps.length > this.tourCurrentStepIndex
            ) {
                const defaultModule: ScheduleModule = {
                    id: "",
                    name: "",
                    errors: [],
                    misplaced: false,
                    placement: undefined,
                    selected: false,
                    events: [],
                    ects: 0,
                    prerequisites: [],
                };
                const module =
                    this.tour?.steps[this.tourCurrentStepIndex].selectedModule;

                if (module) {
                    return { ...defaultModule, ...module };
                }
            }
            return null;
        },
    },
});
