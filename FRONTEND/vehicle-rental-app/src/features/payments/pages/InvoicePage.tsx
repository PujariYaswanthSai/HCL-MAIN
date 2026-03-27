import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { paymentService } from '../../../services/api/paymentService'
import { InvoiceView } from '../components/InvoiceView'

export function InvoicePage() {
  const { id } = useParams<{ id: string }>()
  const [invoice, setInvoice] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!id) {
        return
      }
      const response = await paymentService.getInvoice(id)
      setInvoice(response.data.invoice)
    }
    void load()
  }, [id])

  return <InvoiceView invoice={invoice} />
}
