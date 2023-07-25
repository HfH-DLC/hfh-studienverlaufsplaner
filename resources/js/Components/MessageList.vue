<template>
    <ul ref="list">
        <li v-for="(message, index) in messages" :key="index" tabindex="-1">
            <component :is="getComponent(message.type)">
                <component
                    v-if="message.component && message.labelProps"
                    :is="message.component"
                    ref="label"
                    v-bind="message.labelProps"
                />
                <div v-else-if="message.label" v-html="message.label"></div>
            </component>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { Message, MessageType } from "@/types";
import { PropType } from "vue";

import Error from "./Error.vue";
import Info from "./Info.vue";

const props = defineProps({
    messages: {
        type: Array as PropType<Array<Message>>,
        required: true,
    },
});

const getComponent = (type: MessageType) => {
    if (type === MessageType.Error) {
        return Error;
    } else if (type === MessageType.Info) {
        return Info;
    }
    console.log("No matching component for type ", type);
    return "div";
};
</script>

<style lang="scss" scoped></style>
