import InfoList from "@/Components/InfoList.vue";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/vue";
import { describe, vi } from "vitest";
import { EmitterEvents, useEmitter } from "@/composables/useEmitter";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { Emitter } from "mitt";

describe("InfoList", () => {
    let user: UserEvent, emitter: Emitter<EmitterEvents>;

    beforeEach(() => {
        vi.restoreAllMocks();
        user = userEvent.setup();
        emitter = useEmitter();
        vi.spyOn(emitter, "emit");
    });

    it("emits a focus-category message when a button with data-action='focus-category' in the slot content is clicked", async () => {
        const categoryId = 13;
        const wrapper = render(InfoList, {
            props: {
                infos: [
                    `<button data-action='focus-category' data-category='${categoryId}' data-testid='focus-category-button'>Click Me</button>`,
                ],
            },
        });

        await user.click(wrapper.getByRole("button"));

        expect(emitter.emit).toHaveBeenCalledWith("focus-category", categoryId);
    });

    it("emits a focus-module message when a button with data-action='focus-module' in the slot content is clicked", async () => {
        const moduleId = "MyModuleId";
        const wrapper = render(InfoList, {
            props: {
                infos: [
                    `<button data-action='focus-module' data-module='${moduleId}'>Click Me</button>`,
                ],
            },
        });

        await user.click(wrapper.getByRole("button"));

        expect(emitter.emit).toHaveBeenCalledWith("focus-module", moduleId);
    });

    it("emits no message when a button in the slot content without data-action is clicked", async () => {
        const wrapper = render(InfoList, {
            props: {
                infos: [`<button>Click Me</button>`],
            },
        });

        await user.click(wrapper.getByRole("button"));

        expect(emitter.emit).toBeCalledTimes(0);
    });

    it("emits no message when a button in the slot content with a different data-action is clicked", async () => {
        const wrapper = render(InfoList, {
            props: {
                infos: [`<button data-action="test-action">Click Me</button>`],
            },
        });

        await user.click(wrapper.getByRole("button"));

        expect(emitter.emit).toBeCalledTimes(0);
    });
});
