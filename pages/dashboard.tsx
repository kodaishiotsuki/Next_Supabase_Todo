import { LogoutIcon } from '@heroicons/react/solid'
import { NextPage } from 'next'
import { supabase } from '../utils/supabase'
import { Layout } from '../components/Layout'

const Dashboard: NextPage = () => {
  const signout = () => {
    supabase.auth.signOut()
  }
  return (
    <Layout title="Dashboard">
      <LogoutIcon
        onClick={signout}
        className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
      />
    </Layout>
  )
}

export default Dashboard
