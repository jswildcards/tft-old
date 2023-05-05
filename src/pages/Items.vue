<script setup lang="ts">
import { Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useStaticDataStore } from '../stores/staticData'
import SquareImage from '../components/SquareImage.vue'
import Item from '../models/Item'

type NullableItem = Item | null

const currentItem: Ref<NullableItem> = ref(null)
const currentItemHovered: Ref<NullableItem> = ref(null)

const staticDataStore = useStaticDataStore()
const { composableItems, getItemById } = storeToRefs(staticDataStore)
staticDataStore.fetchData().then(() => {
  currentItem.value = staticDataStore.baseItems[0]
})

function setCurrentItem(item: NullableItem) {
  currentItem.value = item
}

function hoverCurrentItem(item: NullableItem) {
  currentItemHovered.value = item
}
</script>

<template>
  <div class="flex flex-wrap justify-center">
    <button
      v-for="item in staticDataStore.baseItems"
      :key="item.id"
      :class="`rounded relative border-2 ${currentItem === item ? 'border-amber-200' : 'border-transparent'}`"
      @mouseenter="hoverCurrentItem(item)"
      @mouseleave="hoverCurrentItem(null)"
      @click="setCurrentItem(item)"
    >
      <SquareImage :src="item.image" size="lg" class="rounded" />
      <div
        v-if="currentItemHovered === item"
        class="absolute bg-slate-900 p-2 mt-1 rounded whitespace-nowrap -translate-x-1/2 left-1/2 z-10"
      >
        {{ item.name }}
      </div>
    </button>
  </div>

  <div v-if="currentItem === null" class="text-center my-4">
    <h2 class="text-indigo-200 text-xl font-medium">Please select a base item</h2>
  </div>

  <div v-else>
    <div class="my-4 sm:grid gap-2 grid-cols-auto-fit justify-center">
      <h2 class="text-indigo-200 text-xl font-medium col-span-full">Base Item</h2>
      <div class="bg-indigo-600 my-2 sm:my-0 w-full sm:w-96 rounded">
        <div class="flex items-center bg-indigo-700 p-4 rounded-t">
          <SquareImage :src="currentItem.image" size="lg" class="rounded" />
          <div class="ml-4">{{ currentItem.name }}</div>
        </div>
        <div v-html="currentItem.sanitizedDescription()" class="p-4"></div>
        <div class="p-4">
          <div v-for="key in currentItem.statsEffectKeys()" :key="key">
            <div>{{ `${key}: ${currentItem.effects[key]}` }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="my-4 sm:grid gap-2 grid-cols-auto-fit justify-center">
      <h2 class="text-indigo-200 text-xl font-medium col-span-full">Composable Items</h2>

      <div v-for="item in composableItems(currentItem)" :key="item.id" class="bg-indigo-600 my-2 sm:my-0 w-full sm:w-96 rounded">
        <div class="flex bg-indigo-700 p-4 rounded-t">
          <SquareImage :src="item.image" size="lg" class="rounded" />
          <div class="ml-4 flex flex-col justify-between">
            <div>{{ item.name }}</div>
            <div class="flex">
              <SquareImage v-for="composition in item.composition" :key="composition" class="mr-2 rounded" :src="getItemById(composition)?.image ?? ''" />
            </div>
          </div>
        </div>
        <div v-html="item.sanitizedDescription()" class="p-4"></div>
        <div class="p-4">
          <div v-for="key in item.statsEffectKeys()" :key="key">
            <div>{{ `${key}: ${item.effects[key]}` }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.grid-cols-auto-fit {
  grid-template-columns: repeat(auto-fit, 384px);
}
</style>
