import { CreditModule } from "@/types";
import * as Factory from "factory.ts";

export const creditModuleFactory = Factory.Sync.makeFactory<CreditModule>({
    id: Factory.each((i) => `TEST_${i}`),
    name: Factory.each((i) => `Testmodule_${i}`),
    events: [],
    ects: 5,
    prerequisites: [],
    creditedAgainst: null,
    requiredCredit: false,
});
