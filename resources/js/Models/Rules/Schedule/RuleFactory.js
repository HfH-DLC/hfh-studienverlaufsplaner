import DateRule from "./DateRule";
import ExcludeSemesterRule from "./ExcludeSemesterRule";
import PrerequisitesRule from "./PrerequisitesRule";

export const getRule = ({ name, params }) => {
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
