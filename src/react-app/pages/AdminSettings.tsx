import { useEffect, useState } from 'react'
import { orgSelect, orgUpdate } from '@/react-app/lib/orgQueries'
import AdminSidebar from '@/react-app/components/AdminSidebar'

export default function AdminSettings() {
  const [lvl1, setLvl1] = useState<number>(10)
  const [lvl2, setLvl2] = useState<number>(5)
  const [lvl3, setLvl3] = useState<number>(2.5)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data } = await orgSelect('commission_settings', 'levels').maybeSingle()
      const levels = (data as any)?.levels || {}
      if (levels['1'] != null) setLvl1(Number(levels['1']))
      if (levels['2'] != null) setLvl2(Number(levels['2']))
      if (levels['3'] != null) setLvl3(Number(levels['3']))
    }
    load()
  }, [])

  const save = async () => {
    setSaving(true)
    const levels = { '1': lvl1, '2': lvl2, '3': lvl3 }
    await orgUpdate('commission_settings', {}, { levels })
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-body">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl">
            <h1 className="font-poppins font-bold text-2xl text-primary mb-6">Configurações de Comissão</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-text-light font-medium mb-2">Nível 1 (%)</label>
                <input type="number" value={lvl1} onChange={e => setLvl1(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-text-light font-medium mb-2">Nível 2 (%)</label>
                <input type="number" value={lvl2} onChange={e => setLvl2(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-text-light font-medium mb-2">Nível 3 (%)</label>
                <input type="number" value={lvl3} onChange={e => setLvl3(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            <div className="mt-6">
              <button onClick={save} disabled={saving} className="px-6 py-3 bg-cta text-white rounded-md font-medium hover:bg-opacity-90 transition-all">{saving ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

