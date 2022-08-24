import DateRule from "./Placement/DateRule";
import ExcludeSemesterRule from "./Placement/ExcludeSemesterRule";
import FocusRequiredModulesRule from "./Placement/FocusRequiredModulesRule";
import PrerequisitesRule from "./Placement/PrerequisitesRule";
import ECTSPerFocusRule from "./FocusCredit/ECTSPerFocusRule";
import AtLeastOneOfModulesPerFocusFocus from "./FocusCredit/AtLeastOneOfModulesPerFocusRule";

export const getRule = (state, { name, params }) => {
    switch (name) {
        case "Date": {
            return new DateRule(params);
        }
        case "ECTSPerFocus": {
            return new ECTSPerFocusRule(params);
        }
        case "ExcludeSemester": {
            return new ExcludeSemesterRule(params);
        }
        case "FocusRequiredModules": {
            return new FocusRequiredModulesRule(params);
        }
        case "Prerequisites": {
            return new PrerequisitesRule(params);
        }
        case "AtLeastOneOfModulesPerFocus": {
            return new AtLeastOneOfModulesPerFocus(params);
        }
        default:
            throw "Unknown rules type: " + type;
    }
};
