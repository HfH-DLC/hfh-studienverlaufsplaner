import { isSameDate } from "../../../helpers";
import BaseScheduleRule from "./BaseScheduleRule";
export default class DateRule extends BaseScheduleRule {
    constructor() {
        super("Date");
    }

    validatePlacements(state, { placements }, errors) {
        placements.forEach((placement) => {
            if (
                !placement.module.events.find((event) =>
                    isSameDate(placement, event)
                )
            ) {
                errors[placement.id].push(
                    `<a href="#module-${placement.module.id}">${placement.module.id} ${placement.module.name}</a> ist am Datum ${placement.semester} ${placement.year}, ${placement.timeWindow}, ${placement.day} ${placement.time} nicht verfügbar.`
                );
            }
        });
    }

    validateModule(module, state, { placements }, errors) {
        if (
            !module.placement &&
            module.events.every((event) =>
                placements.find((placement) => isSameDate(placement, event))
            )
        ) {
            errors.push("Alle Termine für dieses Modul sind bereits besetzt.");
        }
    }
}
