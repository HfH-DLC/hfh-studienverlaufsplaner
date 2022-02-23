<template>
  <nav
    class="flex justify-between items-end h-full p-4 border-b border-gray-300"
  >
    <Link :href="`/planers/${$page.props.planerSlug}`"
      ><h1 class="text-3xl">
        Studienverlaufsplaner
        <span v-if="$page.props.planerName">{{ $page.props.planerName }}</span>
      </h1></Link
    >
    <div class="flex items-center justify-between gap-4">
      <div v-if="$page.props.planResource" id="plan-number">
        Plan-Nummer: {{ $page.props.planResource.data.slug }}
      </div>
      <div>
        <button id="start-tour" class="p-2" @click="startTour">
          <QuestionMarkCircleIcon class="w-5 h-5" aria-hidden="true" /><span
            class="sr-only"
            >Einführung anschauen</span
          >
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { QuestionMarkCircleIcon } from "@heroicons/vue/outline";
export default {
  components: {
    QuestionMarkCircleIcon,
  },
  methods: {
    startTour() {
      this.$emitter.emit("start-tour", {});
    },
  },
};
</script>

<style lang="scss" scoped>
</style>