import { describe, expect, it } from "vitest";
import { render } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import ContextMenu from "@/Components/ContextMenu.vue";
import { createTestingPinia } from "@pinia/testing";
import { placementFactory } from "../factories/PlacementFactory";
import { useScheduleStore } from "@/Store/schedule";

describe("ContextMenu", () => {
    it("calls store.removeModule when clicked", async () => {
        const user = userEvent.setup();
        const wrapper = render(ContextMenu, {
            props: {
                placement: placementFactory.build(),
            },
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const store = useScheduleStore();

        await user.click(wrapper.getByRole("button"));

        expect(store.removeModule).toHaveBeenCalledOnce();
    });
});
