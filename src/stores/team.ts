import { defineStore } from 'pinia'

import Team from '../models/team'

export const useTeamStore = defineStore('team', {
  state: () => ({
    team: new Team(),
  }),
})
