import { PriorLearning } from "@/types";
import * as Factory from "factory.ts";

export const priorLearnignFactory = Factory.Sync.makeFactory<PriorLearning>({
    id: Factory.each((i) => i),
    name: Factory.each((i) => `Test Prior Learning ${i}`),
    ects: 0,
    countsAsModuleId: "",
});
