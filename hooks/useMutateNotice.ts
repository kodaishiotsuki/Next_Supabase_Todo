import { EditedNotice } from '../types/types'
import { useMutation, useQueryClient } from 'react-query'
import useStore from '../store'
import { Notice } from '../types/types'
import { supabase } from '../utils/supabase'

export const useMutateNotice = () => {
  const queryClient = useQueryClient()
  const reset = useStore((state) => state.resetEditedNotice)

  //noticeの新規作成
  const createNoticeMutation = useMutation(
    async (notice: Omit<Notice, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('notices').insert(notice)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        const previousNotices = queryClient.getQueryData<Notice[]>('notices')
        if (previousNotices) {
          queryClient.setQueryData('notices', [...previousNotices], res[0]) //Taskは配列[]で返ってくるため最初を取り出す→res[0]
        }
        reset() //初期化
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  //noticesの更新
  const updateNoticeMutation = useMutation(
    async (notice: EditedNotice) => {
      const { data, error } = await supabase
        .from('notices')
        .update({ content: notice.content })
        .eq('id', notice.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res, variables) => {
        const previousNotices = queryClient.getQueryData<Notice[]>('notices')
        if (previousNotices) {
          queryClient.setQueryData(
            'notices',
            previousNotices.map((notice) =>
              notice.id === variables.id ? res[0] : notice
            )
          )
        }
        reset() //初期化
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  //noticeの削除
  const deleteNoticeMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (_, variables) => {
        const previousNotices = queryClient.getQueryData<Notice[]>('notices')
        if (previousNotices) {
          queryClient.setQueryData(
            'notices',
            previousNotices.filter((notice) => notice.id !== variables)
          )
        }
        reset() //初期化
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  return { deleteNoticeMutation, createNoticeMutation, updateNoticeMutation }
}
