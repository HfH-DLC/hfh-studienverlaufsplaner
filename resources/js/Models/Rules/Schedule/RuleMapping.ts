import ExcludeSemesterRule from "./ExcludeSemesterRule";
import PrerequisitesRule from "./PrerequisitesRule";

interface RuleMappingType {
    [key: string]:
        | { Class: new (params?: any) => any; paramsRequired: boolean }
        | undefined;
}

const RuleMapping: RuleMappingType = {
    ExcludeSemesterRule: {
        Class: ExcludeSemesterRule,
        paramsRequired: true,
    },
    PrerequisitesRule: {
        Class: PrerequisitesRule,
        paramsRequired: true,
    },
};

export default RuleMapping;
