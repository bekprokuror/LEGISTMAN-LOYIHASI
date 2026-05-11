import { supabase } from '@/lib/supabase'
import { notifyAdmin } from '@/lib/telegram'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { telegram_id, full_name, username, phone, purpose } = req.body

  if (!telegram_id || !full_name) {
    return res.status(400).json({ error: 'telegram_id va full_name majburiy' })
  }

  // Avval mavjudligini tekshir
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegram_id)
    .single()

  if (existing) {
    return res.status(200).json({ status: existing.status, existing: true })
  }

  // Yangi foydalanuvchi qo'sh
  const { data, error } = await supabase.from('users').insert([
    { telegram_id, full_name, username, phone, purpose, status: 'pending' },
  ]).select().single()

  if (error) return res.status(500).json({ error: error.message })

  // Adminga xabar yubar
  await notifyAdmin(data)

  return res.status(200).json({ success: true, status: 'pending' })
}
