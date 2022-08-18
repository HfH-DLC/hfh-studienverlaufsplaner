<template>
  <main class="p-4 max-w-6xl mx-auto">
    <h1 class="text-3xl mt-4 mb-2">Studienschwerpunkte</h1>
    <form @submit.prevent="save" class="mt-4">
      <div>
        <label for="firstFocus">Erster Studienschwerpunkt</label>
        <HfHSelect
          id="firstFocus"
          v-model="form.firstFocusSelection.focus"
          :required="true"
          :options="firstOptions"
          @update:modelValue="clearSelectedModules(form.firstFocusSelection)"
        />
      </div>
      <div v-if="firstFocus">
        <div v-if="firstFocus.requiredNumberOfOptionalModules > 0">
          <label for="firstFocusModules">
            Wählen Sie
            {{ firstFocus.requiredNumberOfOptionalModules }}
            {{
              firstFocus.requiredNumberOfOptionalModules == 1
                ? "Pflichtmodul"
                : "Pflichtmodule"
            }}:
          </label>
          <div
            v-for="module in firstFocus.optionalModules"
            :key="module.id"
            class="mb-1"
          >
            <input
              type="checkbox"
              :id="`${firstFocus.id}-${module.id}`"
              :value="module.id"
              v-model="form.firstFocusSelection.selectedRequiredModules"
              :disabled="
                (form.firstFocusSelection.selectedRequiredModules.length >=
                  firstFocus.requiredNumberOfOptionalModules &&
                  !form.firstFocusSelection.selectedRequiredModules.includes(
                    module.id
                  )) ||
                form.secondFocusSelection.selectedRequiredModules.includes(
                  module.id
                )
              "
            />
            <label class="ml-2" :for="`${firstFocus.id}-${module.id}`"
              >{{ module.id }} {{ module.name }}</label
            >
          </div>
        </div>
      </div>
      <ErrorList :errors="getErrors('firstFocus')" />
      <div class="mt-4">
        <label for="secondFocus">Zweiter Studienschwerpunkt (Optional)</label>
        <HfHSelect
          id="secondFocus"
          v-model="form.secondFocusSelection.focus"
          :options="secondOptions"
          @update:modelValue="clearSelectedModules(form.secondFocusSelection)"
        />
      </div>
      <div v-if="secondFocus">
        <div v-if="secondFocus.requiredNumberOfOptionalModules > 0">
          <label for="secondFocusModules">
            Wählen Sie
            {{ secondFocus.requiredNumberOfOptionalModules }}
            {{
              secondFocus.requiredNumberOfOptionalModules == 1
                ? "Pflichtmodul"
                : "Pflichtmodule"
            }}:
          </label>
          <div
            v-for="module in secondFocus.optionalModules"
            :key="module.id"
            class="mb-1"
          >
            <input
              type="checkbox"
              :id="`${secondFocus.id}-${module.id}`"
              :value="module.id"
              v-model="form.secondFocusSelection.selectedRequiredModules"
              :disabled="
                (form.secondFocusSelection.selectedRequiredModules.length >=
                  secondFocus.requiredNumberOfOptionalModules &&
                  !form.secondFocusSelection.selectedRequiredModules.includes(
                    module.id
                  )) ||
                form.firstFocusSelection.selectedRequiredModules.includes(
                  module.id
                )
              "
            />
            <label class="ml-2" :for="`${secondFocus.id}-${module.id}`"
              >{{ module.id }} {{ module.name }}</label
            >
          </div>
        </div>
      </div>
      <ErrorList :errors="getErrors('secondFocus')" />
      <HfHButton class="w-full mt-3">Weiter</HfHButton>
    </form>
  </main>
</template>

