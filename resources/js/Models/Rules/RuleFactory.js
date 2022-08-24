import CategoriesECTSRule from "./Placement/CategoriesECTSRule";
import DateRule from "./Placement/DateRule";
import ExcludeSemesterRule from "./Placement/ExcludeSemesterRule";
import FocusRequiredModulesRule from "./Placement/FocusRequiredModulesRule";
import PrerequisitesRule from "./Placement/PrerequisitesRule";

export const getRule = (state, { type, params }) => {
    switch (type) {
        case "CategoriesECTS": {
            return new CategoriesECTSRule();
        }
        case "Date": {
            return new DateRule();
        }
        case "ExcludeSemester": {
            return new ExcludeSemesterRule(params, state.startYear);
        }
        case "FocusRequiredModules": {
            return new FocusRequiredModulesRule();
        }
        case "Prerequisites": {
            return new PrerequisitesRule();
        }
        default:
            throw "Unknown rules type: " + type;
    }
};
