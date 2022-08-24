<template>
    <div class="p-4 flex items-center gap-x-8 border-b border-gray-300">
        <div>
            <label for="firstFocus">Erster Studienschwerpunkt</label>
            <HfHSelect
                id="firstFocus"
                :required="true"
                :options="firstOptions"
                v-model="firstFocusId"
                class="mt-1"
            />
        </div>
        <div>
            <label for="secondFocus"
                >Zweiter Studienschwerpunkt (Optional)</label
            >
            <HfHSelect
                id="secondFocus"
                :options="secondOptions"
                class="mt-2"
                v-model="secondFocusId"
            />
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import HfHSelect from "../Components/HfHSelect.vue";
export default {
    components: {
        HfHSelect,
    },
    computed: {
        ...mapState("schedule", ["focusSelections", "foci"]),
        firstFocusId: {
            get() {
                const focusSelection = this.focusSelections.find(
                    (focusSelection) => focusSelection.position == 0
                );
                if (focusSelection) {
                    return focusSelection.focusId;
                }
                return "";
            },
            set(focusId) {
                this.selectFocus({ position: 0, focusId });
            },
        },
        secondFocusId: {
            get() {
                const focusSelection = this.focusSelections.find(
                    (focusSelection) => focusSelection.position == 1
                );
                if (focusSelection) {
                    return focusSelection.focusId;
                }
                return "";
            },
            set(focusId) {
                this.selectFocus({ position: 1, focusId });
            },
        },
        options() {
            return this.foci.map((focus) => {
                return { label: focus.name, value: focus.id };
            });
        },
        firstOptions() {
            return this.options.filter(
                (option) => option.value !== this.secondFocusId
            );
        },
        secondOptions() {
            return this.options.filter(
                (option) => option.value !== this.firstFocusId
            );
        },
    },
    methods: {
        ...mapActions("schedule", ["selectFocus"]),
    },
};
</script>

<style lang="scss" scoped></style>
