import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, description, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm" />
        <DialogContent className="surface fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6">
          <DialogTitle className="mb-2 text-lg font-bold">{title}</DialogTitle>
          <p className="mb-6 text-sm text-[var(--muted)]">{description}</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
