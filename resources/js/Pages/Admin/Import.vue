<template>
  <div class="p-4">
    <h2 class="text-xl">Import</h2>
    <form @submit.prevent="submit" class="mt-4">
      <div>
        <label for="year" class="block uppercase text-sm">Jahr</label>
        <input
          type="number"
          v-model="form.year"
          name="year"
          id="year"
          required
          class="block border border-gray-600 rounded shadow-inner p-1"
        />
      </div>
      <div class="mt-2">
        <label for="file" class="block uppercase text-sm">Datei</label>
        <input type="file" name="file" id="file" @change="setFile" required />
      </div>
      <Button type="submit" class="mt-4">Importieren</Button>
    </form>
  </div>
</template>

<script>
import Button from "../../Components/Button.vue";
import AdminLayoutVue from "../../Layouts/AdminLayout.vue";
export default {
  layout: AdminLayoutVue,
  components: {
    Button,
  },
  data() {
    return {
      form: this.$inertia.form({
        year: null,
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
      this.form.post(`/admin/import`, {
        onSuccess: () => form.reset(),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>