import fs from 'fs'
import path from 'path'

const versions_file_path = '../public/data/versions.json'
const version = JSON.parse(fs.readFileSync(versions_file_path)).latest

const cdragon_file_path = `../public/data/${version}/raw/community-dragon/community-dragon-full.json`
const ddragon_directory_path = `../public/data/${version}/raw/data-dragon`
const mapped_directory_path =  `../public/data/${version}/raw/mapped`

const ddragon = {
  champions: 'champion',
  items: 'item',
  traits: 'trait',
  augments: 'augments',
  hero_augments: 'hero-augments',
}

const mapped = {
  championToImages: 'champion-to-images',
  championToHeroAugments: 'champion-to-hero-augments',
}

const cdragon = JSON.parse(fs.readFileSync(cdragon_file_path))

Object.keys(ddragon).forEach((component) => {
  ddragon[component] = Object.values(
    JSON.parse(
      fs.readFileSync(
        path.join(
          ddragon_directory_path,
          `tft-${ddragon[component]}.json`,
        )
      )
    ).data
  )
})

Object.keys(mapped).forEach((component) => {
  mapped[component] = JSON.parse(
    fs.readFileSync(
      path.join(
        mapped_directory_path,
        `${ddragon[component]}.json`,
      )
    )
  )
})

const items = ddragon.items.
  map((ditem) => {
    const citem = cdragon.items.
      find((citem) => ditem.id === citem.apiName)

    return {
      id: ditem.id,
      name: citem.name,
      desc: citem.desc,
      composition: citem.composition,
      image:  `/img/tft-item/${ditem.image.full}`,
    }
  }).
  filter((item) => {
    return (
      (item.id.startsWith("TFT_Item") && !item.id.startsWith("TFT_Item_Grant")) ||
      (item.id.startsWith("TFT8_Item") && item.composition.length > 0)) &&
      !item.name.startsWith("tft_item")
  })

const traits = ddragon.traits.
  map((dtrait) => {
    const ctrait = cdragon.traits.
      find((ctrait) => dtrait.id === ctrait.apiName)

    return {
      id: dtrait.id,
      name: dtrait.name,
      image: `/img/tft-trait/${dtrait.image.full}`,
      effects: ctrait.effects,
      desc: ctrait.desc
    }
  })

const augments = ddragon.augments.
  map((daugment) => {
    const caugment = cdragon.items.
      find((caugment) => caugment.apiName === daugment.id)

    return caugment
  })

let champions = ddragon.champions.
  map((dchampion) => {
    const cchampion = cdragon.champions.
      find((cchampion) => dchampion.id === cchampion.apiName)

    const traits = cchampion.traits.
      map((traitName) => {
        return traits.
          find((trait) => trait.name === traitName).id
      })

    cchampion.ability.image = `/img/tft-ability/${cchampion.ability.icon.pop()}`

    return {
      id:   dchampion.id,
      name: cchampion.name,
      cost: cchampion.cost,
      image: dchampion.image,
      traits,
      ability: cchampion.ability,
      stats: cchampion.stats,
      hero_augments: dchampion.hero_augments,
    }
  })

const championUnorderedKeys = champions.map(champion => champion.id)

const temp = hero_augments[10][1]
hero_augments[10][1] = hero_augments[11][1]
hero_augments[11][1] = temp

champions = champions.sort((a, b) => { return a.compare(b, []) }).map(champion => champion.id)
champions = [...champions.slice(0, 46), ...champions.slice(-1), ...champions.slice(46, -1)]

champions = champions.reduce((acc, curr, index) => {
  return {
    ...acc,
    [curr]: hero_augments[index].map(hero_augment => hero_augment.apiName),
  }
}, {})

console.log(hero_augments)
console.log(champions)
console.log(JSON.stringify(hash))

