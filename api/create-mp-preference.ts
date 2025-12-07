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
        title: body.item_title,
        unit_price: parsePrice(body.unit_price),
        quantity: 1,
      },
    ],
    external_reference: JSON.stringify({ user_id: body.user_id, organization_id: body.organization_id, plan_type: body.plan_type }),
    payer: { email: body.payer_email },
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
  return res.status(200).json({ init_point: data.init_point })
}

