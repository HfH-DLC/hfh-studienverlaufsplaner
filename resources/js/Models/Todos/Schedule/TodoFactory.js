import AtLeastOneFocusTodo from "./AtLeastOneFocusTodo";
import ECTSPerCategoryTodo from "./ECTSPerCategoryTodo";
import FocusModulesTodo from "./FocusModulesTodo";
import RequiredModulesTodo from "./RequiredModulesTodo";
import TotalECTSTodo from "./TotalECTSTodo";

export const getTodo = ({ name, params }) => {
    switch (name) {
        case "AtLeastOneFocusTodo": {
            return new AtLeastOneFocusTodo(params);
        }
        case "ECTSPerCategoryTodo": {
            return new ECTSPerCategoryTodo(params);
        }
        case "FocusModulesTodo": {
            return new FocusModulesTodo(params);
        }
        case "RequiredModulesTodo": {
            return new RequiredModulesTodo(params);
        }
        case "TotalECTSTodo": {
            return new TotalECTSTodo(params);
        }
        default:
            throw "Unknown todo: " + name;
    }
};
