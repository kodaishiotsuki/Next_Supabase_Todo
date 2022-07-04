import create from 'zustand' //状態管理
import { EditedTask, EditedNotice } from './types/types'

type State = {
  editedTask: EditedTask
  editedNotice: EditedNotice
  //stateの更新
  updateEditedTask: (payload: EditedTask) => void
  updateEditedNotice: (payload: EditedNotice) => void
  //stateのリセット
  resetEditedTask: () => void
  resetEditedNotice: () => void
}

const useStore = create<State>((set) => ({
  editedTask: { id: '', title: '' },
  editedNotice: { id: '', content: '' },
  updateEditedTask: (payload) =>
    set({
      editedTask: {
        id: payload.id,
        title: payload.title,
      },
    }),
  resetEditedTask: () => set({ editedTask: { id: '', title: '' } }),
  updateEditedNotice: (payload) =>
    set({
      editedNotice: {
        id: payload.id,
        content: payload.content,
      },
    }),
  resetEditedNotice: () => set({ editedNotice: { id: '', content: '' } }),
}))

export default useStore