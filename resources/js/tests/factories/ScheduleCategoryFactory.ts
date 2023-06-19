import { ScheduleCategory } from "@/types";
import * as Factory from "factory.ts";

export const scheduleCategoryFactory =
    Factory.Sync.makeFactory<ScheduleCategory>({
        id: Factory.each((i) => i),
        name: Factory.each((i) => `Testcategory_${i}`),
        modules: [],
        minECTS: 0,
        maxECTS: 0,
        required: false,
        currentECTS: 0,
    });
