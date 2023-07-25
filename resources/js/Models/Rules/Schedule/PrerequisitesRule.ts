import PrerequisitesRuleLabel from "@/Components/Rules/Schedule/PrerequisitesRuleLabel.vue";
import {
    Message,
    Event,
    Module,
    PriorLearning,
    ScheduleModule,
    SchedulePlacement,
    SelectionEventInfo,
    MessageType,
    Rule,
} from "@/types";
import { markRaw, Ref } from "vue";
import { isPreviousSemester, isSameDate } from "../../../helpers";
export default class PrerequisitesRule implements Rule {
    getPlacementErrors(
        {
            placements,
            priorLearnings,
        }: {
            placements: Ref<Array<SchedulePlacement>>;
            priorLearnings: Ref<Array<PriorLearning>>;
        },
        errors: Map<number, Array<Message>>
    ) {
        placements.value.forEach((placement: SchedulePlacement) => {
            const missingPrerequisites: Array<Module> = [];
            const prerequisites = placement.module?.prerequisites || [];
            if (prerequisites.length == 0) {
                return;
            }
            prerequisites.forEach((prerequisite) => {
                const meetsPrerequisite =
                    priorLearnings.value.some(
                        (priorLearning) =>
                            priorLearning.countsAsModuleId == prerequisite.id
                    ) ||
                    placements.value
                        .filter((prerequisitePlacement: SchedulePlacement) => {
                            return (
                                prerequisitePlacement.moduleId ==
                                prerequisite.id
                            );
                        })
                        .some((prerequisitePlacement: SchedulePlacement) => {
                            return isPreviousSemester(
                                prerequisitePlacement,
                                placement
                            );
                        });
                if (!meetsPrerequisite) {
                    missingPrerequisites.push(prerequisite);
                }
            });

            if (missingPrerequisites.length > 0) {
                let errorMessages = errors.get(placement.id);
                if (!errorMessages) {
                    errorMessages = [];
                    errors.set(placement.id, errorMessages);
                }
                errorMessages.push({
                    component: markRaw(PrerequisitesRuleLabel),
                    labelProps: {
                        missingPrerequisites,
                        module: placement.module,
                    },
                    type: MessageType.Error,
                });
            }
        });
    }

    getModuleErrors(
        module: ScheduleModule,
        {
            placements,
            priorLearnings,
        }: {
            placements: Ref<Array<SchedulePlacement>>;
            priorLearnings: Ref<Array<PriorLearning>>;
        },
        errors: Array<Message>
    ): void {
        const prerequisites = module.prerequisites;
        if (prerequisites.length == 0) {
            return;
        }

        const prerequisitesMet = module.events.some(
            (event) =>
                this.eventMeetsPrerequisites(
                    event,
                    placements.value,
                    priorLearnings.value,
                    prerequisites
                ) && this.timeSlotIsFree(module.id, event, placements.value)
        );
        if (!prerequisitesMet) {
            errors.push({
                component: markRaw(PrerequisitesRuleLabel),
                labelProps: {
                    missingPrerequisites: module.prerequisites,
                    module,
                },
                type: MessageType.Error,
            });
        }
    }

    getGlobalInfos(data: Record<string, any>, infos: Message[]): void {}

    getSelectionStatus(
        module: ScheduleModule,
        {
            placements,
            priorLearnings,
        }: {
            placements: Ref<Array<SchedulePlacement>>;
            priorLearnings: Ref<Array<PriorLearning>>;
        },
        selectionEventInfos: Map<number, SelectionEventInfo>
    ): void {
        const prerequisites = module.prerequisites;
        if (prerequisites.length == 0) {
            return;
        }
        module.events.forEach((event) => {
            if (
                !this.eventMeetsPrerequisites(
                    event,
                    placements.value,
                    priorLearnings.value,
                    prerequisites
                )
            ) {
                let selectionEventInfo = selectionEventInfos.get(event.id);
                if (!selectionEventInfo) {
                    selectionEventInfo = {
                        valid: true,
                        dateAllowed: true,
                    };
                    selectionEventInfos.set(event.id, selectionEventInfo);
                }
                selectionEventInfo.dateAllowed = false;
            }
        });
    }

    eventMeetsPrerequisites(
        event: Event,
        placements: Array<SchedulePlacement>,
        priorLearnings: Array<PriorLearning>,
        prerequisites: Array<Module>
    ) {
        return prerequisites.every((prerequisite) => {
            return (
                priorLearnings.some(
                    (priorLearning) =>
                        priorLearning.countsAsModuleId === prerequisite.id
                ) ||
                placements
                    .filter((placement) => {
                        return placement.moduleId == prerequisite.id;
                    })
                    .some((placement) => {
                        return isPreviousSemester(placement, event);
                    })
            );
        });
    }

    timeSlotIsFree(
        moduleId: string,
        event: Event,
        placements: Array<SchedulePlacement>
    ) {
        const placement = placements.find((placement) => {
            return isSameDate(placement, event);
        });
        if (!placement) {
            return true;
        }
        return placement.moduleId == moduleId;
    }
}
