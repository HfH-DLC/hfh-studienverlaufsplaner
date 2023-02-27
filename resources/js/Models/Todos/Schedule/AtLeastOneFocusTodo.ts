import { ChecklistEntryData, FocusSelection, Todo } from "@/types";
import { Ref } from "vue";

export default class AtLeastOneFocusTodo implements Todo {
    getEntries({
        focusSelections,
    }: {
        focusSelections: Ref<Array<FocusSelection>>;
    }): Array<ChecklistEntryData> {
        return [
            {
                label: `Wählen Sie mindestens einen Studienschwerpunkt.`,
                checked: this.validate(focusSelections.value),
                progressLabel: `${focusSelections.value.length}`,
            },
        ];
    }

    validate(focusSelections: Array<FocusSelection>) {
        return focusSelections.length > 0;
    }
}
