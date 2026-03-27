import { Button } from '../../../components/common/ui/button'

export function DeactivateRuleAction({ onClick }: { onClick: () => void }) {
  return (
    <Button size="sm" variant="danger" onClick={onClick}>
      Deactivate
    </Button>
  )
}
