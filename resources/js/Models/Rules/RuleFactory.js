import DateRule from "./Schedule/DateRule";
import ExcludeSemesterRule from "./Schedule/ExcludeSemesterRule";
import PrerequisitesRule from "./Schedule/PrerequisitesRule";

export const getRule = (state, { name, params }) => {
    switch (name) {
        case "Date": {
            return new DateRule(params);
        }
        case "ExcludeSemester": {
            return new ExcludeSemesterRule(params);
        }
        case "Prerequisites": {
            return new PrerequisitesRule(params);
        }
        default:
            throw "Unknown rule: " + name;
    }
};
