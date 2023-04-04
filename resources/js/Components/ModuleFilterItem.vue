<template>
    <div v-if="modules.length > 0" class="border-2 border-fantasy-plain">
        <h3 class="flex gap-x-4 bg-fantasy-light text-black px-4 py-2">
            <div>
                {{ semester }}
            </div>
            <div>{{ `${day}${time.toLocaleLowerCase()}` }}</div>
        </h3>
        <div class="border-t-2 border-fantasy-light border-t-fantasy-plain">
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
    day: {
        type: String,
        required: true,
    },
    time: {
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
