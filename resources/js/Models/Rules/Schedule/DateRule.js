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
                errors[placement.id].push({
                    component: "DateRulePlacementLabel",
                    labelProps: {
                        placement,
                    },
                });
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
            errors.push({
                label: "Alle Termine für dieses Modul sind bereits besetzt.",
            });
        }
    }
}
