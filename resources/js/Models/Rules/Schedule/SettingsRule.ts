import { Ref } from "vue";
import {
    DayTime,
    Message,
    MessageType,
    Rule,
    SchedulePlacement,
} from "@/types";

export default class SettingsRule implements Rule {
    getPlacementErrors(
        {
            placements,
            locationIds,
            dayTimes,
        }: {
            placements: Ref<Array<SchedulePlacement>>;
            locationIds: Ref<Array<string>>;
            dayTimes: Ref<Array<DayTime>>;
        },
        errors: Map<number, Array<Message>>
    ) {
        placements.value.forEach((placement: SchedulePlacement) => {
            if (!locationIds.value.includes(placement.location.id)) {
                this.addErrorMessage(errors, placement.id, {
                    label: `Die aktuelle Platzierung des Modules ${placement.module.id} liegt ausserhalb Ihrer gewählten Standorte. `,
                });
            }
            if (
                !dayTimes.value.some(
                    (dayTime) => dayTime.id === placement.dayTime.id
                )
            ) {
                this.addErrorMessage(errors, placement.id, {
                    label: `Die aktuelle Platzierung des Modules ${placement.module.id} liegt ausserhalb Ihrer gewählten Zeitpunkte. `,
                });
            }
        });
    }

    addErrorMessage(
        errors: Map<number, Array<Message>>,
        placementId: number,
        message: Partial<Message>
    ) {
        let errorMessages = errors.get(placementId);
        if (!errorMessages) {
            errorMessages = [];
            errors.set(placementId, errorMessages);
        }
        errorMessages.push({ ...message, type: MessageType.Error });
    }

    getGlobalInfos(): void {}

    getModuleErrors() {}

    getSelectionStatus() {}
}
