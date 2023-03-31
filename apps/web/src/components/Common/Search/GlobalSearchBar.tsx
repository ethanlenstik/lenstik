import { useLazyQuery } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import type { Profile, Publication } from 'lens'
import {
  SearchProfilesDocument,
  SearchPublicationsDocument,
  SearchRequestTypes
} from 'lens'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import {
  Analytics,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  TRACK
} from 'utils'
import useDebounce from 'utils/hooks/useDebounce'
import useOutsideClick from 'utils/hooks/useOutsideClick'

import SearchOutline from '../Icons/SearchOutline'
import Channels from './Channels'
import Videos from './Videos'

interface Props {
  onSearchResults?: () => void
}

const GlobalSearchBar: FC<Props> = ({ onSearchResults }) => {
  const [activeSearch, setActiveSearch] = useState(SearchRequestTypes.Profile)
  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce<string>(keyword, 500)
  const resultsRef = useRef(null)
  useOutsideClick(resultsRef, () => setKeyword(''))

  const [searchChannels, { data, loading }] = useLazyQuery(SearchProfilesDocument
    // activeSearch === 'PROFILE'
    //   ? SearchProfilesDocument
    //   : SearchPublicationsDocument
  )

  const [searchChannePublications, { data: dataPublications, loading: loadingPulication }] = useLazyQuery(SearchPublicationsDocument)

  const onDebounce = () => {
    if (keyword.trim().length) {
      searchChannels({
        variables: {
          request: {
            type: 'PROFILE',
            query: keyword,
            limit: 10,
            sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
            customFilters: LENS_CUSTOM_FILTERS
          }
        }
      })
      searchChannePublications({
        variables: {
          request: {
            type: 'PUBLICATION',
            query: keyword,
            limit: 10,
            sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
            customFilters: LENS_CUSTOM_FILTERS
          }
        }
      })
    }
  }

  const channels = data?.search?.items
  const video = dataPublications?.search?.items

  useEffect(() => {
    onDebounce()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, activeSearch])

  const clearSearch = () => {
    setKeyword('')
    onSearchResults?.()
  }

  return (
    <div className="md:w-[415px] md:ml-4" data-testid="global-search">
      <div ref={resultsRef}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 sm:text-sm">
            <input
              className="w-full bg-transparent py-2.5 pl-4 pr-10 text-sm border rounded-full"
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search videos and accounts"
              value={keyword}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 border-l border-l-gray-300 pl-3 my-auto h-[28px]">
              <SearchOutline
                className="h-4 w-4 text-gray-400 ml-1"
                aria-hidden="true"
              />
            </div>
          </div>
          <div
            className={clsx(
              'dark:bg-theme z-10 mt-1 w-full overflow-hidden rounded-sm bg-white text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm md:absolute  ml-82',
              { hidden: debouncedValue.length === 0 }
            )}
          >

            <div
              className="no-scrollbar max-h-[80vh] overflow-y-auto focus:outline-none "
              data-testid="search-channels-panel"
            >
              <div>
                {dataPublications?.search?.__typename === 'PublicationSearchResult' && (
                  <Videos
                    results={video as Publication[]}
                    loading={loadingPulication}
                    clearSearch={clearSearch}
                  />
                )}
              </div>
              <h3 className='ml-[10px] font-medium text-slate-500'>Accounts</h3>
              <div>
                {data?.search?.__typename === 'ProfileSearchResult' && (
                  <Channels
                    results={channels as Profile[]}
                    loading={loading}
                    clearSearch={clearSearch}
                  />
                )}

              </div>

            </div>


            {loading && (
              <div className="flex justify-center p-5">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default GlobalSearchBar
