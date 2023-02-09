import { useCreditStore } from "./credit";
import { useScheduleStore } from "./schedule";

export const callStoreActionByString = (string, params) => {
    const storeName = string.split("/")[0];
    const actionName = string.split("/")[1];
    return callStoreAction(storeName, actionName, params);
};

export const callStoreAction = (storeName, actionName, params) => {
    let store = null;
    switch (storeName) {
        case "credit":
            store = useCreditStore();
            break;
        case "schedule":
            store = useScheduleStore();
            break;
    }
    if (!store) {
        console.log(`Store with name ${storeName} not found.`);
        return;
    }
    if (!typeof store[actionName] == "function") {
        console.log(
            `Store with name ${storeName} does not have a function named ${$actionName}`
        );
        return;
    }
    return store[actionName](params);
};
