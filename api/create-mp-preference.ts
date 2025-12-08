export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  const body = req.body
  const token = process.env.MP_ACCESS_TOKEN as string
  const site = process.env.SITE_URL as string
  if (!token) return res.status(500).send('Missing MP_ACCESS_TOKEN')

  const parsePrice = (v: unknown): number => {
    if (typeof v === 'number') return v
    let s = String(v ?? '').trim()
    s = s.replace(/[R$\s]/gi, '')
    if (s.includes('.') && s.includes(',')) {
      s = s.replace(/\./g, '').replace(',', '.')
    } else {
      s = s.replace(',', '.')
    }
    const n = parseFloat(s)
    return isNaN(n) ? 0 : n
  }

  const payload = {
    items: [
      {
        title: body.title ?? body.item_title,
        unit_price: parsePrice(body.unit_price),
        quantity: Number(body.quantity ?? 1),
      },
    ],
    external_reference: JSON.stringify({ user_id: body.user_id, organization_id: body.organization_id, plan_type: body.plan_type }),
    payer: { email: body.email ?? body.payer_email },
    back_urls: {
      success: `${site}/payment-success?plan=${body.plan_type}`,
      failure: `${site}/`,
      pending: `${site}/`,
    },
    auto_return: 'approved',
  }

  const resp = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const data = await resp.json()
  if (!resp.ok) {
    console.error('ERRO MP DETALHADO:', JSON.stringify(data))
    return res.status(resp.status).json({ error: data?.message || 'Erro na API do Mercado Pago', details: data })
  }
  console.log('DEBUG MP NO SERVIDOR:', JSON.stringify(data))
  const init_point = data?.init_point || data?.body?.init_point || data?.response?.init_point || data?.sandbox_init_point || data?.point_of_interaction?.transaction_data?.ticket_url
  return res.status(200).json({ debug_mode: true, full_response: data, init_point })
}

