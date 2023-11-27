import AtLeastOneFocusTodo from "@/Models/Todos/Schedule/AtLeastOneFocusTodo";
import ECTSPerCategoryTodo from "@/Models/Todos/Schedule/ECTSPerCategoryTodo";
import FocusRequiredModulesTodo from "@/Models/Todos/Schedule/FocusRequiredModulesTodo";
import FocusOptionalModulesTodo from "@/Models/Todos/Schedule/FocusOptionalModulesTodo";
import RequiredModulesTodo from "@/Models/Todos/Schedule/RequiredModulesTodo";
import TotalECTSTodo from "@/Models/Todos/Schedule/TotalECTSTodo";
import { TodoMappingType } from "@/types";
import ExactlyOneOfModulesTodo from "./ExactlyOneOfModulesTodo";

const TodoMapping: TodoMappingType = {
    AtLeastOneFocusTodo: {
        Class: AtLeastOneFocusTodo,
        paramsRequired: false,
    },
    ECTSPerCategoryTodo: {
        Class: ECTSPerCategoryTodo,
        paramsRequired: false,
    },
    FocusRequiredModulesTodo: {
        Class: FocusRequiredModulesTodo,
        paramsRequired: false,
    },
    FocusOptionalModulesTodo: {
        Class: FocusOptionalModulesTodo,
        paramsRequired: false,
    },
    RequiredModulesTodo: {
        Class: RequiredModulesTodo,
        paramsRequired: false,
    },
    TotalECTSTodo: {
        Class: TotalECTSTodo,
        paramsRequired: false,
    },
    ExactlyOneOfModulesTodo: {
        Class: ExactlyOneOfModulesTodo,
        paramsRequired: true,
    },
};

export default TodoMapping;
