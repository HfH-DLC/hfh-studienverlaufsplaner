<template>
    <div class="mb-4 border border-gray-300 rounded">
        <button
            :id="`accordion-${this.uid}-toggle`"
            class="flex justify-between items-center w-full px-4 py-2 text-left bg-gray-50 rounded-t focus:outline-none focus:ring-2 focus:ring-indigo-600"
            :class="{ 'border-b': open, 'rounded-b': !open }"
            @click="onToggle"
            :aria-expanded="open"
            :aria-controls="`accordion-${this.uid}-content`"
        >
            <slot name="title"></slot>
        </button>
        <div
            :id="`accordion-${this.uid}-content`"
            v-if="open"
            role="region"
            :aria-describedby="`accordion-${this.uid}-toggle`"
            class="p-4"
        >
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
import { v4 } from "uuid";
export default {
    props: {
        open: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["opened", "closed"],
    data() {
        return {
            uid: v4(),
        };
    },
    methods: {
        onToggle() {
            if (!this.open) {
                this.$emit("opened");
            } else {
                this.$emit("closed");
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
