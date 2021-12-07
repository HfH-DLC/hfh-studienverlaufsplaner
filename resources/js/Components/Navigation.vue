<template>
  <nav class="flex justify-between items-end p-4 border-b border-gray-300">
    <Link href="/"><h1 class="text-3xl">Studienverlaufsplaner</h1></Link>
    <ul class="flex gap-8 justify-end">
      <li v-if="$page.props.auth">
        <a href="/shibboleth-logout" class="text-blue-600 hover:underline"
          >Logout</a
        >
      </li>
    </ul>
  </nav>
</template>

<script>
import NavLink from "../Components/NavLink.vue";
export default {
  components: {
    NavLink,
  },
};
</script>

<style lang="scss" scoped>
</style>