import { defineStore } from 'pinia'

import Champion from '../models/champion'
import Trait from '../models/trait'
import Item from '../models/item'

export const useStaticDataStore = defineStore('staticData', {
  state: () => ({
    champions:     null,
    traits:        null,
    items:         null,
    hero_augments: null,
    augments:      null,
  }),
  getters: {
    getChampionById: function(state) {
      return (id) => {
        return state.champions?.find((champion) => champion.matchId(id))
      }
    },
    getItemById: function(state) {
      return (id) => {
        return state.items?.find((item) => item.matchId(id))
      }
    },
    getAllChampionCosts: function(state) {
      return [...new Set(state.champions?.map(champion => champion.cost).sort())]
    },
    filterChampions: function(state) {
      return (costs, traits, keyword) => {
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
      return (baseItem) => {
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
      if(this.champions !== null && this.traits !== null)
        return

      const cdragon = await fetch("/data/13.7.1/community_dragon_full.json").
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
          return fetch(`/data/13.7.1/data_dragon/tft-${name}.json`).
            then((res) => res.json()).
            then((res) => Object.values(res.data))
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
            find((citem) => ditem.id === citem.apiName)

          return new Item(ditem.id, citem.name, citem.desc, citem.composition, `/img/tft-item/${ditem.image.full}`)
        }).
        filter((item) => {
          return ((item.id.startsWith("TFT_Item") && !item.id.startsWith("TFT_Item_Grant")) || (item.id.startsWith("TFT8_Item") && item.composition.length > 0)) && !item.name.startsWith("tft_item")
        })

      this.traits = ddragon.traits.
        map((dtrait) => {
          const ctrait = cdragon.traits.
            find((ctrait) => dtrait.id === ctrait.apiName)

          return new Trait(dtrait.id, dtrait.name, `/img/tft-trait/${dtrait.image.full}`, ctrait.effects, ctrait.desc)
        }).
        sort((a, b) => {
          return a.compare(b, 0, 0)
        })

      this.champions = ddragon.champions.
        map((dchampion) => {
          const cchampion = cdragon.champions.
            find((cchampion) => dchampion.id === cchampion.apiName)

          const traits = cchampion.traits.
            map((traitName) => {
              return this.traits.
                find((trait) => trait.name === traitName)
            })

          const hero_augments = dchampion.hero_augments.
            map((hero_augment) => {
              return cdragon.items.
                find((item) => item.apiName === hero_augment)
            })

          cchampion.ability.imageSource = `/img/tft-ability/${cchampion.ability.icon}`

          return new Champion({
            id:   dchampion.id,
            name: cchampion.name,
            cost: cchampion.cost,
            imageSource: `https://raw.communitydragon.org/13.7/game/${cchampion.icon.toLowerCase().replace(".dds", ".png")}`,
            image: dchampion.image,
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
            find((caugment) => caugment.apiName === daugment.id)

          return caugment
        })
    }
  }
})
