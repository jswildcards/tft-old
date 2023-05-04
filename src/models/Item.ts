export default class Item {
  constructor(id, name, desc, composition, image) {
    this.id = id
    this.name = name
    this.desc = desc
    this.composition = composition
    this.image = image
  }

  matchId(id) {
    id = id.toLowerCase()
    return this.id.toLowerCase() === id
  }
}
