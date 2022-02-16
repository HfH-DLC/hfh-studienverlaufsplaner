<template>
  <div>
    <h2>Import</h2>
    <form @submit.prevent="submit">
      <input type="text" v-model="form.year" required />
      <input type="file" name="file" id="file" @change="setFile" required />
      <Button type="submit">Importieren</Button>
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
      this.form.post(`/admin/import`);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>