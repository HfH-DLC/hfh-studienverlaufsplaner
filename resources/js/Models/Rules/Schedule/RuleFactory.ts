import { Rule, RuleData } from "@/types";
import RuleMapping from "./RuleMapping";

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
    const RuleDetails = RuleMapping[name];
    if (RuleDetails) {
        if (RuleDetails.paramsRequired) {
            return new RuleDetails.Class(params);
        } else {
            return new RuleDetails.Class();
        }
    } else {
        throw "Unknown rule: " + name;
    }
};
