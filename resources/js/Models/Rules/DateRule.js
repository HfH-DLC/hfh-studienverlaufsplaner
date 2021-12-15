import Rule from "./Rule"
export default class DateRule extends Rule {

    constructor() {
        super("date")
    }

    validateSlots(timeSlots, errors) {
        timeSlots.forEach((slot) => {
            if (slot.module) {
                if (!slot.module.timeSlots.find(timeSlot => timeSlot.id == slot.id)) {
                    errors[slot.id].push(`${slot.module.number} ${slot.module.name} ist am Datum ${slot.semester} ${slot.year}, ${slot.week}, ${slot.day} ${slot.time} nicht verfügbar.`);
                }
            }
        })
    }

    validateModule(module, timeSlots, errors) {
        if (!timeSlots.some(slot => module.timeSlots.find(timeSlot => timeSlot.id == slot.id && !slot.module))) {
            errors.push("Alle Termine für dieses Modul sind bereits besetzt.");
        }
    }

    validateSelection(module, timeSlots, selectable) {
        timeSlots.forEach(slot => {
            if (!module.timeSlots.find(timeSlot => timeSlot.id == slot.id)) {
                selectable[slot.id] = false
            }
        })
    }
}