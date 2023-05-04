<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'

import Champion from '../models/champion'
import Trait from '../models/trait'
import SquareImage from './SquareImage.vue'

interface Props {
  champion: Champion
  activeTraits?: Trait[]
  showTraits?: boolean
  showName?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  activeTraits: [],
  showTraits: true,
  showName: false,
})

const { champion, activeTraits, showTraits } = toRefs(props)

const championBorderColors = {
  1: "border-slate-500",
  2: "border-green-600",
  3: "border-sky-600",
  4: "border-fuchsia-700",
  5: "border-amber-400",
}

const traitBackgroundColors = {
  normal: 'bg-slate-800 border-slate-600',
  active: 'bg-amber-500 border-amber-400',
}

function traitBackground(trait) {
  if(activeTraits.value.includes(trait))
    return traitBackgroundColors.active

  return traitBackgroundColors.normal
}
</script>

<template>
  <div class="w-20 flex flex-col items-center text-center">
    <div class="whitespace-nowrap">
      <div v-if="showTraits" class="relative flex flex-wrap justify-center -mb-4 z-10">
        <div v-for="trait in champion.traits">
          <SquareImage :src="trait.imageSource" :class="`p-1 rounded-full border-2 ${traitBackground(trait)}`" size="sm" />
        </div>
      </div>

      <img :src="champion.image.tile" :alt="champion.name" :class="`rounded-full border-4 w-16 h-16 m-auto ${championBorderColors[champion.cost]}`" />
    </div>

    <div v-if="showName" class="text-xs mt-2 break-words">{{ champion.name }}</div>
  </div>
</template>
