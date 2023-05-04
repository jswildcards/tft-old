<script setup lang="ts">
import { Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useStaticDataStore } from '../stores/staticData'
import ChampionIcon from '../components/ChampionIcon.vue'
import Trait from '../models/Trait'

const staticDataStore = useStaticDataStore()
const { filterChampions } = storeToRefs(staticDataStore)
staticDataStore.fetchData()

const costsSelected: Ref<number[]> = ref([])
const traitsSelected: Ref<Trait[]> = ref([])
const keyword = ref("")
const filtersShow = ref(false)

function costCheckIcon(cost: number) {
  if(costsSelected.value.includes(cost))
    return "check_box"

  return "check_box_outline_blank"
}

function filtersExpandIcon() {
  if(filtersShow.value)
    return 'expand_less'

  return 'expand_more'
}

const traitSwitchBackgroundColors = {
  normal: 'bg-gray-500 hover:bg-gray-600',
  active: 'bg-amber-500 hover:bg-amber-600',
}

const traitDisplayBackgroundColors = {
  normal: '',
  active: 'bg-amber-500',
}

function traitSwitchBackgroundColor(trait: Trait) {
  const { active, normal } = traitSwitchBackgroundColors

  if(traitsSelected.value.includes(trait))
    return active

  return normal
}

function traitDisplayBackgroundColor(trait: Trait) {
  const { active, normal } = traitDisplayBackgroundColors

  if(traitsSelected.value.includes(trait))
    return active

  return normal
}

function checkCost(cost: number) {
  if(costsSelected.value.includes(cost))
    costsSelected.value = costsSelected.value.filter((selectedCost: number) => selectedCost !== cost)
  else
    costsSelected.value = [...costsSelected.value, cost]
}

function checkTrait(trait: Trait) {
  if(traitsSelected.value.includes(trait))
    traitsSelected.value = traitsSelected.value.filter((selectedTrait: Trait) => selectedTrait !== trait)
  else
    traitsSelected.value = [...traitsSelected.value, trait]
}
</script>

<template>
  <div class="mb-4 flex space-x-4">
    <router-link to="/">Home</router-link>
    <span>/</span>
    <span class="font-bold">Champions</span>
  </div>

  <div class="grid gap-4 grid-cols-3">
    <div class="col-span-3 md:col-span-1 p-4 bg-indigo-800 rounded shadow-lg">
      <div class="flex justify-between cursor-pointer md:cursor-default" @click="filtersShow = !filtersShow">
        <h1 class="text-2xl font-bold">Filters</h1>
        <button class="md:hidden flex items-center">
          <span class="material-icons">
            {{ filtersExpandIcon() }}
          </span>
        </button>
      </div>

      <div :class="'md:block ' + (filtersShow ? '' : 'hidden')">
        <hr class="my-4 border-indigo-500">

        <div class="mb-2 flex justify-between items-center">
          <div class="text-lg text-neutral-300">Cost</div>
          <button class="flex" v-if="costsSelected.length !== 0" @click="costsSelected = []">
            <span class="material-icons text-lg">close</span>
          </button>
        </div>
        <div class="flex flex-wrap text-sm">
          <button :key="cost" class="flex items-center p-1.5 mr-2 mb-2 duration-300 hover:bg-indigo-900" v-for="cost in staticDataStore.getAllChampionCosts" @click="checkCost(cost)">
            <span class="material-icons mr-1">
              {{ costCheckIcon(cost) }}
            </span>
            {{ cost }}
          </button>
        </div>

        <hr class="my-4 border-indigo-500">

        <div class="mb-2 flex justify-between items-center">
          <div class="text-lg text-neutral-300">Trait</div>
          <button class="flex" v-if="traitsSelected.length !== 0" @click="traitsSelected = []">
            <span class="material-icons text-lg">close</span>
          </button>
        </div>
        <div class="flex flex-wrap text-sm">
          <button :key="trait.id" :class="'flex items-center p-1.5 rounded mr-2 mb-2 duration-300 ' + traitSwitchBackgroundColor(trait)" v-for="trait in staticDataStore.traits" @click="checkTrait(trait)">
            <img :src="trait.imageSource" class="mr-1" width="24" height="24"/>
            {{ trait.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="col-span-3 md:col-span-2 p-4 bg-indigo-800 rounded shadow-lg">
      <h1 class="text-2xl mb-4 font-bold">TFT Champion List</h1>

      <div class="w-full flex mb-4 shadow-lg">
        <label for="search" class="p-1.5 h-100 flex items-center bg-neutral-100 text-indigo-800 border-y-2 border-l-2 border-indigo-300 rounded-l cursor-pointer">
          <span class="material-icons">search</span>
        </label>
        <input id="search" type="text" placeholder="search by name..." v-model="keyword" class="grow px-3 py-2.5 text-xs bg-neutral-100 text-indigo-800 border-y-2 border-indigo-300 ring-0 outline-none duration-300 focus:bg-indigo-100" />
        <button class="p-1.5 h-100 flex items-center bg-neutral-100 text-indigo-800 border-y-2 border-indigo-300 duration-300 hover:bg-indigo-100" v-if="keyword.length !== 0" @click="keyword = ''">
          <span class="material-icons">
            close
          </span>
        </button>
        <div class="border-r-2 border-indigo-300 rounded-r"></div>
      </div>

      <div class="grid grid-cols-auto-fit justify-center">
        <router-link :key="champion.id" :to="'/champions/' + champion.id.toLowerCase()" class="m-auto w-28 p-4 rounded inline-block duration-300 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1" v-for="champion in filterChampions(costsSelected, traitsSelected, keyword)">
          <ChampionIcon :champion="champion" :activeTraits="traitsSelected" :showName="true" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-cols-auto-fit {
  grid-template-columns: repeat(auto-fit, 112px);
}
</style>
