import React from 'react'
import { FcMusic } from 'react-icons/fc'
import { GiHealthNormal, GiMaterialsScience, GiTechnoHeart } from 'react-icons/gi'
import { MdOutlineFastfood, MdSportsBasketball, MdCardTravel } from 'react-icons/md'
import { BiHappyAlt, BiBitcoin, BiNews, BiPodcast } from 'react-icons/bi'
import { SiWeb3Dotjs } from 'react-icons/si'
import { FaRegSmileBeam, FaCode } from 'react-icons/fa'


export const CREATOR_VIDEO_CATEGORIES = [

  {
    name: 'Crypto',
    tag: 'crypto',
    icon: <BiBitcoin />
  },
  {
    name: 'Coding',
    tag: 'coding',
    icon: <FaCode />
  }
  , {
    name: 'Meme',
    tag: 'meme',
    icon: <FaRegSmileBeam />
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
    icon: <GiTechnoHeart />
  },
  {
    name: 'Web3',
    tag: 'web3',
    icon: <SiWeb3Dotjs />
  },
  {
    name: 'Technology',
    tag: 'technology',
    icon: <GiMaterialsScience />
  },
]
