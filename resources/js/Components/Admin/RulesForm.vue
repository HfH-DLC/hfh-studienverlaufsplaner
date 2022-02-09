<template>
  <form @submit.prevent="processForm" class="mt-2">
    <label for="type" class="block uppercase text-sm">Typ</label>
    <select
      ref="firstInput"
      v-model="form.type"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      required
      :aria-describedby="form.errors.type && 'error-type'"
    >
      <option disabled value="">Bitte wählen...</option>
      <option :value="type" v-for="type in types" :key="type">
        {{ type }}
      </option>
    </select>
    <Error v-if="form.errors.type" id="error-type" class="mt-2">
      {{ form.errors.type }}
    </Error>
    <label for="params" class="block uppercase text-sm">Parameter</label>

    <Error v-if="form.errors.params" id="error-params" class="mt-2">
      {{ form.errors.params }}
    </Error>
    <Button type="submit" :disabled="form.processing" class="w-full mt-3">
      Speichern
    </Button>
  </form>
</template>

<script>
import Error from "../Error.vue";
import Button from "../Button.vue";
export default {
  emits: ["success"],
  components: {
    Button,
    Error,
  },
  props: {
    editedRule: {
      type: Object,
      default: null,
    },
    types: {
      type: Array,
      required: true,
    },
    planerSlug: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.setRule();
  },
  data() {
    return {
      form: this.$inertia.form({
        type: null,
        params: null,
      }),
    };
  },
  methods: {
    setRule() {
      if (this.editedRule) {
        this.form.type = this.editedRule.type;
        this.form.params = this.editedRule.params;
      }
      this.$nextTick(() => {
        this.$refs.firstInput.focus();
      });
    },
    processForm() {
      if (this.editedRule) {
        this.editRule();
      } else {
        this.createRule();
      }
    },
    createRule() {
      this.form.params = JSON.parse(this.form.params);
      this.form.post(`/admin/planers/${this.planerSlug}/rules`, {
        onSuccess: () => this.$emit("success"),
      });
    },
    editRule() {
      this.form.put(
        `/admin/planers/${this.planerSlug}/rules/${this.editedRule.id}`,
        {
          onSuccess: () => this.$emit("success"),
        }
      );
    },
  },
  watch: {
    editedRule(newValue, oldValue) {
      this.setRule(newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>