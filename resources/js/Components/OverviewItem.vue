<template>
    <div>
        <h3 class="flex gap-x-4 bg-fantasy-pastel px-4 py-2">
            <div>
                {{ semester }}
            </div>
            <div>{{ dayTime }}</div>
        </h3>
        <div class="border-2 border-fantasy-pastel">
            <ul>
                <li
                    v-for="(module, index) in modules"
                    :key="index"
                    class="px-4 py-1"
                    :class="[index % 2 == 0 ? 'bg-white' : 'bg-fantasy-light']"
                >
                    {{ module }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

const props = defineProps({
    semester: {
        type: String,
        required: true,
    },
    dayTime: {
        type: String,
        required: true,
    },
    modules: {
        type: Array as PropType<Array<String>>,
        required: true,
    },
});
</script>

<style scoped></style>
