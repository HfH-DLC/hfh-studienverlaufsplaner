export default class AtLeastOneFocusTodo {
    getEntries({ focusSelections }, getters) {
        return [
            {
                label: `Wählen Sie mindestens einen Studienschwerpunkt.`,
                checked: this.validate(focusSelections),
            },
        ];
    }

    validate(focusSelections) {
        return focusSelections.length > 0;
    }
}
