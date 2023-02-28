import { FlashData } from "@/types";
import mitt, { Emitter } from "mitt";

export type EmitterEvents = {
    flash: FlashData;
    "retry-save": undefined;
    "start-tour": undefined;
    "focus-module": string;
    "focus-category": number;
};

const emitter: Emitter<EmitterEvents> = mitt();

export function useEmitter() {
    return emitter;
}
