<template>
  <div v-if="selectedModule">
    <h2 class="text-xl">{{ selectedModule.name }}</h2>
    <dl class="mt-4">
      <dt class="text-sm text-gray-500 font-bold uppercase">Modulnummer</dt>
      <dd>{{ selectedModule.id }}</dd>
      <dt class="mt-2 text-sm text-gray-500 font-bold uppercase">
        Kreditpunkte
      </dt>
      <dd>{{ selectedModule.credits }}</dd>
      <dt class="mt-2 text-sm text-gray-500 font-bold uppercase">Termine</dt>
      <dd>
        <ul>
          <li v-for="(date, index) in selectedModule.dates" :key="index">
            {{ date.semester }} {{ date.day }} {{ date.time }}
          </li>
        </ul>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: {
    selectedModule: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>