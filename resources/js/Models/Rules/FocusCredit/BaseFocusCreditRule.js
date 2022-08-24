import Rule from "../Rule";
export default class BaseFocusCreditRule extends Rule {
    constructor(name) {
        super(name);
        if (this.constructor == BaseFocusCreditRule) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    validate() {}

    getFocusName(focusSelectionId, focusSelections) {
        const focusSelection = focusSelections.find(
            (focusSelection) => focusSelection.id == focusSelectionId
        );
        return focusSelection.focus.name;
    }
}
