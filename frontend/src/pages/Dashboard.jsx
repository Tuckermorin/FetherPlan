import { useAuth } from '../context/AuthContext'
import EventsList from './EventsList'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div style={{ paddingTop: '100px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Welcome, {user.email}</h1>
      <EventsList />
    </div>
  )
}
