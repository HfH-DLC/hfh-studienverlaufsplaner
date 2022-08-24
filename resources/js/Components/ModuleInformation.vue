<template>
    <div v-if="selectedModule">
        <h2 class="text-xl">{{ selectedModule.name }}</h2>
        <ErrorList
            class="mt-4 space-y-2"
            v-if="selectedModule.infos.length > 0"
            :errors="selectedModule.infos"
        />
        <dl class="mt-4">
            <dt class="text-sm text-gray-500 font-bold uppercase">
                Modulnummer
            </dt>
            <dd>{{ selectedModule.id }}</dd>
            <template v-if="selectedModule.prerequisites.length > 0">
                <dt class="mt-2 text-sm text-gray-500 font-bold uppercase">
                    Voraussetzungen
                </dt>
                <dd>
                    <ul>
                        <li
                            v-for="prerequisite in selectedModule.prerequisites"
                            :key="prerequisite.id"
                        >
                            {{ prerequisite.id }} {{ prerequisite.name }}
                        </li>
                    </ul>
                </dd>
            </template>
            <dt class="mt-2 text-sm text-gray-500 font-bold uppercase">
                Kreditpunkte
            </dt>
            <dd>{{ selectedModule.ects }}</dd>
        </dl>
    </div>
</template>

<script>
import ErrorList from "../Components/ErrorList.vue";
export default {
    components: {
        ErrorList,
    },
    props: {
        selectedModule: {
            type: Object,
            default: null,
        },
    },
};
</script>

<style lang="scss" scoped></style>
