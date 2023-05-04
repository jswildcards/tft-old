import { defineStore } from 'pinia'

import Champion from '../models/Champion'
import Trait from '../models/Trait'
import Item from '../models/Item'

interface State {
  champions: Champion[]
  traits: Trait[]
  items: Item[]
  hero_augments: Record<string, unknown>[]
  augments: Record<string, unknown>[]
}

export const useStaticDataStore = defineStore('staticData', {
  state: (): State => ({
    champions:     [],
    traits:        [],
    items:         [],
    hero_augments: [],
    augments:      [],
  }),
  getters: {
    getChampionById: function(state) {
      return (id: string) => {
        return state.champions?.find((champion) => champion.matchId(id))
      }
    },
    getItemById: function(state) {
      return (id: string) => {
        return state.items?.find((item) => item.matchId(id))
      }
    },
    getAllChampionCosts: function(state) {
      return [...new Set(state.champions?.map(champion => champion.cost).sort())]
    },
    filterChampions: function(state) {
      return (costs: number[], traits: Trait[], keyword: string) => {
        keyword = keyword.toLowerCase()

        return state.champions?.
          filter((champion) => {
            const matchKeyword = champion.matchKeyword(keyword)
            const matchCost    = costs.includes(champion.cost) || costs.length === 0
            const matchTrait   = champion.traits.some((trait) => traits.includes(trait)) || traits.length === 0

            return matchKeyword && matchCost && matchTrait
          }).
          sort((a, b) => {
            return a.compare(b, traits)
          })
      }
    },
    baseItems: function(state) {
      return state.items?.filter(item => item.composition.length === 0)
    },
    composableItems: function(state) {
      return (baseItem: Item) => {
        return state.items?.filter(
          (item) => {
            return item.composition.some(itemId => itemId === baseItem.id)
          }
        )
      }
    }
  },
  actions: {
    async fetchData() {
      if(this.champions.length > 0)
        return

      const baseUrl = import.meta.env.BASE_URL

      const cdragon = await fetch(`${baseUrl}data/13.7.1/community_dragon_full.json`).
        then((res) => res.json()).
        then((res) => {
          return {
            champions: res.sets['8'].champions,
            traits:    res.sets['8'].traits,
            items:     res.items,
          }
        })

      const ddragon = await Promise.all(
        [
          "champion",
          "trait",
          "item",
          "hero-augments",
          "augments",
        ].map((name) => {
          return fetch(`${baseUrl}data/13.7.1/data_dragon/tft-${name}.json`).
            then((res) => res.json()).
            then((res): Record<string, unknown>[] => Object.values(res.data))
        })
      ).
        then(([ champions, traits, items, hero_augments, augments ]) => {
          return {
            champions,
            traits,
            items,
            hero_augments,
            augments,
          }
        })

      this.items = ddragon.items.
        map((ditem) => {
          const citem = cdragon.items.
            find((citem: Record<string, unknown>) => ditem.id === citem.apiName)

          return new Item({
            id: ditem.id as string,
            name: citem.name,
            desc: citem.desc,
            composition: citem.composition,
            image: `/img/tft-item/${(ditem.image as Record<string, string>).full}`,
          })
        }).
        filter((item) => {
          return ((item.id.startsWith("TFT_Item") && !item.id.startsWith("TFT_Item_Grant")) || (item.id.startsWith("TFT8_Item") && item.composition.length > 0)) && !item.name.startsWith("tft_item")
        })

      this.traits = ddragon.traits.
        map((dtrait) => {
          const ctrait = cdragon.traits.
            find((ctrait: Record<string, unknown>) => dtrait.id === ctrait.apiName)

          return new Trait({
            id: dtrait.id as string,
            name: dtrait.name as string,
            imageSource: `/img/tft-trait/${(dtrait.image as Record<string, string>).full}`,
            effects: ctrait.effects,
            desc: ctrait.desc,
          })
        }).
        sort((a, b) => {
          return a.compare(b, 0, 0)
        })

      this.champions = ddragon.champions.
        map((dchampion) => {
          const cchampion = cdragon.champions.
            find((cchampion: Record<string, unknown>) => dchampion.id === cchampion.apiName)

          const traits = cchampion.traits.
            map((traitName: string) => {
              return this.traits.
                find((trait) => trait.name === traitName)
            })

          const hero_augments = (dchampion.hero_augments as string[]).
            map((hero_augment) => {
              return cdragon.items.
                find((item: Record<string, unknown>) => item.apiName === hero_augment)
            })

          cchampion.ability.imageSource = `/img/tft-ability/${cchampion.ability.icon}`

          return new Champion({
            id:   dchampion.id as string,
            name: cchampion.name,
            cost: cchampion.cost,
            imageSource: `https://raw.communitydragon.org/13.7/game/${cchampion.icon.toLowerCase().replace(".dds", ".png")}`,
            image: dchampion.image as Record<string, string>,
            traits,
            ability: cchampion.ability,
            stats: cchampion.stats,
            hero_augments,
          })
        }).
        sort((a, b) => {
          return a.compare(b, [])
        })

      this.augments = ddragon.augments.
        map((daugment) => {
          const caugment = cdragon.items.
            find((caugment: Record<string, unknown>) => caugment.apiName === daugment.id)

          return caugment
        })
    }
  }
})
