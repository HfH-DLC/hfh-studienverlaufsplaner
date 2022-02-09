<template>
  <Head>
    <title></title>
  </Head>
  <div class="min-h-screen flex flex-col">
    <header>
      <AdminNavigation
        logoHref=""
        :links="links"
        :planerSlug="planerSlug"
        :planerName="planerName"
      />
    </header>
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>

<script>
import AdminNavigation from "../Components/Admin/AdminNavigation.vue";
export default {
  components: {
    AdminNavigation,
  },
  props: {
    planerSlug: {
      type: String,
      required: true,
    },
    planerName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      links: [
        {
          label: "Kategorien",
          href: `/admin/planers/${this.planerSlug}/categories`,
        },
        {
          label: "Termine",
          href: `/admin/planers/${this.planerSlug}/timeslots`,
        },
        {
          label: "Module",
          href: `/admin/planers/${this.planerSlug}/modules`,
        },
        {
          label: "Regeln",
          href: `/admin/planers/${this.planerSlug}/rules`,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>