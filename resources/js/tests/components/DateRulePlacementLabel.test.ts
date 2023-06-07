import { expect, test, vi } from "vitest";

import { render } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { nextTick } from "vue";
import DateRulePlacementLabel from "@/Components/Rules/Schedule/DateRulePlacementLabel.vue";
import { ScheduleModule, SchedulePlacement } from "@/types";
import { useEmitter } from "@/composables/useEmitter";
import { scheduleModuleFactory } from "@/tests/factories/ScheduleModuleFactory";
import { placementFactory } from "@/tests/factories/PlacementFactory";

test("DateRulePlacementLabel", async () => {
    const emitter = useEmitter();
    const spy = vi.spyOn(emitter, "emit");
    const module: ScheduleModule = scheduleModuleFactory.build();
    const mockPlacement: SchedulePlacement = {
        ...placementFactory.build({ moduleId: module.id }),
        module,
        errors: [],
    };
    const user = userEvent.setup();

    const wrapper = render(DateRulePlacementLabel, {
        props: {
            placement: mockPlacement,
        },
    });

    await user.click(wrapper.getByRole("button"));
    await nextTick();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenLastCalledWith("focus-module", module.id);
});
