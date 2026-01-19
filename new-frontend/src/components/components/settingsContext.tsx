


import { createContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { ThemePreset } from '../components/types/theme'
import { defaultThemeState } from '../components/config/theme'
import { useLocalStorage } from './hooks/useLocalStorage'
import { getPresetThemeStyles } from './utils/theme-presets'

export type Mode = 'system' | 'light' | 'dark'

export type ThemeType = {
  preset?: string | null
  styles?: ThemePreset
}

export type ThemeSettings = {
  theme: ThemeType
  savedThemes?: Array<{
    name: string
    styles: ThemePreset
  }>
}

export type ModeSettings = {
  mode: Mode
}

export type Settings = ModeSettings & ThemeSettings

type SettingsContextProps = {
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  applyThemePreset: (preset: string) => void
  resetToDefault: () => void
  hasStateChanged: () => boolean
}

type Props = {
  children: ReactNode
}

// Defaults
const initialSettings: Settings = {
  mode: 'light',
  theme: {
    preset: null,
    styles: defaultThemeState
  },
  savedThemes: [],
}

export const SettingsContext = createContext<SettingsContextProps | null>(null)

export const SettingsProvider = ({ children }: Props) => {
  const [settings, setSettings] = useLocalStorage<Settings>('divakar-theme-settings', initialSettings)

  // Apply dark mode class to <html>
  useEffect(() => {
    const root = document.documentElement
    if (settings.mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [settings.mode])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      theme: {
        ...prev.theme,
        ...newSettings.theme,
      },
      savedThemes: newSettings.savedThemes ?? prev.savedThemes,
    }))
  }

  const applyThemePreset = (preset: string) => {
    setSettings((prev) => ({
      ...prev,
      theme: {
        preset,
        styles: getPresetThemeStyles(preset),
      },
    }))
  }

  const resetToDefault = () => {
    setSettings({
      ...initialSettings,
      savedThemes: settings.savedThemes ?? [],
    })
  }

  const hasStateChanged = () => {
    return JSON.stringify(settings.theme.styles) !== JSON.stringify(initialSettings.theme.styles)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        applyThemePreset,
        resetToDefault,
        hasStateChanged,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
