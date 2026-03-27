import { Toaster } from 'sonner'

export function Notifier() {
  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'rounded-2xl',
        },
      }}
    />
  )
}
