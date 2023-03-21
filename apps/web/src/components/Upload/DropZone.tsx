import UploadOutline from '@components/Common/Icons/UploadOutline'
import MetaTags from '@components/Common/MetaTags'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import fileReaderStream from 'filereader-stream'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { MdCloudUpload } from 'react-icons/md'
import { ALLOWED_VIDEO_TYPES, Analytics, TRACK } from 'utils'
import useDragAndDrop from 'utils/hooks/useDragAndDrop'
import logger from 'utils/logger'

const DropZone = () => {
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const {
    dragOver,
    setDragOver,
    onDragOver,
    onDragLeave,
    fileDropError,
    setFileDropError
  } = useDragAndDrop()

  const uploadVideo = (file: File) => {
    try {
      if (file) {
        const preview = URL.createObjectURL(file)
        setUploadedVideo({
          stream: fileReaderStream(file),
          preview,
          videoType: file?.type || 'video/mp4',
          file
        })
      }
    } catch (error) {
      toast.error('Error uploading file')
      logger.error('[Error Upload Video]', error)
    }
  }

  const validateFile = (file: File) => {
    if (!ALLOWED_VIDEO_TYPES.includes(file?.type)) {
      const errorMessage = 'Video format not supported!'
      toast.error(errorMessage)
      return setFileDropError(errorMessage)
    }
    uploadVideo(file)
  }

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragOver(false)
    validateFile(e?.dataTransfer?.files[0])
  }

  const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      validateFile(e?.target?.files[0])
    }
  }

  return (
    <div>
      <div className="relative flex flex-1 flex-col items-center justify-center">
        <label
          htmlFor="dropVideo"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            type="file"
            className="hidden"
            onChange={onChooseFile}
            id="dropVideo"
            accept={ALLOWED_VIDEO_TYPES.join(',')}
          />
          <span className="mb-6 flex justify-center opacity-80">
            <MdCloudUpload className="h-14 w-14" />
          </span>
          <span className="space-y-10 md:space-y-14">
            <div className="">
              <span className='text-2xl font-semibold md:text-4xl'>
                Select video to upload
              </span> <br />
              <span>or drag and drop a file</span>
            </div>
            <div className='h-20'>
              <label
                htmlFor="chooseVideo"
                className="btn-secondary cursor-pointer px-8 py-4 text-lg"
              >
                Select File
                <input
                  id="chooseVideo"
                  onChange={onChooseFile}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_VIDEO_TYPES.join(',')}
                />
              </label>
            </div>
            {fileDropError && (
              <div className="font-medium text-red-500">{fileDropError}</div>
            )}
          </span>
        </label>
      </div>
    </div>
  )
}

export default DropZone
