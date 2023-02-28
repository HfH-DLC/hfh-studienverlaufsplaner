import { Ref } from "vue";
import { ErrorMessage, Rule, ScheduleModule, SchedulePlacement } from "@/types";
import { isSameDate } from "../../../helpers";
export default class DateRule implements Rule {
    validatePlacements(
        { placements }: { placements: Ref<Array<SchedulePlacement>> },
        errors: Map<number, Array<ErrorMessage>>
    ) {
        placements.value.forEach((placement: SchedulePlacement) => {
            if (
                placement.module &&
                !placement.module.events.find((event) =>
                    isSameDate(placement, event)
                )
            ) {
                let errorMessages = errors.get(placement.id);
                if (!errorMessages) {
                    errorMessages = [];
                    errors.set(placement.id, errorMessages);
                }
                errorMessages.push({
                    component: "DateRulePlacementLabel",
                    labelProps: {
                        placement,
                    },
                });
            }
        });
    }

    validateModule(
        module: ScheduleModule,
        { placements }: { placements: Ref<Array<SchedulePlacement>> },
        errors: Array<ErrorMessage>
    ): void {
        if (
            !module.placement &&
            module.events.every((event) =>
                placements.value.find((placement: SchedulePlacement) =>
                    isSameDate(placement, event)
                )
            )
        ) {
            errors.push({
                label: "Alle Termine für dieses Modul sind bereits besetzt.",
            });
        }
    }

    validateSelection() {}
}
