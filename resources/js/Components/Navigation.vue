<template>
  <nav class="flex justify-between items-end p-4 border-b border-gray-300">
    <Link :href="`/planers/${planer}`"
      ><h1 class="text-3xl">
        Studienverlaufsplaner
        <span v-if="$page.props.planerName">{{ $page.props.planerName }}</span>
      </h1></Link
    >
    <div v-if="$page.props.plan">
      Plan-Nummer: {{ $page.props.plan.data.slug }}
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>