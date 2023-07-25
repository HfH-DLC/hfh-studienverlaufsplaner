import { Category } from "@/types";
import * as Factory from "factory.ts";

export const categoryFactory = Factory.Sync.makeFactory<Category>({
    id: Factory.each((i) => i),
    name: Factory.each((i) => `Testcategory_${i}`),
    modules: [],
    minECTS: 0,
    maxECTS: 0,
    required: false,
});
