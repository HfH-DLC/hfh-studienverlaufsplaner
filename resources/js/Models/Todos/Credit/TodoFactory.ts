import { Todo } from "@/types";
import AtLeastOneOfModulesPerFocusTodo from "./AtLeastOneOfModulesPerFocusTodo";
import ECTSPerFocusTodo from "./ECTSPerFocusTodo";
import FocusModulesTodo from "./FocusModulesTodo";

export const getTodo = (name: string, params: Record<string, any>): Todo => {
    switch (name) {
        case "AtLeastOneOfModulesPerFocusTodo": {
            return new AtLeastOneOfModulesPerFocusTodo(params);
        }
        case "ECTSPerFocusTodo": {
            return new ECTSPerFocusTodo(params);
        }
        case "FocusModulesTodo": {
            return new FocusModulesTodo();
        }
        default:
            throw "Unknown todo: " + name;
    }
};
