<template>
  <nav
    class="flex justify-between items-end h-full p-4 border-b border-gray-300"
  >
    <div>
      <Link :href="`/${$page.props.planerSlug}`"
        ><div class="text-xl">
          Studienverlaufsplaner
          <span v-if="$page.props.planerName">{{
            $page.props.planerName
          }}</span>
        </div></Link
      >
      <p class="text-sm">(Änderungen vorbehalten)</p>
    </div>
    <div class="flex items-center justify-between gap-4">
      <ul class="flex gap-x-4 items-center">
        <li>
          <Link
            :href="`/${$page.props.planerSlug}/${$page.props.planResource.data.slug}/zeitplan`"
            :class="{
              active:
                $page.url ===
                `/${$page.props.planerSlug}/${$page.props.planResource.data.slug}/zeitplan`,
            }"
            >Zeitplan</Link
          >
        </li>
        <li>
          <Link
            :href="`/${$page.props.planerSlug}/${$page.props.planResource.data.slug}/anrechnung`"
            :class="{
              active:
                $page.url ===
                `/${$page.props.planerSlug}/${$page.props.planResource.data.slug}/anrechnung`,
            }"
            >Anrechnung</Link
          >
        </li>
      </ul>
      <SaveStatus />
      <div>
        <button
          id="start-tour"
          class="p-2 flex items-center gap-1 hover:text-thunderbird-red"
          @click="startTour"
        >
          <QuestionMarkCircleIcon class="w-5 h-5" aria-hidden="true" />
          Hilfe
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
a.active {
  font-weight: bold;
}
</style>
