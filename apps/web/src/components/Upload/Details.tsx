import Alert from '@components/Common/Alert'
import { Button } from '@components/UIElements/Button'
import InputMentions from '@components/UIElements/InputMentions'
import RadioInput from '@components/UIElements/RadioInput'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { AiFillCloseCircle } from 'react-icons/ai'
import { MdOutlineSlowMotionVideo } from 'react-icons/md'
import { z } from 'zod'

import Category from './Category'
import CollectModule from './CollectModule'
import ReferenceModule from './ReferenceModule'
import Video from './Video'
import DropZone from './DropZone'
import PreviewVideo from './PreviewVideo'
import ChooseThumbnail from './ChooseThumbnail'
import toast from 'react-hot-toast'

const ContentAlert = ({ message }: { message: ReactNode }) => (
  <div className="mt-6">
    <Alert variant="danger">
      <span className="inline-flex items-center text-sm">
        <AiFillCloseCircle className="mr-3 text-xl text-red-500" />
        {message}
      </span>
    </Alert>
  </div>
)

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: 'Title should be atleast 5 characters' })
    .max(100, { message: 'Title should not exceed 100 characters' }),
  description: z
    .string()
    .trim()
    .max(5000, { message: 'Description should not exceed 5000 characters' }),
  isSensitiveContent: z.boolean()
})

export type VideoFormData = z.infer<typeof formSchema>

type Props = {
  onUpload: (data: VideoFormData) => void
  onCancel: () => void
}

const Details: FC<Props> = ({ onUpload, onCancel }) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)

  const {
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    watch,
    clearErrors
  } = useForm<VideoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isSensitiveContent: uploadedVideo.isSensitiveContent ?? false,
      title: uploadedVideo.title,
      description: uploadedVideo.description
    }
  })

  const onSubmitForm = (data: VideoFormData) => {
    onUpload(data)
  }


  return (
    <div className='flex gap-10 pb-20 mt-20 max-md:flex-wrap justify-center'>
      <div className={clsx(
        'grid  text-center focus:outline-none m-0 flex-0 center'
      )}>
        <Video />
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="flex-1 shrink-1 flex justify-between flex-col">
        <div className="mb-10 gap-5 md:grid-cols-2">
          <div className="flex flex-col justify-between">
            <div>
              <div className="relative">
                <InputMentions
                  label="Caption"
                  autoComplete="off"
                  validationError={errors.title?.message}
                  value={watch('title')}
                  onContentChange={(value) => {
                    setValue('title', value)
                    clearErrors('title')
                  }}
                  mentionsSelector="input-mentions-single rounded-lg"
                />
                <div className="absolute top-0 right-1 mt-1 flex items-center justify-end">
                  <span
                    className={clsx('text-[10px] opacity-50', {
                      'text-red-500 !opacity-100': watch('title')?.length > 100
                    })}
                  >
                    {watch('title')?.length}/100
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <ChooseThumbnail label="Thumbnail" file={uploadedVideo.file} />
              </div>
              <div className='mt-5'>
                <InputMentions
                  label="Description"
                  placeholder="Describe more about your video"
                  autoComplete="off"
                  validationError={errors.description?.message}
                  value={watch('description')}
                  onContentChange={(value) => {
                    setValue('description', value)
                    clearErrors('description')
                  }}
                  rows={3}
                  mentionsSelector="input-mentions-textarea"
                />
              </div>
              <div className="mt-5">
                <CollectModule />
              </div>
              <div className="mt-5">
                <Category />
              </div>
              <div className="mt-5">
                <ReferenceModule />
              </div>
              <div className="mt-5">
                <RadioInput
                  checked={watch('isSensitiveContent')}
                  onChange={(checked) => {
                    setValue('isSensitiveContent', checked)
                  }}
                  question={
                    <span>
                      Does this video contain sensitive information that targets
                      an adult audience?
                    </span>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {uploadedVideo.isNSFWThumbnail ? (
          <ContentAlert
            message={
              <span>
                Sorry! <b className="px-0.5">Selected thumbnail</b> image has
                tripped some content warnings. It contains NSFW content, choose
                different image to post.
              </span>
            }
          />
        ) : uploadedVideo.isNSFW ? (
          <ContentAlert
            message={
              <span>
                Sorry! Something about this video has tripped some content
                warnings. It contains NSFW content in some frames, and so the
                video is not allowed to post on Lenstube!
              </span>
            }
          />
        ) : (
          <div className="mt-4 flex items-center justify-end space-x-2">
            <Button type="button" variant="hover" onClick={() => onCancel()}>
              Reset
            </Button>
            <Button
              loading={uploadedVideo.loading || uploadedVideo.uploadingThumbnail}
              type="submit"
            >
              {uploadedVideo.uploadingThumbnail
                ? 'Uploading thumbnail'
                : uploadedVideo.buttonText}
            </Button>
          </div>
        )}
      </form>
    </div>

  )
}

export default Details
