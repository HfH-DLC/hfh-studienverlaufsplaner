<template>
    <div class="flex-1 flex justify-center items-center p-4 text-center">
        <div>
            <h1 class="text-3xl">{{ title }}</h1>
            <div class="text-lg">{{ description }}</div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        status: { type: Number, required: true },
    },
    computed: {
        title() {
            return {
                503: "503: Service Unavailable",
                500: "500: Server Error",
                404: "404: Page Not Found",
                403: "403: Forbidden",
            }[this.status];
        },
        description() {
            return {
                503: "Sorry, we are doing some maintenance. Please check back soon.",
                500: "Whoops, something went wrong on our servers.",
                404: "Sorry, the page you are looking for could not be found.",
                403: "Sorry, you are forbidden from accessing this page.",
            }[this.status];
        },
    },
};
</script>
