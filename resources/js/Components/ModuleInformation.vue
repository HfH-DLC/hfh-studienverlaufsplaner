<template>
    <div v-if="selectedModule" aria-live="polite">
        <button @click="deselectModule" class="back-button mb-4" ref="back">
            Zurück
        </button>
        <h2 class="text-xl">{{ selectedModule.name }}</h2>
        <MessageList
            class="mt-4 space-y-2"
            v-if="selectedModule.errors.length > 0"
            :messages="selectedModule.errors"
        />
        <dl class="mt-4">
            <dt class="hfh-label">Modulnummer</dt>
            <dd>{{ selectedModule.id }}</dd>
            <template v-if="selectedModule.prerequisiteGroups.length > 0">
                <dt class="hfh-label mt-4">Voraussetzungen</dt>
                <dd>
                    <ul class="grid gap-y-2">
                        <template
                            v-for="prerequisiteGroup in selectedModule.prerequisiteGroups"
                        >
                            <template v-if="prerequisiteGroup.requiredCount">
                                <li>
                                    {{ prerequisiteGroup.requiredCount }} der
                                    Module
                                    {{
                                        joinStrings(
                                            prerequisiteGroup.prerequisiteIds,
                                            ", "
                                        )
                                    }}
                                </li>
                            </template>
                            <template v-else>
                                <li
                                    v-for="prerequisite in prerequisiteGroup.prerequisiteIds"
                                >
                                    {{ prerequisite }}
                                </li>
                            </template>
                        </template>
                    </ul>
                </dd>
            </template>
            <dt class="hfh-label mt-4">Kreditpunkte</dt>
            <dd>{{ selectedModule.ects }}</dd>
        </dl>
    </div>
</template>

<script lang="ts" setup>
import { joinStrings } from "@/helpers";
import { useScheduleStore } from "../Store/schedule";
import MessageList from "./MessageList.vue";
import { ScheduleModule } from "@/types";
import { PropType } from "vue";

const props = defineProps({
    selectedModule: {
        type: Object as PropType<ScheduleModule | null>,
        default: null,
    },
});
const { deselectModule } = useScheduleStore();
</script>

<style lang="scss" scoped>
.back-button {
    position: relative;
    cursor: pointer;
    background: var(--c-black);
    color: var(--c-white);
    border: none;
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.625rem;
    min-height: 3.25rem;
    text-align: left;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 1rem;
        margin: auto;
        background-image: var(--i-carret--thin);
        display: block;
        transform-origin: center center;
        background-position: 0 0;
        background-repeat: no-repeat;
        background-size: cover;
        transform: rotate(90deg);
        width: 1.25rem;
        height: 0.8125rem;
    }
}
</style>
