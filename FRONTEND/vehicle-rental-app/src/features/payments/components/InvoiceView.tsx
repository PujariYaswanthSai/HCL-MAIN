import { Button } from '../../../components/common/ui/button'
import { Card } from '../../../components/common/ui/card'

export function InvoiceView({ invoice }: { invoice: Record<string, unknown> | null }) {
  const rows = invoice ? Object.entries(invoice) : []

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Invoice</h2>
        <Button variant="secondary" onClick={() => window.print()}>
          Download Invoice
        </Button>
      </div>
      {!rows.length ? (
        <p className="text-sm text-[var(--muted)]">Generating invoice...</p>
      ) : (
        <div className="space-y-2 text-sm">
          {rows.map(([key, value]) => (
            <div key={key} className="flex justify-between border-b pb-1">
              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
              <span className="text-right">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
