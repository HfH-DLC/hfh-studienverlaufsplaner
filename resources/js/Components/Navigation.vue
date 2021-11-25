<template>
  <nav class="flex justify-between items-end p-4 border-b border-gray-300">
    <Link href="/" class="flex-1"
      ><h1 class="text-3xl">Studienverlaufsplaner</h1></Link
    >
    <div v-if="$page.props.auth">
      Willkommen, {{ $page.props.auth.user.name }}
    </div>
    <ul class="flex gap-8 flex-1 justify-end">
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