<template>
  <Head>
    <title></title>
  </Head>
  <div class="min-h-screen flex flex-col">
    <header>
      <AdminNavigation logoHref="" :links="links" />
    </header>
    <main class="flex-1 flex flex-col">
      <Flash class="fixed top-4 left-1/2 -translate-x-1/2" />
      <slot />
    </main>
  </div>
</template>

<script>
import AdminNavigation from "../Components/Admin/AdminNavigation.vue";
import Flash from "../Components/Flash.vue";
export default {
  components: {
    AdminNavigation,
    Flash,
  },
  data() {
    return {
      links: [
        {
          label: "Daten",
          href: `/admin/data`,
        },
        {
          label: "Templates",
          href: `/admin/templates`,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
