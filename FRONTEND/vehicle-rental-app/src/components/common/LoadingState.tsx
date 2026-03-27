import { motion } from 'framer-motion'

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.45, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.4, delay: item * 0.1 }}
            className="h-28 rounded-3xl border bg-white/50 dark:bg-slate-900/40"
          />
        ))}
      </div>
      <p className="text-sm text-[var(--muted)]">{label}</p>
    </div>
  )
}
