import ExcludeSemesterRule from "./ExcludeSemesterRule";

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
};

export default RuleMapping;
