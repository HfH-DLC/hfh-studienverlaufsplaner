<template>
  <div class="html-content" v-html="finalContent"></div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  computed: {
    finalContent() {
      let content = this.content;
      this.variables.forEach((variable) => {
        const regex = new RegExp(`{{\\s*${variable.key}\\s*}}`, "g");
        content = content.replaceAll(regex, variable.value);
      });
      return content;
    },

    variables() {
      return [{ key: "date", value: new Date().toLocaleDateString() }];
    },
  },
};
</script>

<style lang="scss">
.html-content {
  a {
    @apply text-thunderbird-red hover:text-thunderbird-red-light hover:underline focus:text-thunderbird-red-light focus:underline;
  }
  p:not(:first-child) {
    @apply mt-4;
  }
  h3 {
    @apply text-xl mt-3;
  }
}
</style>