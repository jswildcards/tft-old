import StringSanitizer from "./StringSantizer"

interface ItemObject {
  id: string
  name: string
  desc: string
  composition: string[]
  image: string
  effects: Record<string, string | number>
}

export default class Item {
  id: string
  name: string
  desc: string
  composition: string[]
  image: string
  effects: Record<string, string | number>

  constructor({id, name, desc, composition, image, effects}: ItemObject) {
    this.id = id
    this.name = name
    this.desc = desc
    this.composition = composition
    this.image = image
    this.effects = effects

    Object.keys(this.effects).forEach((key) => {
      if(typeof this.effects[key] !== 'string' && !Number.isInteger(this.effects[key]))
        this.effects[key] = (this.effects[key] as number).toFixed(2)
    })
  }

  matchId(id: string) {
    id = id.toLowerCase()
    return this.id.toLowerCase() === id
  }

  sanitizedDescription() {
    return StringSanitizer.sanitize(this.desc)
  }

  statsEffectKeys() {
    return Object.keys(this.effects).filter(effect => !effect.startsWith('{'))
  }
}
