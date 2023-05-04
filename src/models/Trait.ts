interface TraitObject {
  id: string
  name: string
  imageSource: string
  effects: Record<string, unknown>[]
  desc: string
}

export default class Trait {
  id: string
  name: string
  imageSource: string
  effects: Record<string, unknown>[]
  desc: string

  constructor({id, name, imageSource, effects, desc}: TraitObject) {
    this.id = id
    this.name = name
    this.imageSource = imageSource
    this.effects = effects
    this.desc = desc

    // const maxEffectLevel = 3
    // let currentEffectLevel = 1

    // if(maxEffectLevel > this.effects.length)
    //   currentEffectLevel = maxEffectLevel - this.effects.length + 1

    // this.effects = this.effects.reduce((effects, effect) => {
    //   effect.level = currentEffectLevel

    //   if(currentEffectLevel < maxEffectLevel)
    //     currentEffectLevel++

    //   return [...effects, effect]
    // }, [])

    this.effects = this.effects.map((effect, index) => {
      return {
        ...effect,
        level: index + 1,
      }
    })
  }

  minUnitsToNextLevel(count: number) {
    let currentMinUnits = Infinity

    this.effects.forEach(({ minUnits }) => {
      if(count < (minUnits as number) && currentMinUnits === Infinity)
        currentMinUnits = (minUnits as number)
    })

    return currentMinUnits
  }

  getEffectLevel(count: number) {
    return this.effects.find(({ maxUnits, minUnits }) => {
      return (minUnits as number) <= count && count <= (maxUnits as number)
    })?.level ?? 0
  }

  compare(other: Trait, thisChampionCount: number, otherChampionCount: number) {
    const thisEffectLevel  = this.getEffectLevel(thisChampionCount)
    const otherEffectLevel = other.getEffectLevel(otherChampionCount)

    if(thisEffectLevel !== otherEffectLevel)
      return thisEffectLevel > otherEffectLevel ? -1 : 1

    if(thisChampionCount !== otherChampionCount)
      return thisChampionCount > otherChampionCount ? -1 : 1

    return this.name < other.name ? -1 : 1
  }
}
