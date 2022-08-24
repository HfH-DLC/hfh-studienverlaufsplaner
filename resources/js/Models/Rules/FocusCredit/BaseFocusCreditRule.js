import Rule from "../Rule";
export default class BaseFocusCreditRule extends Rule {
    constructor(type) {
        super("focusCredit", type);
        if (this.constructor == BaseFocusCreditRule) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    validate(focusCredits, focusSelections, modules, addError) {
        throw new Error("Method not implemented");
    }

    getFocusName(focusSelectionId, focusSelections) {
        const focusSelection = focusSelections.find(
            (focusSelection) => focusSelection.id == focusSelectionId
        );
        return focusSelection.focus.name;
    }
}
