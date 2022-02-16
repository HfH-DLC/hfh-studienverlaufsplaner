<template>
  <nav class="flex justify-between items-end p-4 border-b border-gray-300">
    <h1 class="text-3xl">
      <Link href="/admin">Studienverlaufsplaner</Link>
    </h1>
    <ul class="flex gap-8 justify-end">
      <li v-for="(link, index) in links" :key="index">
        <NavLink
          :href="link.href"
          class="text-blue-600 hover:underline"
          :active="$page.url === link.href"
          >{{ link.label }}</NavLink
        >
      </li>
      <li v-if="$page.props.auth">
        <button @click="logout" class="text-blue-600 hover:underline">
          Logout
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import NavLink from "../NavLink.vue";
export default {
  components: {
    NavLink,
  },
  props: {
    links: {
      type: Array,
      default: [],
    },
  },
  methods: {
    logout() {
      this.$inertia.post("/admin/logout");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>