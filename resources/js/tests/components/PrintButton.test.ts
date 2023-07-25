import { expect, it, vi } from "vitest";

import { render } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import PrintButton from "@/Components/PrintButton.vue";
import { describe } from "vitest";

describe("PrintButton", () => {
    it("calls window.print when clicked", async () => {
        const user = userEvent.setup();
        const windowPrintSpy = vi
            .spyOn(window, "print")
            .mockImplementation(() => {});
        const wrapper = render(PrintButton);

        await user.click(wrapper.getByRole("button"));

        expect(windowPrintSpy).toHaveBeenCalledOnce();

        windowPrintSpy.mockRestore();
    });
});
