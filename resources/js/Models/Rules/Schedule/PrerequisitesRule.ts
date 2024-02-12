import PrerequisitesRuleLabel from "@/Components/Rules/Schedule/PrerequisitesRuleLabel.vue";
import {
    Message,
    Event,
    PriorLearning,
    ScheduleModule,
    SchedulePlacement,
    SelectionEventInfo,
    MessageType,
    Rule,
    PrerequisiteGroup,
} from "@/types";
import { markRaw, Ref } from "vue";
import { isPreviousSemester, isSameDate } from "../../../helpers";

export default class PrerequisitesRule implements Rule {
    private moduleId: string;
    private groups: Array<PrerequisiteGroup>;

    constructor(params: Record<string, any>) {
        this.moduleId = params.moduleId;
        this.groups = params.groups;
    }

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
        const placement = placements.value.find(
            (placement: SchedulePlacement) =>
                placement.moduleId === this.moduleId
        );

        if (!placement) {
            return;
        }

        this.groups.forEach((prerequisiteGroup) => {
            if (
                !this.checkGroup(
                    placement,
                    prerequisiteGroup,
                    placements.value,
                    priorLearnings.value
                )
            ) {
                let errorMessages = errors.get(placement.id);
                if (!errorMessages) {
                    errorMessages = [];
                    errors.set(placement.id, errorMessages);
                }
                errorMessages.push({
                    component: markRaw(PrerequisitesRuleLabel),
                    labelProps: {
                        prerequisiteGroup,
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
        if (module.id !== this.moduleId) {
            return;
        }

        this.groups.forEach((prerequisiteGroup: PrerequisiteGroup) => {
            const groupFulfilled = module.events.some((event) => {
                return (
                    this.timeSlotIsFree(module.id, event, placements.value) &&
                    this.checkGroup(
                        event,
                        prerequisiteGroup,
                        placements.value,
                        priorLearnings.value
                    )
                );
            });

            if (!groupFulfilled) {
                errors.push({
                    component: markRaw(PrerequisitesRuleLabel),
                    labelProps: {
                        prerequisiteGroup,
                        module,
                    },
                    type: MessageType.Error,
                });
            }
        });
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
        if (module.id !== this.moduleId) {
            return;
        }
        module.events.forEach((event) => {
            let prerequisitesMet = !this.groups.some((prerequisiteGroup) => {
                return !this.checkGroup(
                    event,
                    prerequisiteGroup,
                    placements.value,
                    priorLearnings.value
                );
            });
            if (!prerequisitesMet) {
                let selectionEventInfo = selectionEventInfos.get(event.id);
                if (!selectionEventInfo) {
                    selectionEventInfo = {
                        valid: true,
                        dateAllowed: false,
                    };
                    selectionEventInfos.set(event.id, selectionEventInfo);
                } else {
                    selectionEventInfo.dateAllowed = false;
                }
            }
        });
    }

    private checkGroup(
        event: Event,
        group: PrerequisiteGroup,
        placements: Array<SchedulePlacement>,
        priorLearnings: Array<PriorLearning>
    ): boolean {
        const requiredCount: number =
            group.requiredCount || group.prerequisiteIds.length;

        let actualCount = 0;
        let unfulfilledPrerequisites: Array<string> = [];

        group.prerequisiteIds.forEach((prerequisiteId) => {
            const meetsPrerequisite =
                priorLearnings.some(
                    (priorLearning) =>
                        priorLearning.countsAsModuleId == prerequisiteId
                ) ||
                placements
                    .filter((prerequisitePlacement: SchedulePlacement) => {
                        return prerequisitePlacement.moduleId == prerequisiteId;
                    })
                    .some((prerequisitePlacement: SchedulePlacement) => {
                        return isPreviousSemester(prerequisitePlacement, event);
                    });
            if (meetsPrerequisite) {
                actualCount++;
            } else {
                unfulfilledPrerequisites.push(prerequisiteId);
            }
        });

        return actualCount === requiredCount;
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

    getModuleId() {
        return this.moduleId;
    }

    getPrerequisiteGroups(): Array<PrerequisiteGroup> {
        return this.groups;
    }
}
