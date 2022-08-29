import DateRule from "./Schedule/DateRule";
import ExcludeSemesterRule from "./Schedule/ExcludeSemesterRule";
import PrerequisitesRule from "./Schedule/PrerequisitesRule";
import ECTSPerFocusRule from "./FocusCredit/ECTSPerFocusRule";
import AtLeastOneOfModulesPerFocus from "./FocusCredit/AtLeastOneOfModulesPerFocusRule";

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
        case "Prerequisites": {
            return new PrerequisitesRule(params);
        }
        case "AtLeastOneOfModulesPerFocus": {
            return new AtLeastOneOfModulesPerFocus(params);
        }
        default:
            throw "Unknown rule: " + name;
    }
};
