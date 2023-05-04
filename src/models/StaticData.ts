import Champion from './Champion'
import Item from './Item'
import Trait from './Trait'

export default class StaticData {
  static instance = new StaticData()

  champions: Record<string, Champion> = {}
  items: Record<string, Item> = {}
  traits: Record<string, Trait> = {}
}
