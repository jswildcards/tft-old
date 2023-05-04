import Champion from "./Champion"

type NullableChampion = Champion | null

export default class Team {
  champions: NullableChampion[][]
  size: number
  teamSizeLimit: number

  constructor() {
    const m = 4, n = 7

    this.champions = Array.from(
      { length: m },
      () => new Array(n).fill(null)
    )

    this.size = 0
    this.teamSizeLimit = 9
  }

  addChampion(targetChampion: Champion, i: number, j: number) {
    if(this.isFull() && this.champions[i][j] === null)
      return

    if(this.champions[i][j] === null)
      this.size++

    this.champions[i][j] = targetChampion
  }

  switchChampions(i1: number, j1: number, i2: number, j2: number) {
    const temp = this.champions[i1][j1]
    this.champions[i1][j1] = this.champions[i2][j2]
    this.champions[i2][j2] = temp
  }

  removeChampion(i: number, j: number) {
    if(this.champions[i][j] !== null)
      this.size--

    this.champions[i][j] = null
  }

  includeChampion(targetChampion: Champion) {
    return this.flattenedChampions().
      some((champion) => champion && champion.id === targetChampion.id)
  }

  isFull() {
    return this.size >= this.teamSizeLimit
  }

  flattenedChampions() {
    return (this.champions.flat().filter(Boolean) as Champion[])
  }

  getTeamUniqueChampions() {
    return this.flattenedChampions().sort((a, b) => a.compare(b, []))
  }

  reset() {
    const m = 4, n = 7

    this.champions = Array.from(
      { length: m },
      () => new Array(n).fill(null)
    )

    this.size = 0
    this.teamSizeLimit = 9
  }

  getActiveTraits() {
    const distinctChampions = [
      ...new Set(
        this.flattenedChampions()
      )
    ]

    return distinctChampions.
      reduce(
        (traits, champion) => {
          champion.traits.forEach(trait => {
            traits.set(trait, (traits.get(trait) ?? 0) + 1)
          })

          return traits
        },
        new Map()
      )
  }

  getSortedActiveTraits() {
    return new Map(
      [...this.getActiveTraits()].
        sort((a, b) => {
          return a[0].compare(b[0], a[1], b[1])
        })
    )
  }
}
