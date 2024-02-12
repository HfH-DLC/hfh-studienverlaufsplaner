import { Module } from "@/types";
import * as Factory from "factory.ts";

export const moduleFactory = Factory.Sync.makeFactory<Module>({
    id: Factory.each((i) => `TEST_${i}`),
    name: Factory.each((i) => `Testmodule_${i}`),
    events: [],
    ects: 5,
});
