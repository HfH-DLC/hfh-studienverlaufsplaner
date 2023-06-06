import { Placement } from "@/types";
import * as Factory from "factory.ts";
import { locationFactory } from "./LocationFactory";
import { dayTimeFactory } from "./DayTimeFactory";

export const placementFactory = Factory.Sync.makeFactory<Placement>({
    id: Factory.each((i) => i),
    location: locationFactory.build(),
    year: 1990,
    semester: "HS",
    dayTime: dayTimeFactory.build(),
    timeWindow: "TestTimeWindow",
    moduleId: Factory.each((i) => `test_module_${i}`),
});
