import { expect, it, vi } from "vitest";

import { render } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import StartTourButton from "@/Components/StartTourButton.vue";
import { describe } from "vitest";
import { useEmitter } from "@/composables/useEmitter";

describe("StartTourButton", () => {
    it("emits start-tour when clicked", async () => {
        const emitter = useEmitter();
        const emitterEmitSpy = vi.spyOn(emitter, "emit");
        const user = userEvent.setup();
        const wrapper = render(StartTourButton);

        await user.click(wrapper.getByRole("button"));

        expect(emitterEmitSpy).toHaveBeenCalledOnce();
        expect(emitterEmitSpy).toHaveBeenLastCalledWith("start-tour");
    });
});
