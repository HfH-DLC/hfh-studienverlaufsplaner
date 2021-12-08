import OnePerSemesterRule from "./OnePerSemesterRule"

export const getRule = ({ type, params }) => {
    if (type === 'onePerSemester') {
        return new OnePerSemesterRule(params.moduleIds);
    }
    throw "Unknown rules type: " + type;
}