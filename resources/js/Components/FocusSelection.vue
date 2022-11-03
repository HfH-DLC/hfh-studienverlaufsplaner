<template>
  <div class="flex items-center gap-x-8">
    <div class="max-w-64">
      <HfhSelect
        id="first-focus"
        name="first-focus"
        label="Erster Studienschwerpunkt"
        :required="true"
        :options="firstOptions"
        v-model="firstFocusId"
        defaultOption="Bitte auswählen..."
        :disabled="readOnly"
      />
    </div>
    <div class="max-w-64">
      <HfhSelect
        id="second-focus"
        name="second-focus"
        label="Zweiter Studienschwerpunkt (Optional)"
        defaultOption="Bitte auswählen..."
        :options="secondOptions"
        v-model="secondFocusId"
        :disabled="readOnly"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { HfhSelect } from "@hfh-dlc/hfh-styleguide";
export default {
  components: {
    HfhSelect,
  },
  computed: {
    ...mapState("schedule", ["focusSelections", "foci", "readOnly"]),
    firstFocusId: {
      get() {
        const focusSelection = this.focusSelections.find(
          (focusSelection) => focusSelection.position == 0
        );
        if (focusSelection && focusSelection.focus) {
          return focusSelection.focus.id;
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
        if (focusSelection && focusSelection.focus) {
          return focusSelection.focus.id;
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
