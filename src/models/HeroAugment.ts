import StringSanitizer from "./StringSantizer"

interface HeroAugmentObject {
  id: string
  name: string
  desc: string
  effects: Record<string, string | number>
}

export default class HeroAugment {
  id: string
  name: string
  desc: string
  effects: Record<string, string | number>

  constructor({id, name, desc, effects}: HeroAugmentObject) {
    this.id = id
    this.name = name
    this.desc = desc
    this.effects = effects
  }

  sanitizedDescription() {
    return StringSanitizer.sanitize(this.desc)
  }
}
