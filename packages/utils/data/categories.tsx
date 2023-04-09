import { FcMusic } from 'react-icons/fc'
import { GiHealthNormal, GiMaterialsScience } from 'react-icons/gi'
import { MdOutlineFastfood, MdSportsBasketball, MdCardTravel } from 'react-icons/md'
import { BiHappyAlt, BiBitcoin, BiNews, BiPodcast } from 'react-icons/bi'


export const CREATOR_VIDEO_CATEGORIES = [

  {
    name: 'Crypto',
    tag: 'crypto',
    icon: <BiBitcoin />
  },
  {
    name: 'Coding',
    tag: 'coding',
    icon: <BiBitcoin />
  }
  , {
    name: 'Meme',
    tag: 'meme',
    icon: <BiPodcast />
  },
  {
    name: 'Music', tag: 'music',
    icon: <FcMusic />
  },
  {
    name: 'News',
    tag: 'news',
    icon: <BiNews />
  },
  {
    name: 'NFT',
    tag: 'nft',
    icon: <GiHealthNormal />
  },
  {
    name: 'Technology',
    tag: 'technology',
    icon: <GiMaterialsScience />
  },
  {
    name: 'Travel',
    tag: 'travel',
    icon: <MdCardTravel />
  },
]
