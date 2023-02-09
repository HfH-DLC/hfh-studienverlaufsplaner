import AtLeastOneOfModulesPerFocusTodo from "./AtLeastOneOfModulesPerFocusTodo";
import ECTSPerFocusTodo from "./ECTSPerFocusTodo";
import FocusModulesTodo from "./FocusModulesTodo";

export const getTodo = ({ name, params }) => {
    switch (name) {
        case "AtLeastOneOfModulesPerFocusTodo": {
            return new AtLeastOneOfModulesPerFocusTodo(params);
        }
        case "ECTSPerFocusTodo": {
            return new ECTSPerFocusTodo(params);
        }
        case "FocusModulesTodo": {
            return new FocusModulesTodo(params);
        }
        default:
            throw "Unknown todo: " + name;
    }
};
