import ExcludeSemesterRulePlacementLabel from "@/Components/Rules/Schedule/ExcludeSemesterRulePlacementLabel.vue";
import {
    ErrorMessage,
    EventDate,
    Placement,
    ScheduleModule,
    SchedulePlacement,
    SelectionEventInfo,
} from "@/types";
import { markRaw, Ref } from "vue";
import { isSameDate, semesterCount, semesterPosition } from "../../../helpers";
export default class ExcludeSemesterRule {
    private excludePositions: Array<Number>;
    private moduleId: string;

    constructor(params: Record<string, any>) {
        this.excludePositions = params.excludePositions;
        this.moduleId = params.moduleId;
    }

    validatePlacements(
        {
            placements,
            startYear,
        }: {
            placements: Ref<Array<SchedulePlacement>>;
            startYear: Ref<number>;
        },
        errors: Map<number, Array<ErrorMessage>>
    ): void {
        placements.value
            .filter(
                (placement: Placement) => placement.moduleId == this.moduleId
            )
            .forEach((placement: Placement) => {
                if (!this.isAllowedSemester(placement, startYear.value)) {
                    let errorMessages = errors.get(placement.id);
                    if (!errorMessages) {
                        errorMessages = [];
                        errors.set(placement.id, errorMessages);
                    }
                    errorMessages.push({
                        component: markRaw(ExcludeSemesterRulePlacementLabel),
                        labelProps: {
                            excludePositions: this.excludePositions,
                            placement,
                        },
                    });
                }
            });
    }

    validateModule(
        module: ScheduleModule,
        {
            startYear,
            placements,
        }: {
            placements: Ref<Array<SchedulePlacement>>;
            startYear: Ref<number>;
        },
        errors: Array<ErrorMessage>
    ): void {
        if (module.id !== this.moduleId) {
            return;
        }
        if (
            !module.placement &&
            module.events.every(
                (event) =>
                    this.isAllowedSemester(event, startYear.value) ||
                    placements.value.find((placement: Placement) =>
                        isSameDate(placement, event)
                    )
            )
        ) {
            errors.push({
                label: "Alle Termine in den erlaubten Semestern für dieses Modul sind bereits besetzt.",
            });
        }
    }

    validateSelection(
        module: ScheduleModule,
        { startYear }: { startYear: Ref<number> },
        selectionEventInfos: Map<number, SelectionEventInfo>
    ): void {
        if (module.id !== this.moduleId) {
            return;
        }
        module.events.forEach((event) => {
            let selectionEventInfo = selectionEventInfos.get(event.id);
            if (!selectionEventInfo) {
                selectionEventInfo = {
                    valid: true,
                    dateAllowed: true,
                };
                selectionEventInfos.set(event.id, selectionEventInfo);
            }
            selectionEventInfo.dateAllowed = this.isAllowedSemester(
                event,
                startYear.value
            );
        });
    }

    isAllowedSemester(date: EventDate, startYear: number) {
        const yearDiff = date.year - startYear;
        const position =
            yearDiff * semesterCount() + semesterPosition(date.semester);
        return !this.excludePositions.includes(position);
    }
}
