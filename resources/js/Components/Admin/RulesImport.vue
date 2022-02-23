<template>
  <form @submit.prevent="submit" class="mt-4">
    <div>
      <label for="file" class="block uppercase text-sm">Datei</label>
      <input
        type="file"
        accept="application/json"
        name="file"
        id="file"
        @input="setFile"
        required
      />
    </div>
    <Button type="submit" class="mt-4">Importieren</Button>
  </form>
</template>

<script>
import flashTypes from "../../flashTypes";
import Button from "../Button.vue";
export default {
  components: {
    Button,
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
      this.form.post(`/admin/rules/import`, {
        onSuccess: () => {
          this.form.reset();
          this.$emitter.emit("flash", {
            message: "Regeln erfolgreich importiert.",
            type: flashTypes.SUCCESS,
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>