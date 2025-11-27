import { redirect } from 'next/navigation'

export default function AdminLoginPage() {
  // Server-side redirect to main login
  redirect('/login')
}