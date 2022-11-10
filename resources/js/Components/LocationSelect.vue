<template>
  <div>
    <fieldset class="flex items-center gap-x-8">
      <legend class="hfh-label">Standorte</legend>
      <div v-for="(option, index) in selectableLocations" :key="index">
        <label class="flex items-center gap-x-4"
          ><input
            type="checkbox"
            :value="option.id"
            :checked="option.checked"
            @change="onChange($event, index)"
            :disabled="
              readOnly || (option.checked && checkedLocations.length == 1)
            "
            class="accent-thunderbird-red w-5 h-5"
          />
          {{ option.name }}</label
        >
      </div>
    </fieldset>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("schedule", ["readOnly"]),
    ...mapGetters("schedule", ["selectableLocations", "checkedLocations"]),
  },
  methods: {
    ...mapActions("schedule", ["setLocationChecked"]),
    onChange(event, index) {
      const checked = event.currentTarget.checked;
      this.setLocationChecked({
        index,
        checked,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>