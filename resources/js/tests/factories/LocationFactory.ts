import { Location } from "@/types";
import * as Factory from "factory.ts";

export const locationFactory = Factory.Sync.makeFactory<Location>({
    id: Factory.each((i) => `test_location_${i}`),
    name: Factory.each((i) => `Test Location ${i}`),
    default: false,
});
