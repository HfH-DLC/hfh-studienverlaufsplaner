import { FocusSelection } from "@/types";
import * as Factory from "factory.ts";
import { focusFactory } from "./FocusFactory";

export const focusSelectionFactory = Factory.Sync.makeFactory<FocusSelection>({
    id: Factory.each((i) => i),
    position: Factory.each((i) => i),
    focus: focusFactory.build(),
});
