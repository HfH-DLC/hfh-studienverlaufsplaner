import { Focus } from "@/types";
import * as Factory from "factory.ts";

export const focusFactory = Factory.Sync.makeFactory<Focus>({
    id: Factory.each((i) => `${i}`),
    name: Factory.each((i) => `${i}`),
    requiredNumberOfOptionalModules: 0,
    requiredModules: [],
    optionalModules: [],
});
