import { defineStore } from 'pinia'

import Team from '../models/Team'

export const useTeamStore = defineStore('team', {
  state: () => ({
    team: new Team(),
  }),
})
