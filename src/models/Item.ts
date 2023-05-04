interface ItemObject {
  id: string
  name: string
  desc: string
  composition: string[]
  image: string
}

export default class Item {
  id: string
  name: string
  desc: string
  composition: string[]
  image: string

  constructor({id, name, desc, composition, image}: ItemObject) {
    this.id = id
    this.name = name
    this.desc = desc
    this.composition = composition
    this.image = image
  }

  matchId(id: string) {
    id = id.toLowerCase()
    return this.id.toLowerCase() === id
  }
}
