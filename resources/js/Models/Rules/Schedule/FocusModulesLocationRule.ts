import { joinStrings, pluralize } from "@/helpers";
import { ScheduleModule } from "@/types";
import { Message } from "@/types";
import { MessageType } from "@/types";
import { Location } from "@/types";
import { Event } from "@/types";
import { FocusSelection } from "@/types";
import { Rule } from "@/types";
import { Ref } from "vue";

export default class FocusModulesLocationRule implements Rule {
    getPlacementErrors(): void {}
    getModuleErrors(): void {}
    getGlobalInfos(
        {
            focusSelections,
            locationIds,
            locations,
            modules,
        }: {
            focusSelections: Ref<Array<FocusSelection>>;
            locationIds: Ref<Array<string>>;
            locations: Ref<Array<Location>>;
            modules: Ref<Array<ScheduleModule>>;
        },
        infos: Array<Message>
    ) {
        focusSelections.value.forEach((focusSelection: FocusSelection) => {
            const focusSelectionModules = [
                ...focusSelection.focus.requiredModules,
                ...focusSelection.focus.optionalModules,
            ];
            const moduleIds = focusSelectionModules.map((module) => module.id);
            const notAvailableModuleIds = moduleIds.filter((id) => {
                const module = modules.value.find((module) => module.id == id);
                if (module) {
                    return !module.events.find((event: Event) => {
                        return locationIds.value.includes(event.location.id);
                    });
                }
                return true;
            });
            if (notAvailableModuleIds.length > 0) {
                const moduleString = pluralize(
                    notAvailableModuleIds.length,
                    "ist das Modul",
                    "sind die Module"
                );
                const locationString = pluralize(
                    locationIds.value.length,
                    "am Standort",
                    "an den Standorten"
                );
                const locationNames: Array<string> = locations.value.map(
                    (location: Location) => location.name
                );
                infos.push({
                    label: `Für den SSP "${
                        focusSelection.focus.name
                    }" ${moduleString} ${joinStrings(
                        notAvailableModuleIds.map((id) => {
                            return `<button data-action="focus-module" data-module=${id}>${id}</button>`;
                        }),
                        "und"
                    )} ${locationString} ${joinStrings(
                        locationNames,
                        "und"
                    )} nicht verfügbar.`,
                    type: MessageType.Info,
                });
            }
        });
    }
    getSelectionStatus(): void {}
}
