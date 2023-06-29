import { Message, SchedulePlacement } from "@/types";
import * as Factory from "factory.ts";
import { scheduleModuleFactory } from "./ScheduleModuleFactory";
import { locationFactory } from "./LocationFactory";
import { dayTimeFactory } from "./DayTimeFactory";

const schedulePlacementPartialFactory =
    Factory.Sync.makeFactory<SchedulePlacement>({
        id: Factory.each((i) => i),
        location: locationFactory.build(),
        year: 1990,
        semester: "HS",
        dayTime: dayTimeFactory.build(),
        timeWindow: "TestTimeWindow",
        moduleId: Factory.each((i) => `test_module_${i}`),
        module: Factory.each((i) =>
            scheduleModuleFactory.build({
                id: `test_module_${i}`,
            })
        ),
        errors: [] as Array<Message>,
    });

export const schedulePlacementFactory =
    schedulePlacementPartialFactory.withSelfDerivation(
        "module",
        (schedulePlacement) => {
            return {
                ...schedulePlacement.module,
                placement: schedulePlacement,
            };
        }
    );
