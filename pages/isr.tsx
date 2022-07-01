import { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Layout } from '../components/Layout'
import { supabase } from '../utils/supabase'
import { Task, Notice } from '../types/types'

//supabaseからデータ取得
export const getStaticProps: GetStaticProps = async () => {
  console.log('getStaticProps/isr invoked')
  const { data: tasks } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: true })
  const { data: notices } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: true })
  return {
    props: { tasks, notices },
    revalidate: 5, //ISRはrevalidate必須
  }
}

//型の定義
type StaticProps = {
  tasks: Task[]
  notices: Notice[]
}

const Isr: NextPage<StaticProps> = ({ tasks, notices }) => {
  return (
    <Layout title="ISR">
      <p className="mb-3 text-green-500">ISR</p>
      <ul className="mb-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <p className="text-lg font-extrabold">{task.title}</p>
          </li>
        ))}
      </ul>
      <ul className="mb-3">
        {notices.map((notice) => (
          <li key={notice.id}>
            <p className="text-lg font-extrabold">{notice.content}</p>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default Isr
