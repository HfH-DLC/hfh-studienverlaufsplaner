import { expect, test, vi } from "vitest";

import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import DateRulePlacementLabel from "@/Components/Rules/Schedule/DateRulePlacementLabel.vue";
import { ScheduleModule, SchedulePlacement } from "@/types";
import { useEmitter } from "@/composables/useEmitter";

test("DateRulePlacementLabel", async () => {
    const emitter = useEmitter();
    const spy = vi.spyOn(emitter, "emit");
    const mockModule: ScheduleModule = {
        id: "123",
        name: "Test Module",
        events: [],
        prerequisites: [],
        ects: 5,
        infos: [],
        misplaced: false,
        selected: false,
        placement: undefined,
    };

    const mockPlacement: SchedulePlacement = {
        module: mockModule,
        semester: "HS",
        year: 2023,
        timeWindow: "Pflichtmodule & Wahlpflichtmodule",
        dayTime: {
            id: "a",
            day: "Montag",
            time: "Morgen",
            default: true,
            sortIndex: 0,
        },
        errors: [],
        moduleId: mockModule.id,
        id: 1,
        location: {
            id: "ZH",
            name: "Zürich",
            default: true,
        },
    };

    const wrapper = mount(DateRulePlacementLabel, {
        props: {
            placement: mockPlacement,
        },
    });

    await wrapper.find("button").trigger("click");
    await nextTick();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenLastCalledWith("focus-module", mockModule.id);
});
