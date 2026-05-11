import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  const { adminKey } = req.query
  if (adminKey !== process.env.TELEGRAM_ADMIN_ID) {
    return res.status(403).json({ error: 'Ruxsat yoq' })
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
