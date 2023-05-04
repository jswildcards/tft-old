<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import ChampionIcon from '../components/ChampionIcon.vue'
import SquareImage from '../components/SquareImage.vue'
import { useStaticDataStore } from '../stores/staticData'

const staticDataStore = useStaticDataStore()
const { getChampionById, filterChampions } = storeToRefs(staticDataStore)
staticDataStore.fetchData()

const route = useRoute()
const champion = computed(() => getChampionById.value(route.params.id as string))

const championBackgroundColors: Record<number, string> = {
  1: "bg-slate-500",
  2: "bg-green-600",
  3: "bg-sky-600",
  4: "bg-fuchsia-700",
  5: "bg-amber-400",
}
</script>

<template>
  <div class="mb-4 flex space-x-4" v-if="champion">
    <router-link to="/">Home</router-link>
    <span>/</span>
    <router-link to="/champions">Champions</router-link>
    <span>/</span>
    <span class="font-bold">{{ champion.name }}</span>
  </div>

  <div class="grid grid-cols-3 gap-8 p-4 bg-indigo-800 rounded shadow-lg" v-if="champion">
    <div>
      <div>
        <div class="relative">
          <img :src="champion.image.splash" />
          <div class="absolute bottom-0 p-2 w-full">
            <div class="flex items-center text-sm" v-for="trait in champion.traits" :key="trait.id">
              <img class="mr-2" width="20" :src="trait.imageSource" />
              <span>{{ trait.name }}</span>
            </div>
          </div>
        </div>

        <div :class="`text-2xl p-2 flex justify-between ${championBackgroundColors[champion.cost]}`">
          <div>{{ champion.name }}</div>
          <div class="flex">
            <img class="mr-2" width="20" src="/img/common/icon-gold.svg" />
            <span>{{ champion.cost }}</span>
          </div>
        </div>
      </div>

      <div class="my-2">
        <h2 class="inline-block border-b text-xl">Basic Stats</h2>
        <div class="grid grid-cols-2 gap-y-1 mt-2">
          <div>
            <div class="text-indigo-200">Health</div>
            <div class="text-lg">{{ champion.stats.hp }}</div>
          </div>
          <div>
            <div class="text-indigo-200">Attack Damage</div>
            <div class="text-lg">{{ champion.stats.damage }}</div>
          </div>
          <div>
            <div class="text-indigo-200">Armor</div>
            <div class="text-lg">{{ champion.stats.armor }}</div>
          </div>
          <div>
            <div class="text-indigo-200">Magic Resist</div>
            <div class="text-lg">{{ champion.stats.magicResist }}</div>
          </div>
          <div>
            <div class="text-indigo-200">Attack Speed</div>
            <div class="text-lg">{{ champion.stats.attackSpeed }}</div>
          </div>
          <div>
            <div class="text-indigo-200">Attack Range</div>
            <div class="text-lg">{{ champion.stats.range }}</div>
          </div>
          <div>
            <div class="text-indigo-200">Critical Chance</div>
            <div class="text-lg">{{ champion.stats.critChance }}</div>
          </div>
          <div>
            <div class="text-indigo-200">Critical Damage</div>
            <div class="text-lg">{{ champion.stats.critMultiplier }}</div>
          </div>
        </div>
      </div>

    </div>

    <div>
      <div class="my-2">
        <h2 class="inline-block border-b text-xl">Ability</h2>
        <div class="mt-2">
          <div class="flex mb-1">
            <SquareImage class="mr-2" size="lg" :src="`${champion.ability.imageSource}`" />

            <div>
              <div class="text-lg">{{ champion.ability.name }}</div>
              <div class="text-sm mt-1">{{ champion.stats.initialMana }} / {{ champion.stats.mana }} <span class="text-indigo-200">Mana</span></div>
              <div class="text-sm mt-2" v-html="champion.ability.desc"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h2 class="inline-block border-b text-xl mb-2">Hero Augments</h2>
        <div class="mb-4" v-for="hero_augment in champion.hero_augments" :key="`${hero_augment.id}`">
          <div class="flex mb-1">
            <SquareImage class="mr-2" size="lg" :src="champion.image.tile" />
            <div>
              <div class="text-lg">{{ hero_augment.name }}</div>
              <div class="text-sm" v-html="hero_augment.desc"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="my-2">
        <h2 class="inline-block border-b text-xl">Traits</h2>
        <div class="mt-2" v-for="trait in champion.traits" :key="trait.id">
          <div class="flex items-center">
            <SquareImage class="mr-2" size="md" :src="trait.imageSource" />
            <span>{{ trait.name }}</span>
          </div>
          <div class="text-sm" v-html="trait.desc"></div>
          <div>{{ trait.effects }}</div>
          <div class="flex flex-wrap">
            <div v-for="champion in filterChampions([], [trait], '')" :key="champion.id">
              <router-link :to="`/champions/${champion.id}`">
                <ChampionIcon :champion="champion" :showName="true" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
