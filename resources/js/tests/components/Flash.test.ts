import { describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";
import Flash from "@/Components/Flash.vue";
import { useEmitter } from "@/composables/useEmitter";
import { FlashType } from "@/types";
import { FlashData } from "@/types";

describe("Flash", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("does not display if no message has been set", async () => {
        const wrapper = render(Flash, {
            props: {},
            global: {
                plugins: [createTestingPinia()],
            },
        });

        expect(wrapper.queryByTestId("flash")).toBeNull();
    });

    it("does display correctly if a message has been set", async () => {
        const wrapper = render(Flash, {
            props: {},
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const emitter = useEmitter();
        const flashData: FlashData = {
            type: FlashType.Success,
            message: "A message",
        };

        emitter.emit("flash", flashData);

        await waitFor(() => expect(wrapper.getByTestId("flash")).toBeVisible());
        const container = wrapper.getByTestId("flash");
        expect(container).toHaveAttribute("role", "status");
        expect(container).toHaveTextContent(flashData.message);
        expect(wrapper.queryByTestId("flash.action")).toBeNull();
        const closeButton = wrapper.getByLabelText("Nachricht schliessen");
        expect(closeButton).toBeVisible();
        waitFor(() => {
            expect(closeButton).toHaveFocus();
        });
    });

    it("has role=alert if the FlashType is Error", async () => {
        const wrapper = render(Flash, {
            props: {},
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const emitter = useEmitter();
        const flashData: FlashData = {
            type: FlashType.Error,
            message: "A message",
        };

        emitter.emit("flash", flashData);
        await waitFor(() => expect(wrapper.getByTestId("flash")).toBeVisible());

        const container = wrapper.getByTestId("flash");
        expect(container).toHaveAttribute("role", "alert");
    });

    it("does display an action button if actionMessage and actionEvent are set", async () => {
        const wrapper = render(Flash, {
            props: {},
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const emitter = useEmitter();
        const actionMessage = "My action message";
        const flashData: FlashData = {
            type: FlashType.Success,
            message: "A message",
            actionEvent: "retry-save",
            actionMessage,
        };

        emitter.emit("flash", flashData);

        await waitFor(() => expect(wrapper.getByRole("status")).toBeVisible());
        const actionButton = wrapper.queryByTestId("flash.action");
        expect(actionButton).toBeVisible();
        expect(actionButton).toHaveTextContent(actionMessage);
        waitFor(() => {
            expect(actionButton).toHaveFocus();
        });
    });

    it("emits the action event when the action button is clicked", async () => {
        const user = userEvent.setup();
        const wrapper = render(Flash, {
            props: {},
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const emitter = useEmitter();
        vi.spyOn(emitter, "emit");
        const actionMessage = "My action message";
        const actionEvent = "retry-save";
        const flashData: FlashData = {
            type: FlashType.Success,
            message: "A message",
            actionEvent,
            actionMessage,
        };

        emitter.emit("flash", flashData);
        await waitFor(() => expect(wrapper.getByRole("status")).toBeVisible());
        user.click(wrapper.getByTestId("flash.action"));

        await waitFor(() =>
            expect(emitter.emit).toHaveBeenCalledWith(actionEvent)
        );
    });

    it("disappears after the close button is clicked", async () => {
        const user = userEvent.setup();
        const wrapper = render(Flash, {
            props: {},
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const emitter = useEmitter();
        const flashData: FlashData = {
            type: FlashType.Success,
            message: "A message",
        };
        emitter.emit("flash", flashData);
        await waitFor(() => expect(wrapper.getByRole("status")).toBeVisible());
        await user.click(wrapper.getByLabelText("Nachricht schliessen"));
        expect(wrapper.queryByTestId("flash")).toBeNull();
    });
});
