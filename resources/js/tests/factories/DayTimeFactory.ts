import { DayTime } from "@/types";
import * as Factory from "factory.ts";

export const dayTimeFactory = Factory.Sync.makeFactory<DayTime>({
    id: Factory.each((i) => `test_day_time_${i}`),
    day: Factory.each((i) => `Test Day ${i}`),
    time: Factory.each((i) => `Test Time ${i}`),
    default: false,
    sortIndex: Factory.each((i) => i),
});
