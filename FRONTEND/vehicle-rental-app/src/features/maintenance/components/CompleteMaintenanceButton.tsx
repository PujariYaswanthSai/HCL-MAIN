import { Button } from '../../../components/common/ui/button'
import { maintenanceService } from '../../../services/api/maintenanceService'

export function CompleteMaintenanceButton({ id, onDone }: { id: string; onDone: () => void }) {
  return (
    <Button size="sm" variant="secondary" onClick={async () => { await maintenanceService.complete(id); onDone() }}>
      Complete
    </Button>
  )
}
