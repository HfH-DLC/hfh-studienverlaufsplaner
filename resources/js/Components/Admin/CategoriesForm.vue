<template>
  <form @submit.prevent="processForm" class="mt-2">
    <label for="name" class="block uppercase text-sm">Name</label>
    <input
      ref="firstInput"
      type="text"
      id="name"
      v-model="form.name"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      :aria-describedby="form.errors.name && 'error-name'"
    />
    <Error v-if="form.errors.name" id="error-name" class="mt-2">
      {{ form.errors.name }}
    </Error>
    <label for="required-number" class="block uppercase text-sm mt-3"
      >Anzahl benötigter Module</label
    >
    <input
      type="number"
      id="required-number"
      v-model="form.requiredNumber"
      class="w-full block border border-gray-600 rounded shadow-inner p-1"
      :aria-describedby="form.errors.name && 'error-required-number'"
    />
    <Error
      v-if="form.errors.requiredNumber"
      id="error-required-number"
      class="mt"
    >
      {{ form.errors.requiredNumber }}
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
    editedCategory: {
      type: Object,
      default: null,
    },
    planerSlug: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.setCategory();
  },
  data() {
    return {
      form: this.$inertia.form({
        name: null,
        requiredNumber: null,
      }),
    };
  },
  methods: {
    setCategory() {
      this.form.name = this.editedCategory.name;
      this.form.requiredNumber = this.form.requiredNumber;
      this.$nextTick(() => {
        this.$refs.firstInput.focus();
      });
    },
    processForm() {
      if (this.editedCategory) {
        this.editCategory();
      } else {
        this.createCategory();
      }
    },
    createCategory() {
      this.form.post(`/admin/planers/${this.planerSlug}/categories`, {
        onSuccess: () => this.$emit("success"),
      });
    },
    editCategory() {
      this.form.put(
        `/admin/planers/${this.planerSlug}/categories/${this.editedCategory.id}`,
        {
          onSuccess: () => this.$emit("success"),
        }
      );
    },
  },
  watch: {
    editedCategory(newValue, oldValue) {
      this.setCategory(newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>