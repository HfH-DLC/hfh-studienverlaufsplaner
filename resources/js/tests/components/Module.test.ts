import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import userEvent from "@testing-library/user-event";

import Module from "@/Components/Module.vue";
import { scheduleModuleFactory } from "../factories/ScheduleModuleFactory";
import { useScheduleStore } from "@/Store/schedule";

describe("Module", () => {
    it("has a disabled button if the disabled prop is set to true", () => {
        const wrapper = render(Module, {
            props: {
                module: scheduleModuleFactory.build(),
                disabled: true,
            },
            global: {
                plugins: [createTestingPinia()],
            },
        });

        expect(wrapper.getByRole("button")).toBeDisabled();
    });
    it("has a button that is not disabled if the disabled prop is set to false", () => {
        const wrapper = render(Module, {
            props: {
                module: scheduleModuleFactory.build(),
                disabled: false,
            },
            global: {
                plugins: [createTestingPinia()],
            },
        });

        expect(wrapper.getByRole("button")).not.toBeDisabled();
    });
    it("calls store.selectModule on click if passed a not selected module", async () => {
        const user = userEvent.setup();
        const module = scheduleModuleFactory.build({
            selected: false,
        });
        const wrapper = render(Module, {
            props: {
                module,
            },
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const store = useScheduleStore();

        await user.click(wrapper.getByRole("button"));

        expect(store.selectModule).toHaveBeenCalledOnce();
        expect(store.selectModule).toHaveBeenLastCalledWith(module.id);
    });
    it("calls store.deselectModule a module on click if passed a selected module", async () => {
        const user = userEvent.setup();
        const wrapper = render(Module, {
            props: {
                module: scheduleModuleFactory.build({
                    selected: true,
                }),
            },
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const store = useScheduleStore();

        await user.click(wrapper.getByRole("button"));

        expect(store.deselectModule).toHaveBeenCalledOnce();
    });
});