<script>
import ErrorList from "../Components/ErrorList.vue";
import HfHSelect from "../Components/HfHSelect.vue";
import HfHButton from "../Components/HfHButton.vue";
import { pluralize } from "../helpers";
import { useValidation } from "../Composables/useValidation";
export default {
  components: {
    ErrorList,
    HfHSelect,
    HfHButton,
  },
  props: {
    fociResource: {
      type: Object,
      required: true,
    },
    planResource: {
      type: Object,
      required: true,
    },
    planerSlug: {
      type: String,
      required: true,
    },
  },
  setup() {
    return useValidation();
  },
  data() {
    const firstFocusSelection = this.planResource.data.focusSelections.find(
      (focusSelection) => focusSelection.position === 0
    );
    const secondFocusSelection = this.planResource.data.focusSelections.find(
      (focusSelection) => focusSelection.position === 1
    );
    return {
      form: this.$inertia.form("FocusSelection", {
        firstFocusSelection: {
          position: 0,
          focus: firstFocusSelection ? firstFocusSelection.focus.id : "",
          selectedRequiredModules: firstFocusSelection
            ? firstFocusSelection.selectedRequiredModules.map(
                (module) => module.id
              )
            : [],
        },
        secondFocusSelection: {
          position: 1,
          focus: secondFocusSelection ? secondFocusSelection.focus.id : "",
          selectedRequiredModules: secondFocusSelection
            ? secondFocusSelection.selectedRequiredModules.map(
                (module) => module.id
              )
            : [],
        },
      }),
    };
  },
  computed: {
    focusOptions() {
      return this.fociResource.data.map((focus) => ({
        value: focus.id,
        label: focus.name,
      }));
    },
    firstOptions() {
      return this.focusOptions.filter(
        (option) => option.value !== this.form.secondFocusSelection.focus
      );
    },
    secondOptions() {
      return this.focusOptions.filter(
        (option) => option.value !== this.form.firstFocusSelection.focus
      );
    },
    firstFocus() {
      return this.fociResource.data.find(
        (focus) => focus.id === this.form.firstFocusSelection.focus
      );
    },
    secondFocus() {
      return this.fociResource.data.find(
        (focus) => focus.id === this.form.secondFocusSelection.focus
      );
    },
  },
  methods: {
    save() {
      this.validate();
      if (!this.isValid) {
        return;
      }

      this.form
        .transform((data) => {
          const focusSelections = [data.firstFocusSelection];
          if (data.secondFocusSelection.focus) {
            focusSelections.push(data.secondFocusSelection);
          }
          return { focusSelections };
        })
        .put(
          `/${this.planerSlug}/${this.planResource.data.slug}/schwerpunkte`,
          {
            onSuccess: () => this.form.reset(),
          }
        );
    },
    clearSelectedModules(formSelection) {
      formSelection.selectedRequiredModules = [];
    },

    getRequiredNumberErrorMessage(requiredNumber) {
      return `Bitte wählen Sie exakt ${requiredNumber} ${pluralize(
        requiredNumber,
        "Pflichtmodul",
        "Pflichtmodule"
      )}.`;
    },
    validate() {
      this.resetErrors();
      if (!this.form.firstFocusSelection.focus) {
        this.addError(
          "firstFocus",
          "Bitte wählen Sie Ihren ersten Studienschwerpunkt."
        );
      } else {
        if (
          this.form.firstFocusSelection.selectedRequiredModules.length !=
          this.firstFocus.requiredNumberOfOptionalModules
        ) {
          this.addError(
            "firstFocus",
            this.getRequiredNumberErrorMessage(
              this.firstFocus.requiredNumberOfOptionalModules
            )
          );
        }
      }

      if (
        this.secondFocus &&
        this.secondFocus.requiredNumberOfOptionalModules > 0 &&
        this.form.secondFocusSelection.selectedRequiredModules.length !=
          this.secondFocus.requiredNumberOfOptionalModules
      ) {
        this.addError(
          "secondFocus",
          this.getRequiredNumberErrorMessage(
            this.secondFocus.requiredNumberOfOptionalModules
          )
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>