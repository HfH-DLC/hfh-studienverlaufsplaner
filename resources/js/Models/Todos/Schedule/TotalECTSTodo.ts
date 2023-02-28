import { ChecklistEntryData, Todo } from "@/types";
import { Ref } from "vue";

export default class TotalECTSTodo implements Todo {
    getEntries({
        requiredECTS,
        ects,
    }: {
        requiredECTS: Ref<number>;
        ects: Ref<number>;
    }): Array<ChecklistEntryData> {
        return [
            {
                label: `Belegen Sie genau ${requiredECTS.value} ECTS Kreditpunkte.`,
                checked: ects.value == requiredECTS.value,
                progressLabel: `${ects.value} / ${requiredECTS.value}`,
            },
        ];
    }
}
