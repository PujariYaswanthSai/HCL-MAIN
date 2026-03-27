interface PaymentMethodSelectorProps {
  method: string
  onChange: (value: string) => void
}

export function PaymentMethodSelector({ method, onChange }: PaymentMethodSelectorProps) {
  return (
    <select
      className="h-11 w-full rounded-2xl border bg-white/80 px-3 text-sm dark:bg-slate-950/40"
      value={method}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="card">Credit / Debit Card</option>
      <option value="upi">UPI</option>
      <option value="wallet">Wallet</option>
    </select>
  )
}
