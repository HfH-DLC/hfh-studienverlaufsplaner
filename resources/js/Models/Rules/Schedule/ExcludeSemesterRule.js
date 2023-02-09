import { isSameDate, semesterCount, semesterPosition } from "../../../helpers";
export default class ExcludeSemesterRule {
    constructor(params) {
        this.excludePositions = params.excludePositions;
        this.moduleId = params.moduleId;
    }

    validatePlacements({ placements, startYear }, errors) {
        placements
            .filter((placement) => placement.moduleId == this.moduleId)
            .forEach((placement) => {
                if (!this.isAllowedSemester(placement, startYear)) {
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
                    errors[placement.id].push({
                        component: "ExcludeSemesterPlacementRuleLabel",
                        labelProps: {
                            excludePositions: this.excludePositions,
                            placement,
                        },
                    });
                }
            });
    }

    validateModule(module, { startYear, placements }, errors) {
        if (module.id !== this.moduleId) {
            return;
        }
        if (
            !module.placement &&
            module.events.every(
                (event) =>
                    this.isAllowedSemester(event, startYear) ||
                    placements.find((placement) => isSameDate(placement, event))
            )
        ) {
            errors.push({
                label: "Alle Termine in den erlaubten Semestern für dieses Modul sind bereits besetzt.",
            });
        }
    }

    validateSelection(module, { startYear }, status) {
        if (module.id !== this.moduleId) {
            return;
        }
        module.events.forEach((event) => {
            status[event.id].dateAllowed = this.isAllowedSemester(
                event,
                startYear
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
