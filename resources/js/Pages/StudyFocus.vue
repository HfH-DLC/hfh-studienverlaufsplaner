<template>
  <main>
    <h1>Studienschwerpunkte</h1>
    <form @submit.prevent="save" class="mt-4 w-64 mx-auto">
      <label for="firstFocus">Erster Studienscherpunkt</label>
      <HfHSelect
        name="firstFocus"
        id="firstFocus"
        v-model="firstFocus"
        :required="true"
        :options="firstOptions"
      />
      <label for="secondFocus">Zweiter Studienscherpunkt</label>
      <HfHSelect
        name="secondFocus"
        id="secondFocus"
        v-model="secondFocus"
        :options="secondOptions"
      />
      <HfHButton class="w-full mt-3">Weiter</HfHButton>
    </form>
  </main>
</template>

<script>
import HfHSelect from "../Components/HfHSelect.vue";
import HfHButton from "../Components/HfHButton.vue";
export default {
  components: {
    HfHSelect,
    HfHButton,
  },
  data() {
    return {
      focusOptions: [
        { label: "Studienschwerpunkt Lernen", value: "SSP_L" },
        { label: "Studienschwerpunkt Verhalten", value: "SSP_V" },
        { label: "Studienschwerpunkt Geistige Entwicklung", value: "SSP_gE" },
      ],
      firstFocus: "",
      secondFocus: "",
    };
  },
  computed: {
    firstOptions() {
      return this.focusOptions.filter((option) => {
        if (this.secondFocus) {
          if (this.secondFocus == option.value) {
            return false;
          }
        }
        return true;
      });
    },
    secondOptions() {
      return this.focusOptions.filter((option) => {
        if (this.firstFocus) {
          if (this.firstFocus == option.value) {
            return false;
          }
        }
        return true;
      });
    },
  },
  methods: {
    save() {
      //todo save
    },
  },
};
</script>

<style lang="scss" scoped>
</style>