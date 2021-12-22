<template>
  <Head>
    <title></title>
  </Head>
  <div class="min-h-screen flex flex-col">
    <header>
      <AdminNavigation logoHref="" :links="links" />
    </header>
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>

<script>
import AdminNavigation from "../Components/AdminNavigation.vue";
export default {
  components: {
    AdminNavigation,
  },
  props: {
    planerSlug: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      links: [],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>