<template>
    <ul ref="list">
        <li
            v-for="(info, index) in infos"
            :key="index"
            ref="list"
            tabindex="-1"
        >
            <Info><span v-html="info" /></Info>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { useEmitter } from "@/composables/useEmitter";
import { onMounted, ref, Ref } from "vue";
import Info from "./Info.vue";

const props = defineProps({
    infos: {
        type: Object,
        required: true,
    },
});

const emitter = useEmitter();

const list: Ref<HTMLUListElement | undefined> = ref();

onMounted(() => {
    list.value
        ?.querySelectorAll("button")
        .forEach((button: HTMLButtonElement) => {
            button.addEventListener("click", (event: Event) => {
                const button = event.currentTarget as HTMLButtonElement;
                const action = button?.dataset.action;
                if (action == "focus-category") {
                    const categoryId = button.dataset.category;
                    if (categoryId) {
                        emitter.emit(action, parseInt(categoryId));
                    }
                } else if (action == "focus-module") {
                    const moduleId = button.dataset.module;
                    if (moduleId) {
                        emitter.emit(action, moduleId);
                    }
                }
            });
        });
});
</script>

<style lang="scss" scoped></style>
