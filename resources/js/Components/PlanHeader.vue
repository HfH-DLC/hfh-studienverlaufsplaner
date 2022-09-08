<template>
  <div class="flex justify-between items-center h-full p-4">
    <div>
      <div class="text-xl">
        Studienverlaufsplaner
        <span v-if="planerName">{{ planerName }}</span>
      </div>
      <p class="text-sm">(Änderungen vorbehalten)</p>
    </div>

    <div class="flex items-center justify-between gap-4">
      <nav>
        <HfhMenu
          v-if="showNavigation"
          :items="menuItems"
          :primary="false"
          :currentItem="$page.url"
        />
      </nav>
      <SaveStatus class="pt-2.5 pb-[1.9375rem]" />
      <div class="pt-2.5 pb-[1.9375rem]">
        <button
          v-if="showTour"
          id="start-tour"
          class="p-2 flex items-center gap-1 hover:text-thunderbird-red"
          @click="startTour"
        >
          <QuestionMarkCircleIcon class="w-5 h-5" aria-hidden="true" />
          Hilfe
        </button>
      </div>
      <div class="pt-2.5 pb-[1.9375rem]">
        <PrintButton />
      </div>
    </div>
  </div>
</template>

<script>
import { QuestionMarkCircleIcon } from "@heroicons/vue/outline";
import { HfhMenu } from "@hfh-dlc/hfh-styleguide";
import PrintButton from "./PrintButton.vue";
import SaveStatus from "./SaveStatus.vue";
export default {
  components: {
    HfhMenu,
    QuestionMarkCircleIcon,
    PrintButton,
    SaveStatus,
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
    planSlug: {
      type: String,
      required: true,
    },
    showNavigation: {
      type: Boolean,
      required: true,
    },
    showTour: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      menuItems: [
        {
          label: "Zeitplan",
          link: `/${this.planerSlug}/${this.planSlug}/zeitplan`,
        },
        {
          label: "Anrechnung",
          link: `/${this.planerSlug}/${this.planSlug}/anrechnung`,
        },
      ],
    };
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
  color: var(--c-thunderbird-red);
}
</style>
