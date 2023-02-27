import { Todo, TodoData } from "@/types";
import AtLeastOneFocusTodo from "./AtLeastOneFocusTodo";
import ECTSPerCategoryTodo from "./ECTSPerCategoryTodo";
import FocusModulesTodo from "./FocusModulesTodo";
import RequiredModulesTodo from "./RequiredModulesTodo";
import TotalECTSTodo from "./TotalECTSTodo";

export const getTodo = ({ name }: TodoData): Todo => {
    switch (name) {
        case "AtLeastOneFocusTodo": {
            return new AtLeastOneFocusTodo();
        }
        case "ECTSPerCategoryTodo": {
            return new ECTSPerCategoryTodo();
        }
        case "FocusModulesTodo": {
            return new FocusModulesTodo();
        }
        case "RequiredModulesTodo": {
            return new RequiredModulesTodo();
        }
        case "TotalECTSTodo": {
            return new TotalECTSTodo();
        }
        default:
            throw "Unknown todo: " + name;
    }
};
