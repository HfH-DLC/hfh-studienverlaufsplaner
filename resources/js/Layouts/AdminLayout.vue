<template>
  <Head>
    <title></title>
  </Head>
  <div class="min-h-screen flex flex-col">
    <header>
      <Navigation logoHref="" :links="links" />
    </header>
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>

<script>
import Navigation from "../Components/Navigation.vue";
export default {
  components: {
    Navigation,
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