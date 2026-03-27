import type { NormalizedApiError } from '../../types/api'

export function ApiErrorBanner({ error }: { error: NormalizedApiError }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
      <p className="font-semibold">{error.message}</p>
      <p className="text-xs opacity-80">Code: {error.code}</p>
      {error.request_id ? <p className="text-xs opacity-80">Request ID: {error.request_id}</p> : null}
    </div>
  )
}
