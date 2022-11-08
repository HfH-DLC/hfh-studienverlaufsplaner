import { isSameDate, semesterCount, semesterPosition } from "../../../helpers";
import BaseScheduleRule from "./BaseScheduleRule";
export default class ExcludeSemesterRule extends BaseScheduleRule {
    constructor(params) {
        super("ExcludeSemester");
        this.excludePositions = params.excludePositions;
        this.moduleId = params.moduleId;
    }

    validatePlacements(state, { placements }, errors) {
        placements
            .filter((placement) => placement.moduleId == this.moduleId)
            .forEach((placement) => {
                if (!this.isAllowedSemester(placement, state.startYear)) {
                    const text = this.excludePositions.reduce(
                        (acc, cur, i, array) => {
                            return (
                                acc +
                                (cur + 1) +
                                "." +
                                (i < array.length - 2
                                    ? ", "
                                    : i < array.length - 1
                                    ? " oder "
                                    : "")
                            );
                        },
                        ""
                    );
                    errors[placement.id].push(
                        `<button data-action="focus-module" data-module="${placement.module.id}">${placement.module.id} ${placement.module.name}</button> kann nicht im ${text} Semester belegt werden.`
                    );
                }
            });
    }

    validateModule(module, state, { placements }, errors) {
        if (module.id !== this.moduleId) {
            return;
        }
        if (
            !module.placement &&
            module.events.every(
                (event) =>
                    this.isAllowedSemester(event, state.startYear) ||
                    placements.find((placement) => isSameDate(placement, event))
            )
        ) {
            errors.push(
                "Alle Termine in den erlaubten Semestern für dieses Modul sind bereits besetzt."
            );
        }
    }

    validateSelection(module, state, getters, status) {
        if (module.id !== this.moduleId) {
            return;
        }
        module.events.forEach((event) => {
            status[event.id].dateAllowed = this.isAllowedSemester(
                event,
                state.startYear
            );
        });
    }

    isAllowedSemester(date, startYear) {
        const yearDiff = date.year - startYear;
        const position =
            yearDiff * semesterCount() + semesterPosition(date.semester);
        return !this.excludePositions.includes(position);
    }
}
