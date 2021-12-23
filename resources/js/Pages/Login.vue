<template>
  <Head title="Login" />
  <div class="p-4">
    <div role="alert" v-if="errors">
      <ul>
        <li v-for="entry in Object.entries(errors)" :key="entry[0]">
          <Error class="mx-auto">
            <a :href="`#${entry[0]}`" id="`${key}_error`">
              {{ entry[1] }}
            </a>
          </Error>
        </li>
      </ul>
    </div>
    <form @submit.prevent="submit" class="max-w-xs mx-auto mt-8">
      <div class="mt-4">
        <label for="email" class="block mb-2 text-sm uppercase text-gray-600"
          >Email</label
        >
        <input
          v-model="form.email"
          type="text"
          name="email"
          id="email"
          class="w-full p-2 rounded shadow-inner border border-gray-300"
          required
        />
      </div>
      <div class="mt-6">
        <label for="password" class="block-mb-2 text-sm uppercase text-gray-600"
          >Passwort</label
        >
        <input
          v-model="form.password"
          type="password"
          name="password"
          id="password"
          class="w-full p-2 rounded shadow-inner border border-gray-300"
          required
        />
      </div>
      <button
        type="submit"
        class="mt-6 w-full rounded p-2 border bg-gray-50 border-gray-300"
        :disabled="form.processing"
      >
        Anmelden
      </button>
    </form>
  </div>
</template>

<script>
import Error from "../Components/Error.vue";
export default {
  components: {
    Error,
  },
  props: {
    errors: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      form: this.$inertia.form({
        email: "",
        password: "",
      }),
    };
  },
  methods: {
    submit() {
      this.form.post("/admin/login");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>