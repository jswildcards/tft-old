<template>
  <div class="bg-blue-900 shadow-lg">
    <div class="container mx-auto flex items-center">
      <router-link to="/" class="inline-flex font-bold items-center p-4">
        <img class="mr-1" src="https://raw.communitydragon.org/13.6/game/assets/ux/traiticons/trait_icon_8_animasquad.png">
        TFT Fan
      </router-link>
      <router-link to="/team-planner" class="inline-block p-4">Team Planner</router-link>
      <router-link to="/champions" class="inline-block p-4">Champions</router-link>
      <router-link to="/items" class="inline-block p-4">Items</router-link>
    </div>
  </div>
  <div class="container mx-auto px-4 py-6">
    <router-view></router-view>
  </div>
</template>
