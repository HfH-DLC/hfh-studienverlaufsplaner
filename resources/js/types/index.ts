import DataAdapter from "@/DataAdapter";
import Validator from "@/Validator";
import { EmitterEvents } from "@/composables/useEmitter";
import { Placement as PopperPlacement } from "@popperjs/core";
import { Component } from "vue";

export interface Category {
    id: number;
    name: string;
    modules: Array<Module>;
    minECTS: number;
    maxECTS: number;
    required: boolean;
}

export type ChecklistEntryData = {
    checked: boolean;
    progressLabel: string;
    label?: string;
    component?: Component;
    labelProps?: Record<any, any>;
};
export interface CreditInitParams {
    dataAdapter: DataAdapter;
    validator: Validator;
    planerSlug: string;
    plan: Plan;
    modules: Array<CreditModule>;
    focusSelections: Array<FocusSelection>;
    tour: TourData;
}

export interface CreditModule extends Module {
    creditedAgainst: number;
    requiredCredit: boolean;
}

export interface DayTime {
    id: string;
    day: string;
    time: string;
    default: boolean;
    sortIndex: number;
}

export type ErrorMessage = {
    label?: string;
    component?: Component;
    labelProps?: Record<any, any>;
};

export interface EventDate {
    year: number;
    semester: Semester;
    dayTime: DayTime;
    timeWindow: string;
}

export interface EventDateWithOptionalTimeWindow
    extends Omit<EventDate, "timeWindow"> {
    timeWindow?: string;
}

export interface Event extends EventDate {
    id: number;
    location: Location;
}

export enum FlashType {
    Error,
    Success,
}

export interface FlashData {
    type: FlashType;
    message: string;
    actionMessage?: string;
    actionEvent?: keyof EmitterEvents;
}

export interface Focus {
    id: string;
    name: string;
    requiredNumberOfOptionalModules: number;
    requiredModules: Array<Module>;
    optionalModules: Array<Module>;
}

export interface FocusSelection {
    id: number;
    position: number;
    focus: Focus;
}

export interface Link {
    href: string;
    label: string;
}

export interface Location {
    id: string;
    name: string;
    default: boolean;
}

export interface Module {
    id: string;
    name: string;
    events: Array<Event>;
    ects: number;
    prerequisites: Array<Module>;
}

export interface FocusCredit {
    focusSelectionId: number;
    moduleIds: Array<string>;
}

export interface Plan {
    creditTourCompleted: boolean;
    dayTimes: Array<DayTime>;
    focusSelections: Array<FocusSelection>;
    locations: Array<Location>;
    placements: Array<Placement>;
    scheduleTourCompleted: boolean;
    slug: string;
    startYear: number;
    readOnly: boolean;
}

export interface Placement extends Event {
    moduleId: string;
}

export interface PlacementParams
    extends Omit<Placement, "id" | "location" | "dayTime"> {
    locationId: string;
    dayTimeId: string;
}

export interface RuleData {
    name: string;
    params: Record<string, any>;
}

export interface Rule {
    validatePlacements(
        data: Record<string, any>,
        errors: Map<number, ErrorMessage[]>
    ): void;
    validateModule(
        module: ScheduleModule,
        data: Record<string, any>,
        errors: Array<ErrorMessage>
    ): void;
    validateSelection(
        module: ScheduleModule,
        data: Record<string, any>,
        selectionEventInfos: Map<number, SelectionEventInfo>
    ): void;
}

export enum SaveStatus {
    Saving,
    Saved,
    Error,
}

export interface ScheduleCategory extends Category {
    currentECTS: number;
    modules: Array<ScheduleModule>;
}

export interface ScheduleInitParams {
    dataAdapter: DataAdapter;
    validator: Validator;
    plan: Plan;
    categories: Array<Category>;
    foci: Array<Focus>;
    requiredECTS: number;
    tour: TourData;
}

export interface ScheduleModule extends Module {
    infos: Array<ErrorMessage>;
    misplaced: boolean;
    placement: Placement | undefined;
    selected: boolean;
}

export interface SchedulePlacement extends Placement {
    module: ScheduleModule;
    errors: Array<ErrorMessage>;
}

export interface Selection {
    moduleId: string | null;
    selectionEventInfos: Map<number, SelectionEventInfo>;
}

export interface SelectionEventInfo {
    valid: boolean;
    dateAllowed: boolean;
}

export interface SelectableEvent extends Event {
    valid: boolean;
}

export type Semester = "HS" | "FS";

export interface TodoData {
    name: string;
    params: Record<any, any>;
}

export interface Todo {
    getEntries(data: Record<string, any>): Array<ChecklistEntryData>;
}

export interface TourData {
    steps: Array<TourStep>;
}

export interface TourStep {
    title: string;
    content: string;
    ref?: string;
    placement?: PopperPlacement;
    selectedModule: ScheduleModule;
}
