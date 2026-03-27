import type { InputHTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-2xl border bg-white/80 px-3 text-sm text-[var(--foreground)] outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:bg-slate-950/40 dark:focus:ring-blue-900/40',
        className,
      )}
      {...props}
    />
  )
}
