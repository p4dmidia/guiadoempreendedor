import { useEffect, useMemo, useState } from 'react'
import { Globe } from 'lucide-react'

type LangOption = { code: string; label: string; flag: string }

const options: LangOption[] = [
  { code: 'pt', label: 'Português (Brasil)', flag: 'https://flagcdn.com/w40/br.png' },
  { code: 'en', label: 'Inglês', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'fr', label: 'Francês', flag: 'https://flagcdn.com/w40/fr.png' },
  { code: 'es', label: 'Espanhol', flag: 'https://flagcdn.com/w40/es.png' },
]

function getCurrentLang(): string {
  const m = document.cookie.match(/googtrans=\/\w+\/([a-zA-Z-]+)/)
  return m?.[1] || 'pt'
}

function setTranslateCookie(targetLang: string) {
  const v = `/pt/${targetLang}`
  document.cookie = `googtrans=${v}; path=/`
  document.cookie = `googtrans=${v}; path=/; domain=${window.location.hostname}`
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const current = useMemo(() => getCurrentLang(), [])
  const active = options.find(o => o.code === current) || options[0]

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const t = e.target as HTMLElement
      if (!t.closest('#lang-switcher')) setOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div id="lang-switcher" className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 text-white hover:text-accent transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {active ? (
          <img src={active.flag} alt={active.label} className="w-7 h-5 rounded-sm object-contain" />
        ) : (
          <Globe className="w-6 h-6" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-primary rounded-md shadow-lg border border-gray-200">
          {options.map(opt => (
            <button
              key={opt.code}
              onClick={() => { setTranslateCookie(opt.code); window.location.reload() }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
            >
              <img src={opt.flag} alt={opt.label} className="w-6 h-4 rounded-sm object-contain" />
              <span className="text-sm">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
