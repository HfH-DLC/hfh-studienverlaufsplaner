import { defineStore } from "pinia";
import { v4 } from "uuid";

import DataAdapter from "../DataAdapter";
import emitter from "../emitter";
import flashTypes from "../flashTypes";
import { getRule } from "../Models/Rules/Schedule/RuleFactory";
import { getTodo } from "../Models/Todos/Schedule/TodoFactory";
import {
    SAVE_STATUS_ERROR,
    SAVE_STATUS_SAVED,
    SAVE_STATUS_SAVING,
} from "../constants";
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

const TOUR_SELECTED_MODULE = {
    id: "WP2_04.2",
    name: "Heilpädagogik im Bereich Hören 2",
    prerequisites: [
        { id: "WP2_04.1", name: "Heilpädagogik im Bereich Hören 1" },
    ],
    infos: [],
    ects: 5,
};

let dataAdapter;

export const useScheduleStore = defineStore("schedule", {
    state: () => ({
        foci: [],
        focusSelections: [],
        initialized: false,
        locations: [],
        moduleInfos: {},
        requiredECTS: null,
        rawCategories: [],
        rawPlacements: [],
        rawPlacementErrors: {},
        readOnly: false,
        rules: [],
        saveStatus: SAVE_STATUS_SAVED,
        selectionStatus: {},
        startYear: null,
        todoEntries: [],
        todos: [],
        tour: null,
        tourActive: false,
        tourCompleted: false,
        tourSelectedModule: null,
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
        }) {
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
            this.todos = todos.reduce((array, rule) => {
                try {
                    array.push(getTodo(rule));
                } catch (error) {
                    console.error(error);
                }
                return array;
            }, []);
            this.rules = rules.reduce((array, rule) => {
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
                this.saveStatus = SAVE_STATUS_SAVING;
                const focusSelections = this.focusSelections.map(
                    (focusSelection) => {
                        return {
                            position: focusSelection.position,
                            focusId: focusSelection.focus.id,
                        };
                    }
                );
                await dataAdapter.saveSchedule(
                    this.rawPlacements,
                    focusSelections,
                    this.tourCompleted,
                    this.valid,
                    this.locations
                        .filter((location) => location.checked)
                        .map((location) => location.id)
                );
                this.saveStatus = SAVE_STATUS_SAVED;
                return true;
            } catch (error) {
                this.saveStatus = SAVE_STATUS_ERROR;
                emitter.emit("flash", {
                    type: flashTypes.ERROR,
                    message:
                        "Beim automatischen Speichern Ihres Plans ist ein Fehler aufgetreten.",
                    actionMessage: "Erneut versuchen",
                    actionEvent: "retry-save",
                });
                console.error(error);
                return false;
            }
        },
        selectModule(moduleId) {
            const module = this.moduleById(moduleId);
            const status = module.events.reduce((acc, cur) => {
                acc[cur.id] = {
                    valid: true,
                    dateAllowed: true,
                };
                return acc;
            }, {});
            this.rules.forEach((rule) => {
                rule.validateSelection(module, this, status);
            });
            this.selectionStatus = {
                moduleId,
                status,
            };
        },
        deselectModule() {
            this.selectionStatus = {
                moduleId: null,
                status: {},
            };
        },
        placeModule(event) {
            const existingPlacement = this.placements.find(
                (placement) =>
                    placement.moduleId == this.selectionStatus.moduleId
            );
            if (existingPlacement) {
                this.removePlacement(existingPlacement);
            }
            this.addPlacement({
                id: v4(),
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
        addPlacement(placement) {
            this.rawPlacements.push(placement);
        },
        removePlacement(placement) {
            this.rawPlacements = this.rawPlacements.filter(
                (p) => p.id !== placement.id
            );
        },
        removeModule(placement) {
            this.removePlacement(placement);
            this.deselectModule();
            this.validate();
            this.save();
        },
        selectFocus({ position, focusId }) {
            this.focusSelections = this.focusSelections.filter(
                (f) => f.position != position
            );
            const focus = this.foci.find((focus) => focus.id == focusId);
            if (focus) {
                this.focusSelections.push({ position, focus });
            }
            this.validate();
            this.save();
        },
        validate() {
            this.validateTodos();
            this.validateModules();
            this.validatePlacements();
        },
        validateTodos() {
            this.todoEntries = this.todos.reduce((acc, cur) => {
                acc.push(...cur.getEntries(this));
                return acc;
            }, []);
        },
        validateModules() {
            this.moduleInfos = {};
            this.modules.forEach((module) => {
                this.moduleInfos[module.id] = [];
                this.rules.forEach((rule) => {
                    rule.validateModule(
                        module,
                        this,
                        this.moduleInfos[module.id]
                    );
                });
            });
        },
        validatePlacements() {
            this.rawPlacementErrors = this.placements.reduce((acc, cur) => {
                acc[cur.id] = [];
                return acc;
            }, {});
            this.rules.forEach((rule) => {
                rule.validatePlacements(this, this.rawPlacementErrors);
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
        setShowTourSelectedModule(value) {
            this.tourSelectedModule = value ? TOUR_SELECTED_MODULE : null;
        },
        setLocationChecked({ index, checked }) {
            this.locations[index].checked = checked;
            this.save();
        },
    },
    getters: {
        categories() {
            return this.rawCategories.map((category) => {
                const categoryModules = category.modules.map((module) => {
                    const moduleInfos = this.moduleInfos[module.id];
                    const placement = this.rawPlacements.find(
                        (placement) => placement.moduleId == module.id
                    );
                    const misplaced = !!(
                        placement &&
                        this.rawPlacementErrors[placement.id] &&
                        this.rawPlacementErrors[placement.id].length > 0
                    );
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
        ects() {
            return this.placements
                .map((placements) => placements.module)
                .reduce(
                    (total, module) => (module ? total + module.ects : total),
                    0
                );
        },
        modules() {
            return this.categories.reduce((acc, cur) => {
                acc.push(...cur.modules);
                return acc;
            }, []);
        },
        moduleById() {
            return (id) => this.modules.find((module) => module.id == id);
        },
        modulesByDateGroupedByLocations() {
            return (year, semester, timeWindow, day, time) => {
                const result = {};
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
                        result[location] = matchingModules;
                    }
                });
                return result;
            };
        },
        selectedModule() {
            return this.moduleById(this.selectionStatus.moduleId);
        },
        placements() {
            return this.rawPlacements.map((placement) => {
                return {
                    ...placement,
                    module: this.moduleById(placement.moduleId),
                    errors: this.rawPlacementErrors[placement.id],
                };
            });
        },
        placementById() {
            return (id) =>
                this.placements.find((placements) => placements.id == id);
        },
        placementByDate() {
            return (year, semester, timeWindow, day, time) =>
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
        placementErrors() {
            const result = [];
            Object.entries(this.rawPlacementErrors).forEach(
                ([placementId, errors]) => {
                    const placement = this.placementById(placementId);
                    errors.forEach((error) => {
                        result.push({
                            placement,
                            text: error,
                        });
                    });
                }
            );
            return result;
        },
        years() {
            const events = this.modules.reduce((acc, cur) => {
                acc.push(...cur.events);
                return acc;
            }, []);
            const dates = [...events, ...this.placements];
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
        events() {
            return this.modules.reduce((acc, cur) => {
                acc.push(...cur.events);
                return acc;
            }, []);
        },
        selectableEvents() {
            if (!this.selectedModule) {
                return [];
            }
            return this.selectedModule.events
                .filter((event) => {
                    const status = this.selectionStatus.status[event.id];
                    return (
                        status.dateAllowed &&
                        this.checkedLocations.includes(event.location)
                    );
                })
                .map((event) => {
                    const status = this.selectionStatus.status[event.id];
                    return {
                        ...event,
                        valid: status.valid,
                    };
                });
        },
        selectableEventsByDate() {
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
        selectableLocations() {
            return this.locations.filter((location) =>
                new Set(this.events.map((event) => event.location)).has(
                    location.id
                )
            );
        },
        checkedLocations() {
            return this.locations
                .filter((location) => location.checked)
                .map((location) => location.id);
        },
        infos() {
            let infos = [];
            this.focusSelections.forEach((focusSelection) => {
                const modules = [
                    ...focusSelection.focus.requiredModules,
                    ...focusSelection.focus.optionalModules,
                ];
                const moduleIds = modules.map((module) => module.id);
                const notAvailableModuleIds = moduleIds.filter((id) => {
                    const module = this.moduleById(id);
                    return !module.events.find((event) => {
                        return this.checkedLocations.includes(event.location);
                    });
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
                    infos.push(
                        `Für den SSP "${
                            focusSelection.focus.name
                        }" ${moduleString} ${joinStrings(
                            notAvailableModuleIds.map((id) => {
                                return `<button data-action="focus-module" data-module=${id}>${id}</button>`;
                            }),
                            "und"
                        )} ${locationString} ${joinStrings(
                            this.checkedLocations.map(
                                (checkedLocation) =>
                                    this.locations.find(
                                        (location) =>
                                            checkedLocation == location.id
                                    ).name
                            ),
                            "und"
                        )} nicht verfügbar.`
                    );
                }
            });
            return infos;
        },
        valid() {
            return (
                this.todoEntries.every((todo) => todo.checked) &&
                this.placements.every(
                    (placement) => placement.errors.length == 0
                )
            );
        },
    },
});
