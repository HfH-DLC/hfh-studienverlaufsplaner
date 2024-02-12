import { ScheduleModule } from "@/types";
import * as Factory from "factory.ts";

export const scheduleModuleFactory = Factory.Sync.makeFactory<ScheduleModule>({
    id: Factory.each((i) => `TEST_${i}`),
    name: Factory.each((i) => `Testmodule_${i}`),
    events: [],
    ects: 5,
    errors: [],
    misplaced: false,
    placement: undefined,
    selected: false,
    prerequisiteGroups: [],
});
