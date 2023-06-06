import { Event } from "@/types";
import * as Factory from "factory.ts";
import { locationFactory } from "./LocationFactory";
import { dayTimeFactory } from "./DayTimeFactory";

export const eventFactory = Factory.Sync.makeFactory<Event>({
    id: Factory.each((i) => i),
    location: locationFactory.build(),
    year: 1990,
    semester: "HS",
    dayTime: dayTimeFactory.build(),
    timeWindow: "TestTimeWindow",
});
