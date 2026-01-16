// utils/getMode.ts

// Third-party Imports
import Cookies from 'js-cookie'
import { Mode, ModeSettings } from '../settingsContext'

// Type Imports

// Get the current mode from cookie
export const getMode = (): Mode => {
  try {
    const cookieValue = Cookies.get('divakar-theme-settings')

    if (!cookieValue) return 'light'

    try {
      const parsedSettings = JSON.parse(cookieValue) as ModeSettings
      return parsedSettings.mode || 'light'
    } catch {
      return 'light'
    }
  } catch {
    return 'light'
  }
}

// Get the full settings object from cookie
export const getSettingsFromCookie = (): ModeSettings => {
  try {
    const cookieValue = Cookies.get('divakar-theme-settings')

    if (!cookieValue) {
      return { mode: 'light' }
    }

    try {
      return JSON.parse(cookieValue) as ModeSettings
    } catch {
      return { mode: 'light' }
    }
  } catch {
    return { mode: 'light' }
  }
}
