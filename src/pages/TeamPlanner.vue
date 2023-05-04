<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useStaticDataStore } from '../stores/staticData'
import { useTeamStore } from '../stores/team'
import ChampionIcon from '../components/ChampionIcon.vue'
import SquareImage from '../components/SquareImage.vue'

const staticDataStore = useStaticDataStore()
const { filterChampions } = storeToRefs(staticDataStore)
staticDataStore.fetchData()

const teamStore = useTeamStore()

const championDragging = ref(null)
const championMoveFrom = ref(null)
const traitDisplaying = ref(null)

const traitEffectLevelBackground = [
  'bg-slate-800 hover:bg-slate-700',
  'bg-amber-900 hover:bg-amber-800',
  'bg-slate-400 hover:bg-slate-500',
  'bg-amber-500 hover:bg-amber-600',
  'bg-red-500   hover:bg-red-600',
]

function onPoolDragStart(champion) {
  championDragging.value = champion
}

function onTeamDragStart(i, j) {
  const champion = teamStore.team.champions[i][j]

  if(champion !== null) {
    championMoveFrom.value = {i, j}
    championDragging.value = champion
  }
}

function onTeamDragEnd() {
  championMoveFrom.value = null
}

function updateTeam(i, j) {
  if(championMoveFrom.value !== null) {
    const { i: i1, j: j1 } = championMoveFrom.value
    teamStore.team.switchChampions(i1, j1, i, j)
  } else if (championDragging.value !== null){
    teamStore.team.addChampion(championDragging.value, i, j)
  }

  championMoveFrom.value = null
  championDragging.value = null
}

function highlightChampions(trait) {
  traitDisplaying.value = trait
}

function revertHighlightChampions() {
  traitDisplaying.value = null
}
</script>

<template>
  <div class="mb-4 flex space-x-4">
    <router-link to="/">Home</router-link>
    <span>/</span>
    <span class="font-bold">Team Planner</span>
  </div>

  <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
    <div class="hidden relative xl:flex flex-col items-end h-80 mb-2 w-48">
      <div
        v-for="[trait, count] in teamStore.team.getSortedActiveTraits()"
        :key="trait.id"
        @mouseenter="highlightChampions(trait)"
        @mouseleave="revertHighlightChampions"
      >
        <div :class="`p-2 m-1 inline-flex w-48 items-center rounded ${traitEffectLevelBackground[trait.getEffectLevel(count)]}`">
          <SquareImage class="mr-2" size="sm" :src="trait.imageSource" />
          <div class="mr-2 w-6 text-center p-2 bg-slate-300/25 rounded" v-if="trait.getEffectLevel(count) > 0">
            {{ count }}
          </div>
          <div class="text-sm">
            <div>{{ trait.name }}</div>
            <div v-if="trait.getEffectLevel(count) > 0">
              <div class="inline-flex" v-for="(effect, i) in trait.effects" :key="i">
                <div>{{ i > 0 ? ">" : "" }}&nbsp;</div>
                <div :class="trait.getEffectLevel(count) === effect.level ? 'font-bold' : 'text-gray-300'">
                  {{ effect.minUnits }}
                </div>
                <div>&nbsp;</div>
              </div>
            </div>
            <div v-else>{{ count }} / {{ trait.minUnitsToNextLevel(count) }}</div>
          </div>
        </div>
      </div>

      <div class="absolute w-80 top-0 right-full mr-1 bg-slate-900 p-4 rounded z-20" v-if="traitDisplaying !== null">
        <div v-html="traitDisplaying.desc"></div>
        <div class="grid grid-cols-auto-fit gap-2 mt-2 justify-center">
          <ChampionIcon
            v-for="champion in filterChampions([], [traitDisplaying], '')"
            :key="champion.id"
            :champion="champion"
            :showName="true"
            :class="teamStore.team.includeChampion(champion) ? '' : 'opacity-30'"
            draggable="true"
            @dragstart="onPoolDragStart(champion)"
          />
        </div>
      </div>
    </div>

    <div class="col-span-2">
      <div>
        <div
          v-for="(row, i) in teamStore.team.champions"
          class="flex justify-center odd:-ml-10 even:ml-10"
        >
          <div
            v-for="(champion, j) in row"
            :class="`m-2 w-16 h-16 rounded-full border-2 border-sky-600 cursor-grab ${ championMoveFrom !== null ? 'cursor-grabbing' : '' }`"
            @drop="updateTeam(i, j)"
            @dragstart="onTeamDragStart(i, j)"
            @dragend="onTeamDragEnd(i, j)"
            @dragover.prevent
            @dragenter.prevent
            @click="teamStore.team.removeChampion(i, j)"
          >
            <ChampionIcon v-if="champion !== null" :champion="champion" :activeTraits="[traitDisplaying]" class="-mt-2.5 -ml-2.5" />
          </div>
        </div>
      </div>

      <hr class="my-4 border-indigo-500">

      <div class="grid grid-cols-auto-fit justify-center">
        <div
          v-for="champion in staticDataStore.champions"
          :class="`inline-block relative p-2 cursor-grab ${ teamStore.team.includeChampion(champion) ? 'opacity-30' : '' } ${ championDragging === champion ? 'cursor-grabbing' : '' }`"
          draggable="true"
          @dragstart="onPoolDragStart(champion)"
        >
          <ChampionIcon :showName="true" :champion="champion" :activeTraits="[...teamStore.team.getSortedActiveTraits().keys()]" />
        </div>
      </div>
    </div>

    <div>
      <button class="w-full p-2 rounded bg-blue-500 duration-100 hover:bg-blue-600" @click="teamStore.team.reset()">Clear</button>
      <div class="my-2">
        <h2 class="text-lg">Team</h2>
        <div class="mt-1">{{ teamStore.team.size }} / {{ teamStore.team.teamSizeLimit }}</div>
        <div class="grid grid-cols-auto-fit justify-center mt-4">
          <button v-for="champion in teamStore.team.getTeamUniqueChampions()" class="p-2">
            <ChampionIcon
              :champion="champion"
              :showName="true"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-cols-auto-fit {
  grid-template-columns: repeat(auto-fit, 96px);
}
</style>
