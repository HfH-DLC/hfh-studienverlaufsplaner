import { Rule, RuleData } from "@/types";
import DateRule from "./DateRule";
import ExcludeSemesterRule from "./ExcludeSemesterRule";
import PrerequisitesRule from "./PrerequisitesRule";

export const getRule = ({ name, params }: RuleData): Rule => {
    switch (name) {
        case "Date": {
            return new DateRule();
        }
        case "ExcludeSemester": {
            return new ExcludeSemesterRule(params);
        }
        case "Prerequisites": {
            return new PrerequisitesRule();
        }
        default:
            throw "Unknown rule: " + name;
    }
};
