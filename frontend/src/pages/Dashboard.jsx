import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .then(({ data }) => setEvents(data))
  }, [])

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <ul>
        {events.map(e => (
          <li key={e.id}>{e.title}</li>
        ))}
      </ul>
    </div>
  )
}
