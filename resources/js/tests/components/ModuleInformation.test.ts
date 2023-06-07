import { expect, it } from "vitest";
import { render } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { useScheduleStore } from "@/Store/schedule";
import ModuleInformation from "@/Components/ModuleInformation.vue";
import { scheduleModuleFactory } from "../factories/ScheduleModuleFactory";

describe("ModuleInformation", () => {
    it("displays back button when a module is selected", async () => {
        const wrapper = render(ModuleInformation, {
            props: {
                selectedModule: scheduleModuleFactory.build(),
            },
        });

        expect(wrapper.queryByRole("button")).toBeTruthy();
    });
    it("does not display a back button when no module is selected", async () => {
        const wrapper = render(ModuleInformation, {
            props: {
                selectedModule: null,
            },
        });

        expect(wrapper.queryByRole("button")).toBeNull();
    });
    it("calls store.deselectModule when back button is clicked", async () => {
        const user = userEvent.setup();
        const wrapper = render(ModuleInformation, {
            global: {
                plugins: [createTestingPinia()],
            },
            props: {
                selectedModule: scheduleModuleFactory.build(),
            },
        });
        const store = useScheduleStore();

        await user.click(wrapper.getByRole("button"));

        expect(store.deselectModule).toHaveBeenCalledOnce();
    });
});
