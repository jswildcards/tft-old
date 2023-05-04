import Trait from '../models/Trait'

interface ChampionObject {
  id:   string;
  name: string;
  cost: number;
  imageSource: string;
  image: Record<string, string>;
  traits: Trait[];
  ability: Record<string, unknown>;
  stats: Record<string, unknown>;
  hero_augments: Record<string, unknown>[];
}

export default class Champion {
  id:   string;
  name: string;
  cost: number;
  imageSource: string;
  image: Record<string, string>;
  traits: Trait[];
  ability: Record<string, unknown>;
  stats: Record<string, unknown>;
  hero_augments: Record<string, unknown>[];

  constructor({id, name, cost, imageSource, image, traits, ability, stats, hero_augments}: ChampionObject) {
    this.id   = id
    this.name = name
    this.cost = cost
    this.imageSource = imageSource
    this.image = image
    this.traits = traits
    this.ability = ability
    this.stats = stats
    this.hero_augments = hero_augments

    Object.keys(this.stats).forEach((stat) => {
      if(!Number.isInteger(this.stats[stat]))
        this.stats[stat] = (this.stats[stat] as number).toFixed(2)
    })
  }

  matchKeyword(keyword: string) {
    return this.name.toLowerCase().includes(keyword)
  }

  matchId(id: string) {
    id = id.toLowerCase()
    return this.id.toLowerCase() === id
  }

  compare(other: Champion, traits: Trait[]) {
    const thisTraitCount =
      this.traits.reduce((count, trait) => count + Number(traits.includes(trait)), 0)

    const otherTraitCount =
      other.traits.reduce((count, trait) => count + Number(traits.includes(trait)), 0)

    if(thisTraitCount !== otherTraitCount)
      return thisTraitCount > otherTraitCount ? -1 : 1

    if(this.cost !== other.cost)
      return this.cost < other.cost ? -1 : 1

    return this.name < other.name ? -1 : 1
  }
}
