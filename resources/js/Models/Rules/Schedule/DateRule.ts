import { markRaw, Ref } from "vue";
import {
    Message,
    MessageType,
    Rule,
    ScheduleModule,
    SchedulePlacement,
} from "@/types";
import { isSameDate } from "../../../helpers";
import DateRulePlacementLabel from "@/Components/Rules/Schedule/DateRulePlacementLabel.vue";
export default class DateRule implements Rule {
    getPlacementErrors(
        { placements }: { placements: Ref<Array<SchedulePlacement>> },
        errors: Map<number, Array<Message>>
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
                    component: markRaw(DateRulePlacementLabel),
                    labelProps: {
                        placement,
                    },
                    type: MessageType.Error,
                });
            }
        });
    }

    getGlobalInfos() {}

    getModuleErrors(
        module: ScheduleModule,
        { placements }: { placements: Ref<Array<SchedulePlacement>> },
        errors: Array<Message>
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
                type: MessageType.Error,
            });
        }
    }

    getSelectionStatus() {}
}
