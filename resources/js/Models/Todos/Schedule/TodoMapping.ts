import AtLeastOneFocusTodo from "./AtLeastOneFocusTodo";
import ECTSPerCategoryTodo from "./ECTSPerCategoryTodo";
import FocusModulesTodo from "./FocusModulesTodo";
import RequiredModulesTodo from "./RequiredModulesTodo";
import TotalECTSTodo from "./TotalECTSTodo";
import { TodoMappingType } from "@/types";

const TodoMapping: TodoMappingType = {
    AtLeastOneFocusTodo: {
        Class: AtLeastOneFocusTodo,
        paramsRequired: false,
    },
    ECTSPerCategoryTodo: {
        Class: ECTSPerCategoryTodo,
        paramsRequired: false,
    },
    FocusModulesTodo: {
        Class: FocusModulesTodo,
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
};

export default TodoMapping;
