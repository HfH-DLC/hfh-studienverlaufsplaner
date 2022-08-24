import ExcludeSemesterRule from "./Placement/ExcludeSemesterRule"

export const getRule = (state, { type, params }) => {
    switch (type) {
        case 'ExcludeSemester':
            {
                return new ExcludeSemesterRule(params, state.startYear);
            }
        default:
            throw "Unknown rules type: " + type;
    }
}