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
          label: "Import",
          href: `/admin/import`,
        },
        {
          label: "Studiengänge",
          href: `/admin/planers`,
        },
        {
          label: "Kategorien",
          href: `/admin/categories`,
        },
        {
          label: "Module",
          href: `/admin/modules`,
        },
        {
          label: "Regeln",
          href: `/admin/rules`,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>