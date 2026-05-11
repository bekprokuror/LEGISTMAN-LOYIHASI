import { supabase } from '@/lib/supabase'
import { sendTelegramMessage } from '@/lib/telegram'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { callback_query, message } = req.body

  // /start buyrug'i
  if (message?.text === '/start') {
    await sendTelegramMessage(
      message.chat.id,
      `⚖️ <b>LEGISTMAN Bot</b>\n\nSalom! Men LEGISTMAN platformasining rasmiy botiman.\n\n` +
      `Bu bot orqali siz a'zolik so'rovlarini boshqarasiz.\n\n` +
      `Platforma: <a href="https://legistman.vercel.app">legistman.vercel.app</a>`
    )
  }

  // Tasdiqlash yoki rad etish
  if (callback_query) {
    const adminId = process.env.TELEGRAM_ADMIN_ID
    const callerId = String(callback_query.from.id)

    if (callerId !== adminId) {
      return res.status(200).json({ ok: true })
    }

    const data = callback_query.data
    const messageId = callback_query.message.message_id
    const chatId = callback_query.message.chat.id

    if (data.startsWith('approve_')) {
      const telegramId = data.replace('approve_', '')

      const { data: user } = await supabase
        .from('users')
        .update({ status: 'approved' })
        .eq('telegram_id', telegramId)
        .select()
        .single()

      // Foydalanuvchiga xabar yubar
      await sendTelegramMessage(
        telegramId,
        `✅ <b>Tabriklaymiz!</b>\n\nSizning LEGISTMAN a'zoligingiz tasdiqlandi!\n\n` +
        `Endi platformaga kirishingiz mumkin:\n` +
        `🔗 <a href="https://legistman.vercel.app/login">legistman.vercel.app/login</a>\n\n` +
        `Telegram ID: <code>${telegramId}</code>`
      )

      // Admin xabarini yangilash
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: `✅ <b>${user?.full_name}</b> — TASDIQLANDI`,
          parse_mode: 'HTML',
        }),
      })
    }

    if (data.startsWith('reject_')) {
      const telegramId = data.replace('reject_', '')

      const { data: user } = await supabase
        .from('users')
        .update({ status: 'rejected' })
        .eq('telegram_id', telegramId)
        .select()
        .single()

      // Foydalanuvchiga xabar yubar
      await sendTelegramMessage(
        telegramId,
        `❌ <b>Afsuski</b>, sizning so'rovingiz rad etildi.\n\n` +
        `Qo'shimcha ma'lumot uchun admin bilan bog'laning.`
      )

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: `❌ <b>${user?.full_name}</b> — RAD ETILDI`,
          parse_mode: 'HTML',
        }),
      })
    }
  }

  return res.status(200).json({ ok: true })
}
