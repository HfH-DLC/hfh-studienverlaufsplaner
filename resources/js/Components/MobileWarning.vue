<template>
  <header>
    <HfhHeaderBar>
      <template v-slot:right>
        <div class="px-4 py-3 leading-4">
          <a
            class="hover:text-thunderbird-red"
            href="https://hfh.ch"
            rel="noopener noreferer"
            target="_blank"
            >hfh.ch</a
          >
        </div>
      </template>
    </HfhHeaderBar>
    <div class="flex justify-between h-full px-4 pt-4 pb-4">
      <div class="flex gap-x-8 items-center">
        <HfhLogo />
        <div>
          <h1 class="text-xl">
            Studienverlaufsplaner
            <span v-if="$page.props.planerName">{{
              $page.props.planerName
            }}</span>
          </h1>
        </div>
      </div>
    </div>
  </header>
  <main class="mt-8">
    <HfhInfoField class="max-w-content mx-4 md:mx-auto"
      >Der Studienverlaufsplaner ist nicht für die Betrachtung auf mobilen
      Geräten ausgelegt. Bitte verwenden Sie ein Gerät mit einer Breite von
      mindestens 1024 Pixel oder vergrössern Sie das Fenster Ihres
      Browsers.</HfhInfoField
    >
  </main>
</template>

<script setup>
import { HfhHeaderBar, HfhInfoField, HfhLogo } from "@hfh-dlc/hfh-styleguide";
</script>

<style lang="scss" scoped>
</style>