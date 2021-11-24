<template>
  <nav class="flex justify-between items-end p-4 border-b border-gray-300">
    <Link href="/"><h1 class="text-3xl">Studienverlaufsplaner</h1></Link>
    <ul class="flex gap-8">
      <li>
        <NavLink href="/login" :active="$page.component === 'Login'"
          >Login</NavLink
        >
      </li>
      <li>
        <NavLink
          href="/logout"
          method="post"
          as="button"
          class="text-blue-600 hover:underline"
          >Logout</NavLink
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