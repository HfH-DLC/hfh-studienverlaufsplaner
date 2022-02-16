import Rule from "./Rule"
import { isSameDate } from "../../helpers"
export default class DateRule extends Rule {

    constructor() {
        super("date")
    }

    validatePlacements(placements, errors) {
        placements.forEach((placement) => {
            if (!placement.module.events.find(event => isSameDate(placement, event))) {
                errors[placement.id].push(`<a href="#module-${placement.module.id}">${placement.module.number} ${placement.module.name}</a> ist am Datum ${placement.semester} ${placement.year}, ${placement.week}, ${placement.day} ${placement.time} nicht verfügbar.`);
            }
        })
    }

    validateModule(module, placements, errors) {
        if (!module.placement && module.events.every(event => placements.find(placement => isSameDate(placement, event)))) {
            errors.push("Alle Termine für dieses Modul sind bereits besetzt.");
        }
    }

    validateSelection(module, placements, status) {}

    isSameDate(a, b) {
        return a.year === b.year &&
            a.semester === b.semester &&
            a.week === b.week &&
            a.day === b.day &&
            a.time === b.time
    }
}