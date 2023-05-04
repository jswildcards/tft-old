import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

import './style.css'

import App from './App.vue'
import TeamPlannerPage from './pages/TeamPlanner.vue'
import ChampionsPage from './pages/Champions.vue'
import SingleChampionPage from './pages/SingleChampion.vue'
import ItemsPage from './pages/Items.vue'

const routes = [
  { path: '/', component: TeamPlannerPage },
  { path: '/team-planner', component: TeamPlannerPage },
  { path: '/champions', component: ChampionsPage },
  { path: '/champions/:id', component: SingleChampionPage },
  { path: '/items', component: ItemsPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
const store = createPinia()
const app = createApp(App)

app.use(router)
app.use(store)
app.mount('#app')
