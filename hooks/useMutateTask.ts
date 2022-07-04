import { EditedTask } from '../types/types'
import { useMutation, useQueryClient } from 'react-query'
import useStore from '../store'
import { Task } from '../types/types'
import { supabase } from '../utils/supabase'

export const useMutateTask = () => {
  const queryClient = useQueryClient()
  const reset = useStore((state) => state.resetEditedTask)

  //todoの新規作成
  const createTaskMutation = useMutation(
    async (task: Omit<Task, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('todos').insert(task)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>('todos')
        if (previousTodos) {
          queryClient.setQueryData('todos', [...previousTodos], res[0]) //Taskは配列[]で返ってくるため最初を取り出す→res[0]
        }
        reset() //初期化
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  //todoの更新
  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ title: task.title })
        .eq('id', task.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('todos')
        if (previousTodos) {
          queryClient.setQueryData(
            'todos',
            previousTodos.map((task) =>
              task.id === variables.id ? res[0] : task
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

  //todoの削除
  const deleteTaskMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase.from('todos').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (_, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('todos')
        if (previousTodos) {
          queryClient.setQueryData(
            'todos',
            previousTodos.filter((task) => task.id !== variables)
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
  return { deleteTaskMutation, createTaskMutation, updateTaskMutation }
}