// const hashJson = {"TFT8_Aatrox":["TFT8_5_Augment_AatroxCarry","TFT8_5_Augment_AatroxSupport"],"TFT8_Alistar":["TFT8_5_Augment_AlistarCarry","TFT8_5_Augment_AlistarSupport"],"TFT8_Annie":["TFT8_Augment_AnnieCarry","TFT8_Augment_AnnieSupport"],"TFT8_Ashe":["TFT8_Augment_AsheCarry","TFT8_Augment_AsheSupport"],"TFT8_AurelionSol":["TFT8_Augment_AurelionSolCarry","TFT8_Augment_AurelionSolImpact"],"TFT8_BelVeth":["TFT8_Augment_BelVethCarry","TFT8_Augment_BelVethVoidmother"],"TFT8_Blitzcrank":["TFT8_Augment_BlitzcrankCarry","TFT8_Augment_BlitzcrankSupport"],"TFT8_Camille":["TFT8_Augment_CamilleCarry","TFT8_Augment_CamilleSupport"],"TFT8_Draven":["TFT8_Augment_DravenCarry","TFT8_Augment_DravenSupport"],"TFT8_Ekko":["TFT8_Augment_EkkoCarry","TFT8_Augment_EkkoSupport"],"TFT8_Ezreal":["TFT8_Augment_EzrealCarry","TFT8_Augment_EzrealSupport"],"TFT8_EzrealFuture":["TFT8_5_Augment_EzrealFutureSupport","TFT8_5_Augment_EzrealFutureCarry"],"TFT8_Fiddlesticks":["TFT8_Augment_FiddlesticksCarry","TFT8_Augment_FiddlesticksSupport"],"TFT8_Fiora":["TFT8_Augment_FioraCarry","TFT8_Augment_FioraSupport"],"TFT8_Gangplank":["TFT8_Augment_GangplankCarry","TFT8_Augment_GangplankSupport"],"TFT8_Garen":["TFT8_5_Augment_GarenCarry","TFT8_5_Augment_GarenSupport"],"TFT8_GnarBig":["TFT8_5_Augment_GnarCarry","TFT8_5_Augment_GnarSupport"],"TFT8_Janna":["TFT8_Augment_JannaCarry","TFT8_Augment_JannaSupport"],"TFT8_Jax":["TFT8_Augment_JaxASCarry","TFT8_5_Augment_JaxSupport"],"TFT8_Jhin":["TFT8_5_Augment_JhinCarry","TFT8_5_Augment_JhinSupport"],"TFT8_Jinx":["TFT8_Augment_JinxCarry","TFT8_Augment_JinxSupport"],"TFT8_Kaisa":["TFT8_Augment_KaisaCarry","TFT8_Augment_KaisaStarCrossed"],"TFT8_Kayle":["TFT8_Augment_KayleCarry","TFT8_Augment_KayleSupport"],"TFT8_Leblanc":["TFT8_Augment_LeBlancGlitch","TFT8_Augment_LeBlancSupport"],"TFT8_LeeSin":["TFT8_Augment_LeeSinCarry","TFT8_Augment_LeeSinSupport"],"TFT8_Leona":["TFT8_Augment_LeonaCarry","TFT8_Augment_LeonaSupport"],"TFT8_Lucian":["TFT8_5_Augment_LucianCarry","TFT8_5_Augment_LucianSupport"],"TFT8_Lulu":["TFT8_Augment_LuluCarry","TFT8_Augment_LuluSupport"],"TFT8_Lux":["TFT8_Augment_LuxCarry","TFT8_Augment_LuxSupport"],"TFT8_Malphite":["TFT8_Augment_MalphiteCarry","TFT8_Augment_MalphiteSupport"],"TFT8_MissFortune":["TFT8_Augment_MissFortuneCarry","TFT8_Augment_MissFortuneSupport"],"TFT8_Mordekaiser":["TFT8_Augment_MordekaiserCarry","TFT8_Augment_MordekaiserSupport"],"TFT8_Morgana":["TFT8_5_Augment_MorganaCarry","TFT8_5_Augment_MorganaSupport"],"TFT8_Nasus":["TFT8_Augment_NasusCarry","TFT8_Augment_NasusSupport"],"TFT8_Neeko":["TFT8_5_Augment_NeekoCarry","TFT8_5_Augment_NeekoSupport"],"TFT8_Nilah":["TFT8_Augment_NilahReflection","TFT8_Augment_NilahSupport"],"TFT8_Nunu":["TFT8_Augment_NunuCarry","TFT8_Augment_NunuSupport"],"TFT8_Pantheon":["TFT8_5_Augment_PantheonCarry","TFT8_5_Augment_PantheonSupport"],"TFT8_Poppy":["TFT8_Augment_PoppyCarry","TFT8_Augment_PoppySupport"],"TFT8_Pyke":["TFT8_5_Augment_PykeCarry","TFT8_5_Augment_PykeSupport"],"TFT8_Rammus":["TFT8_Augment_RammusArmor","TFT8_Augment_RammusCarry"],"TFT8_Rell":["TFT8_Augment_RellCarry","TFT8_Augment_RellSupport"],"TFT8_Renekton":["TFT8_Augment_RenektonCarry","TFT8_Augment_RenektonSupport"],"TFT8_Riven":["TFT8_Augment_RivenReverberation","TFT8_Augment_RivenSupport"],"TFT8_Samira":["TFT8_Augment_SamiraCarry","TFT8_Augment_SamiraSupport"],"TFT8_Shen":["TFT8_5_Augment_ShenCarry","TFT8_5_Augment_ShenSupport"],"TFT8b_Sivir":["TFT8_5_Augment_SivirCarry","TFT8_5_Augment_SivirSupport"],"TFT8_Sona":["TFT8_Augment_SonaExile","TFT8_Augment_SonaSupport"],"TFT8_Sylas":["TFT8_Augment_SylasCarry","TFT8_Augment_SylasSupport"],"TFT8_Syndra":["TFT8_Augment_SyndraCarry","TFT8_Augment_SyndraSupport"],"TFT8_TwistedFate":["TFT8_5_Augment_TwistedFateCarry","TFT8_5_Augment_TwistedFateSupport"],"TFT8_Urgot":["TFT8_Augment_UrgotCarry","TFT8_Augment_UrgotSupport"],"TFT8_Vayne":["TFT8_Augment_VayneCarry","TFT8_Augment_VayneSupport"],"TFT8_Vex":["TFT8_5_Augment_VexCarry","TFT8_5_Augment_VexSupport"],"TFT8_Vi":["TFT8_Augment_ViCarry","TFT8_Augment_ViSupport"],"TFT8_Viego":["TFT8_Augment_ViegoCarry"],"TFT8_Warwick":["TFT8_5_Augment_WarwickCarry","TFT8_5_Augment_WarwickCarry2","TFT8_5_Augment_WarwickSupport"],"TFT8_WuKong":["TFT8_Augment_WukongCarry","TFT8_Augment_WukongSupport"],"TFT8_Yasuo":["TFT8_5_Augment_YasuoCarry","TFT8_Augment_YasuoSupport"]}

// console.log(
//   JSON.stringify(
//     champions.reduce((acc, curr) => {
//       return {
//         ...acc,
//         [curr.id]: {
//           id: curr.id,
//           name: curr.name,
//           image: {
//             splash: curr.image.splash,
//             tile: curr.image.tile,
//             ability: curr.image.ability,
//           },
//           hero_augments: hashJson[curr.id],
//         },
//       }
//     }, {})
//   )
// )

// console.log(items)
console.log(items.length)
