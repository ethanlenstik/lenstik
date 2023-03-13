import {FcMusic} from 'react-icons/fc'
import { GiHealthNormal, GiMaterialsScience } from 'react-icons/gi'
import { MdOutlineFastfood, MdSportsBasketball, MdCardTravel } from 'react-icons/md'
import { BiHappyAlt, BiBitcoin, BiNews, BiPodcast } from 'react-icons/bi'


export const CREATOR_VIDEO_CATEGORIES = [
 
  { name: 'Music', tag: 'music', 
  icon: <FcMusic /> },
  {
    name: 'Podcast',
    tag: 'podcast',
    icon: <BiPodcast />
  },
  {
    name: 'Health',
    tag: 'health',
    icon: <GiHealthNormal />
  },
  {
    name: 'Food',
    tag: 'food',
    icon: <MdOutlineFastfood />
  },
  {
    name: 'Entertainment',
    tag: 'entertainment',
    icon: <BiHappyAlt />
  },
  {
    name: 'Crypto',
    tag: 'crypto',
    icon: <BiBitcoin />
  },
  {
    name: 'News',
    tag: 'news',
    icon: <BiNews />
  },
  
  {
    name: 'Technology',
    tag: 'technology',
    icon: <GiMaterialsScience />
  },
  {
    name: 'Sports',
    tag: 'sports',
    icon: <MdSportsBasketball />
  },
  {
    name: 'Travel',
    tag: 'travel',
    icon: <MdCardTravel />
  },
]
