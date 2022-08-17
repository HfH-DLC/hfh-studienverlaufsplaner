import { isSameDate } from "../../../helpers"
import BasePlacementRule from "./BasePlacementRule";
export default class DateRule extends BasePlacementRule {

    constructor() {
        super("date")
    }

    validatePlacements(placements, errors) {
        placements.forEach((placement) => {
            if (!placement.module.events.find(event => isSameDate(placement, event))) {
                errors[placement.id].push(`<a href="#module-${placement.module.id}">${placement.module.id} ${placement.module.name}</a> ist am Datum ${placement.semester} ${placement.year}, ${placement.timeWindow}, ${placement.day} ${placement.time} nicht verfügbar.`);
            }
        })
    }

    validateModule(module, placements, errors) {
        if (!module.placement && module.events.every(event => placements.find(placement => isSameDate(placement, event)))) {
            errors.push("Alle Termine für dieses Modul sind bereits besetzt.");
        }
    }

    validateSelection(module, placements, status) {}
}