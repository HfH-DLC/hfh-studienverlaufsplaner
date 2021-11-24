<template>
  <Head title="Register" />
  <div class="p-4">
    <form @submit.prevent="submit" class="max-w-xs mx-auto mt-8">
      <div>
        <label for="name" class="block mb-2 text-sm uppercase text-gray-600"
          >Benutzername</label
        >
        <input
          v-model="form.name"
          type="text"
          name="name"
          id="name"
          class="w-full p-2 rounded shadow-inner border border-gray-300"
          required
        />
      </div>
      <div>
        <label for="email" class="block mb-2 text-sm uppercase text-gray-600"
          >E-Mail</label
        >
        <input
          v-model="form.email"
          type="email"
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
        Registrieren
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: this.$inertia.form({
        name: "",
        email: "",
        password: "",
      }),
    };
  },
  methods: {
    submit() {
      this.form.post("/register");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>