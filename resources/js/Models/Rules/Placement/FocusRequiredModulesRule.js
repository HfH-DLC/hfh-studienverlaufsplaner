import BaseScheduleRule from "./BaseScheduleRule";

export default class FocusRequiredModulesRule extends BaseScheduleRule {
    constructor() {
        super("FocusRequiredModules");
    }

    validateGlobal({ focusSelections, foci }, { placements }, errors) {
        focusSelections.forEach((focusSelection) => {
            const focus = foci.find(
                (focus) => focus.id === focusSelection.focusId
            );
            if (focus.requiredModules) {
                focus.requiredModules.forEach((module) => {
                    const placement = placements.find(
                        (placement) => placement.module.id === module.id
                    );
                    if (!placement) {
                        errors.push(
                            `Das Modul ${module.id} ${module.name} ist für den SSP ${focus.name} obligatorisch.`
                        );
                    }
                });
            }
            if (focus.optionalModules) {
                let count = 0;
                focus.optionalModules.forEach((module) => {
                    const placement = placements.find(
                        (placement) => placement.module.id === module.id
                    );
                    if (placement) {
                        count++;
                    }
                });
                if (count < focus.requiredNumberOfOptionalModules) {
                    const optionalModuleIds = focus.optionalModules.map(
                        (module) => module.id
                    );
                    const moduleString =
                        optionalModuleIds
                            .slice(0, optionalModuleIds.length - 1)
                            .join(", ") +
                        " oder " +
                        optionalModuleIds[optionalModuleIds.length - 1];
                    errors.push(
                        `Sie müssen für den SSP ${focus.name} ${focus.requiredNumberOfOptionalModules} der Module ${moduleString} belegen.`
                    );
                }
            }
        });
    }
}
