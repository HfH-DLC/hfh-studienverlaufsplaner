<template>
    <ul>
        <li
            v-for="entity in entities"
            :key="entity.id"
            class="even:bg-gray-200 odd:bg-gray-100"
        >
            <div class="text-left p-2 flex justify-between items-center gap-12">
                <span
                    ><slot name="label" :entity="entity">{{
                        entity.name
                    }}</slot></span
                >
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        entities: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped></style>
