import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  const { telegram_id } = req.query
  if (!telegram_id) return res.status(400).json({ error: 'telegram_id kerak' })

  const { data, error } = await supabase
    .from('users')
    .select('status, full_name')
    .eq('telegram_id', telegram_id)
    .single()

  if (error || !data) return res.status(404).json({ status: 'not_found' })

  return res.status(200).json(data)
}
