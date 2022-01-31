import ExcludeSemesterRule from "./ExcludeSemesterRule"

export const getRule = (state, { type, params }) => {
    switch (type) {
        case 'ExcludeSemester':
            {
                return new ExcludeSemesterRule(params);
            }
        default:
            throw "Unknown rules type: " + type;
    }
}