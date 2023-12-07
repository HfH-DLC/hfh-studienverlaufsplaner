<template>
    <div
        class="info-message text-hfh-turqoise border border-hfh-turqoise rounded-md p-1 w-fit flex items-top"
    >
        <InformationCircleIcon class="inline-block w-5 h-5 shrink-0 mt-1.5" />
        <span class="ml-1">
            <slot></slot>
        </span>
    </div>
</template>

<script lang="ts" setup>
import { InformationCircleIcon } from "@heroicons/vue/24/outline";
</script>

<style lang="scss"></style>
