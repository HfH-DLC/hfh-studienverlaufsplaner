<template>
  <Head title="Studienverlaufsplaner" />
  <div class="min-h-screen">
    <header>
      <Navigation />
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script>
import Navigation from "./Components/Navigation.vue";
export default {
  components: {
    Navigation,
  },
};
</script>

<style lang="scss" scoped>
</style>