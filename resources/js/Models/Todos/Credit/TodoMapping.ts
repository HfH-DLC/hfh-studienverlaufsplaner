import AtLeastOneOfModulesPerFocusTodo from "./AtLeastOneOfModulesPerFocusTodo";
import ECTSPerFocusTodo from "./ECTSPerFocusTodo";
import FocusRequiredModulesTodo from "./FocusRequiredModulesTodo";
import FocusOptionalModulesTodo from "./FocusOptionalModulesTodo";
import { TodoMappingType } from "@/types";

const TodoMapping: TodoMappingType = {
    AtLeastOneOfModulesPerFocusTodo: {
        Class: AtLeastOneOfModulesPerFocusTodo,
        paramsRequired: true,
    },
    ECTSPerFocusTodo: { Class: ECTSPerFocusTodo, paramsRequired: true },
    FocusRequiredModulesTodo: {
        Class: FocusRequiredModulesTodo,
        paramsRequired: false,
    },
    FocusOptionalModulesTodo: {
        Class: FocusOptionalModulesTodo,
        paramsRequired: false,
    },
};

export default TodoMapping;
