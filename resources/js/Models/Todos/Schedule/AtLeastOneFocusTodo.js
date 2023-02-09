export default class AtLeastOneFocusTodo {
    getEntries({ focusSelections }) {
        return [
            {
                label: `Wählen Sie mindestens einen Studienschwerpunkt.`,
                checked: this.validate(focusSelections),
                progressLabel: `${focusSelections.length}`,
            },
        ];
    }

    validate(focusSelections) {
        return focusSelections.length > 0;
    }
}
