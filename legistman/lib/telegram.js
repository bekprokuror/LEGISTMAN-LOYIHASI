const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

export async function sendTelegramMessage(chatId, text, replyMarkup = null) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  }
  if (replyMarkup) body.reply_markup = replyMarkup

  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function notifyAdmin(user) {
  const adminId = process.env.TELEGRAM_ADMIN_ID
  const text =
    `⚖️ <b>LEGISTMAN — Yangi a'zolik so'rovi</b>\n\n` +
    `👤 <b>Ism:</b> ${user.full_name}\n` +
    `📱 <b>Telegram:</b> @${user.username || 'nomalum'}\n` +
    `🆔 <b>ID:</b> <code>${user.telegram_id}</code>\n` +
    `📞 <b>Telefon:</b> ${user.phone || 'kiritilmagan'}\n` +
    `📝 <b>Maqsad:</b> ${user.purpose || 'kiritilmagan'}\n\n` +
    `Quyidagi tugmalardan birini bosing:`

  const replyMarkup = {
    inline_keyboard: [
      [
        { text: '✅ Tasdiqlash', callback_data: `approve_${user.telegram_id}` },
        { text: '❌ Rad etish', callback_data: `reject_${user.telegram_id}` },
      ],
    ],
  }

  await sendTelegramMessage(adminId, text, replyMarkup)
}
