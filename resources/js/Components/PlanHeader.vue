<template>
  <nav
    class="flex justify-between items-end h-full p-4 border-b border-gray-300"
  >
    <div>
      <Link :href="`/planers/${$page.props.planerSlug}`"
        ><h1 class="text-3xl">
          Studienverlaufsplaner
          <span v-if="$page.props.planerName">{{
            $page.props.planerName
          }}</span>
        </h1></Link
      >
      <p class="text-sm">(Änderungen vorbehalten)</p>
    </div>
    <div class="flex items-center justify-between gap-4">
      <SaveStatus />
      <div v-if="$page.props.planResource" id="plan-number">
        Plan-Nummer: {{ $page.props.planResource.data.slug }}
      </div>
      <div>
        <button
          id="start-tour"
          class="p-2 flex items-center gap-1 hover:text-thunderbird-red"
          @click="startTour"
        >
          <QuestionMarkCircleIcon class="w-7 h-7" aria-hidden="true" /> Hilfe
        </button>
      </div>
      <div>
        <PrintButton />
      </div>
    </div>
  </nav>
</template>

<script>
import { QuestionMarkCircleIcon } from "@heroicons/vue/outline";
import PrintButton from "./PrintButton.vue";
import SaveStatus from "./SaveStatus.vue";
export default {
  components: {
    QuestionMarkCircleIcon,
    PrintButton,
    SaveStatus,
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