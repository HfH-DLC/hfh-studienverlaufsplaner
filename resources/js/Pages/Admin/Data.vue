<template>
  <div class="p-4">
    <h1 class="text-xl">Daten</h1>
    <form @submit.prevent="submit" class="mt-4">
      <div class="mt-2">
        <label for="file" class="block text-sm">Datei</label>
        <input
          type="file"
          accept="application/json"
          name="file"
          id="file"
          @change="setFile"
          required
        />
      </div>
      <HfHButton type="submit" class="mt-4">Importieren</HfHButton>
    </form>
  </div>
</template>

<script>
import HfHButton from "../../Components/HfHButton.vue";
import AdminLayoutVue from "../../Layouts/AdminLayout.vue";
export default {
  layout: AdminLayoutVue,
  components: {
    HfHButton,
  },
  data() {
    return {
      form: this.$inertia.form({
        import: null,
      }),
    };
  },
  methods: {
    setFile(e) {
      const files = e.target.files;
      if (files.length > 0) {
        this.form.import = e.target.files[0];
      } else {
        this.form.import = null;
      }
    },
    submit() {
      this.form.post(`/admin/data`, {
        onSuccess: () => this.form.reset(),
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
