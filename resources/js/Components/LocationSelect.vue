<template>
    <div>
        <fieldset class="flex items-center gap-x-8">
            <legend class="hfh-label">Standorte</legend>
            <div
                v-for="(option, index) in store.selectableLocations"
                :key="index"
            >
                <label class="flex items-center gap-x-4"
                    ><input
                        type="checkbox"
                        :value="option.id"
                        :checked="option.checked"
                        @change="onChange($event, index)"
                        :disabled="
                            store.readOnly ||
                            (option.checked &&
                                store.checkedLocations.length == 1)
                        "
                        class="accent-thunderbird-red w-5 h-5"
                    />
                    {{ option.name }}</label
                >
            </div>
        </fieldset>
    </div>
</template>

<script lang="ts" setup>
import { useScheduleStore } from "../Store/schedule";

const store = useScheduleStore();

const onChange = (event: Event, index: number) => {
    if (event.currentTarget) {
        const checked: boolean = (<HTMLInputElement>event.currentTarget)
            .checked;
        store.setLocationChecked(index, checked);
    }
};
</script>

<style lang="scss" scoped></style>
