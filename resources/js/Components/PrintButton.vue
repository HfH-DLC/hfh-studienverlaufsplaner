<template>
    <div>
        <button
            class="p-2 flex items-center gap-1 hover:text-thunderbird-red"
            @click="print"
        >
            <PrinterIcon class="w-7 h-7" aria-hidden="true" /> Drucken
        </button>
    </div>
</template>

<script>
import { PrinterIcon } from "@heroicons/vue/outline";
export default {
    components: {
        PrinterIcon,
    },
    methods: {
        print() {
            window.print();
        },
    },
};
</script>

<style lang="scss" scoped></style>
