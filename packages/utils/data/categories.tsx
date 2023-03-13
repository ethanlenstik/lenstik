import {FcMusic} from 'react-icons/fc'
import { GiHealthNormal, GiComputing } from 'react-icons/gi'
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
    name: 'Health & Fitness',
    tag: 'health',
    icon: <GiHealthNormal />
  },
  {
    name: 'Food & Cooking',
    tag: 'food',
    icon: <MdOutlineFastfood />
  },
  {
    name: 'Entertainment',
    tag: 'entertainment',
    icon: <BiHappyAlt />
  },
  {
    name: 'Crypto currency',
    tag: 'crypto',
    icon: <BiBitcoin />
  },
  {
    name: 'News & Politics',
    tag: 'news',
    icon: <BiNews />
  },
  
  {
    name: 'Science & Technology',
    tag: 'technology',
    icon: <GiComputing className='p-2' />
  },
  {
    name: 'Sports',
    tag: 'sports',
    icon: <MdSportsBasketball />
  },
  {
    name: 'Travel & Events',
    tag: 'travel',
    icon: <MdCardTravel />
  },
]
