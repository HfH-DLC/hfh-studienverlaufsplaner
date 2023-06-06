import { Rule, RuleData } from "@/types";
import ExcludeSemesterRule from "./ExcludeSemesterRule";

export const getRules = (rulesData: Array<RuleData>) => {
    return rulesData.reduce((array: Array<Rule>, rule) => {
        try {
            array.push(getRule(rule));
        } catch (error) {
            console.error(error);
        }
        return array;
    }, []);
};

const getRule = ({ name, params }: RuleData): Rule => {
    switch (name) {
        case "ExcludeSemester": {
            return new ExcludeSemesterRule(params);
        }
        default:
            throw "Unknown rule: " + name;
    }
};
