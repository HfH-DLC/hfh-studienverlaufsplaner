import { ChecklistEntryData } from "@/types";
import * as Factory from "factory.ts";

export const checklistEntryDataFactory =
    Factory.Sync.makeFactory<ChecklistEntryData>({
        checked: false,
        progressLabel: "Some progress text",
    });
