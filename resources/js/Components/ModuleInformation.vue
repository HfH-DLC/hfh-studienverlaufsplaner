<template>
  <div v-if="selectedModule" aria-live="polite">
    <button @click="deselectModule" class="back-button mb-4" ref="back">
      Zurück
    </button>
    <h2 class="text-xl">{{ selectedModule.name }}</h2>
    <ErrorList
      class="mt-4 space-y-2"
      v-if="selectedModule.infos.length > 0"
      :errors="selectedModule.infos"
    />
    <dl class="mt-4">
      <dt class="hfh-label">Modulnummer</dt>
      <dd>{{ selectedModule.id }}</dd>
      <template v-if="selectedModule.prerequisites.length > 0">
        <dt class="hfh-label mt-4">Voraussetzungen</dt>
        <dd>
          <ul>
            <li
              v-for="prerequisite in selectedModule.prerequisites"
              :key="prerequisite.id"
            >
              {{ prerequisite.id }} {{ prerequisite.name }}
            </li>
          </ul>
        </dd>
      </template>
      <dt class="hfh-label mt-4">Kreditpunkte</dt>
      <dd>{{ selectedModule.ects }}</dd>
    </dl>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useScheduleStore } from "../Store/schedule";
import { HfhButton } from "@hfh-dlc/hfh-styleguide";
import ErrorList from "../Components/ErrorList.vue";
export default {
  components: {
    ErrorList,
    HfhButton,
  },
  props: {
    selectedModule: {
      type: Object,
      default: null,
    },
  },
  methods: {
    ...mapActions(useScheduleStore, ["deselectModule"]),
  },
};
</script>

<style lang="scss" scoped>
.back-button {
  position: relative;
  cursor: pointer;
  background: var(--c-black);
  color: var(--c-white);
  border: none;
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.625rem;
  min-height: 3.25rem;
  text-align: left;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 1rem;
    margin: auto;
    background-image: var(--i-carret--thin);
    display: block;
    transform-origin: center center;
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: cover;
    transform: rotate(90deg);
    width: 1.25rem;
    height: 0.8125rem;
  }
}
</style>
