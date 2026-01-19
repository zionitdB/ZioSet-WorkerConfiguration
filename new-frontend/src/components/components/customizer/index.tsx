
// React Imports
import { useState, useEffect, useRef } from 'react'

// Third-party Imports
import {  X } from 'lucide-react'
import Shepherd from 'shepherd.js'
import { offset } from '@floating-ui/dom'
import 'shepherd.js/dist/css/shepherd.css'

// Component Imports
import ThemeControlPanel from './ThemeControlPanel'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger } from '@/components/ui/sheet'

// Styles Imports
import './shepherd.css'
import { IconSettings } from '@tabler/icons-react'

export function ThemeCustomizer() {
  // States
 const [open, setOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) document.addEventListener('mousedown', handleClickOutside)
    else document.removeEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    // Initialize the tour
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'shadow-md rounded-lg',
        cancelIcon: {
          enabled: true
        }
      }
    })

    // Add steps to the tour
    tour.addStep({
      id: 'theme-customizer-intro',
      title: ' Theme Generator 🤩',
      text: 'Transform your shadcn components in real time—customize, save, and ship stunning interfaces faster than ever.',
      attachTo: {
        element: '[data-tour="theme-customizer"]',
        on: 'bottom'
      },
      floatingUIOptions: {
        middleware: [offset(10)]
      },
      buttons: [
        {
          text: 'Skip',
          action: tour.complete,
          classes: 'shepherd-button-secondary'
        },
        {
          text: 'Start Customizing',
          action: () => {
            setOpen(true)
            tour.complete()
          }
        }
      ]
    })

    // Start the tour if it hasn't been shown before
    const hasSeenTour = localStorage.getItem('theme-customizer-tour-completed')

    if (!hasSeenTour) {
      tour.start()
      tour.on('complete', () => {
        localStorage.setItem('theme-customizer-tour-completed', 'true')
      })
    }

    return () => {
      tour.complete()
    }
  }, [])

  return (
      <Sheet open={open} onOpenChange={setOpen} modal={false}>
   {/* Trigger Button (FAB) */}
        <SheetTrigger asChild onClick={() => setOpen(true)}>
        <div className='cursor-pointer' aria-label='Theme customizer' data-tour='theme-customizer'>
         <IconSettings className="w-5 h-5" />
        </div>
      </SheetTrigger>
      <SheetContent className='h-full w-full gap-0 sm:max-w-[400px] [&>button]:hidden'>
        <SheetHeader className='min-h-(--header-height) flex-row items-center justify-between border-b border-dashed px-6'>
          <SheetTitle>Theme Customizer</SheetTitle>
          <SheetClose
            className='hover:bg-muted flex size-7 cursor-pointer items-center justify-center rounded transition-colors'
            onClick={() => setOpen(false)}
          >
            <X className='size-4' />
          </SheetClose>
        </SheetHeader>
        <ThemeControlPanel />
      </SheetContent>
    </Sheet>
  )
}
