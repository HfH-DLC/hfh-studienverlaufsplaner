<template>
    <nav class="flex justify-end items-end p-4 border-b border-gray-300">
        <ul class="flex gap-8 justify-end">
            <li v-for="(link, index) in links" :key="index">
                <NavLink
                    :href="link.href"
                    class="text-blue-600 hover:underline"
                    :active="$page.url === link.href"
                    >{{ link.label }}</NavLink
                >
            </li>
            <li v-if="$page.props.auth">
                <button @click="logout" class="text-blue-600 hover:underline">
                    Logout
                </button>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts" setup>
import { router } from "@inertiajs/vue3";
import { Link } from "@/types";
import { PropType } from "vue";
import NavLink from "./NavLink.vue";

const props = defineProps({
    links: {
        type: Array as PropType<Array<Link>>,
        default: [],
    },
});
const logout = () => {
    router.post("/admin/logout");
};
</script>

<style lang="scss" scoped></style>
