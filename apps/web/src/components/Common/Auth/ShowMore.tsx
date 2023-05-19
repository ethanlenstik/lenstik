import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import DropMenu from '@components/UIElements/DropMenu'
import MoonOutline from '../Icons/MoonOutline'
import SunOutline from '../Icons/SunOutline'
import { FiHelpCircle } from 'react-icons/fi'
import { VscFeedback } from 'react-icons/vsc'
import { useTheme } from 'next-themes'




const ShowMore = () => {
  const { theme, setTheme } = useTheme()
  return (
    <DropMenu trigger={
      < button >
        <BsThreeDotsVertical />
      </button >
    }>
      <div className="mt-2 w-56 overflow-hidden rounded-lg  border bg-gray-100 shadow dark:border-gray-800 dark:bg-black">
        <div className=" m-1.5 overflow-hidden rounded-gl ">
          <div className="text-sm">
            {/* <button type="button"
              className="flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {

              }}>
              <VscFeedback />
              <span className="truncate whitespace-nowrap">Feedback</span>
            </button>
            <button type="button"
              className="flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {

              }}>
              <FiHelpCircle />
              <span className="truncate whitespace-nowrap">Help</span>
            </button> */}
            <button
              type="button"
              className="flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark')
              }}
            >
              {theme === 'dark' ? (
                <SunOutline className="h-4 w-4" />
              ) : (
                <MoonOutline className="h-4 w-4" />
              )}
              <span className="truncate whitespace-nowrap">
                {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
              </span>
            </button>

          </div>
        </div>
      </div>
    </DropMenu >)
}

export default ShowMore
