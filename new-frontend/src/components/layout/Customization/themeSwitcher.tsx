
import { useLayoutEffect, useState } from 'react'
import clsx from 'clsx'
// import { useTheme } from '@/context/theme-context'

const COLOR_THEMES = [
      { label: 'Default', value: 'default', color: 'primary' },
  { label: 'violet', value: 'violet', color: '#d337db' },
  { label: 'Blue', value: 'blue', color: '#60a5fa' },
  { label: 'Green', value: 'green', color: '#4ade80' },
  { label: 'Purple', value: 'purple', color: '#a78bfa' },
  { label: 'Orange', value: 'orange', color: '#f97316' },
    { label: 'Rose Gold', value: 'rose-gold', color: '#b76e79' }
]

export function ThemeSwitcher({ hidden = false }: { hidden?: boolean }) {
//   const { theme, setTheme } = useTheme()
  const [colorTheme, setColorTheme] = useState<string>('default')

  useLayoutEffect(() => {
    const stored = localStorage.getItem('color-theme')
    const initial = stored && !['light', 'dark', 'system'].includes(stored)
      ? stored
      : 'default'

    setColorTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const applyColorTheme = (value: string) => {
    setColorTheme(value)
    localStorage.setItem('color-theme', value)
    document.documentElement.setAttribute('data-theme', value)
  }

  if (!colorTheme || hidden) return null

  return (
    <div className="p-0">
      <h2 className="text-sm font-medium text-foreground mb-2">Change Color Theme:</h2>
      <div className="flex gap-3 flex-wrap">
        {COLOR_THEMES.map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => applyColorTheme(themeOption.value)}
            className={clsx(
              'w-10 h-10 rounded-full border-2 transition-all duration-300',
              colorTheme === themeOption.value
                ? 'border-primary ring-2 ring-primary/50'
                : 'border-muted'
            )}
            style={{ backgroundColor: themeOption.color }}
            aria-label={`Set color theme to ${themeOption.label}`}
          />
        ))}
      </div>

      {/* <h2 className="text-sm font-medium text-foreground mt-6 mb-2">Mode:</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => setTheme('light')}
          className={clsx(
            'px-4 py-2 rounded-md border text-sm font-medium',
            theme === 'light'
              ? 'bg-primary text-white'
              : 'bg-background text-foreground border-input'
          )}
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={clsx(
            'px-4 py-2 rounded-md border text-sm font-medium',
            theme === 'dark'
              ? 'bg-primary text-white'
              : 'bg-background text-foreground border-input'
          )}
        >
          Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          className={clsx(
            'px-4 py-2 rounded-md border text-sm font-medium',
            theme === 'system'
              ? 'bg-primary text-white'
              : 'bg-background text-foreground border-input'
          )}
        >
          System
        </button>
      </div> */}
    </div>
  )
}
