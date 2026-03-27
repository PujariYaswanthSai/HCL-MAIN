import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Vehicle } from '../../../types/vehicle'
import { Badge } from '../../../components/common/ui/badge'
import { Button } from '../../../components/common/ui/button'
import { Card } from '../../../components/common/ui/card'

export function VehicleCard({ vehicle, onView }: { vehicle: Vehicle; onView: () => void }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card>
        <div className="mb-3 aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
          <img
            src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800'}
            alt={vehicle.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">{vehicle.name}</h3>
          <Badge className={vehicle.isAvailable ? '' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-100'}>
            {vehicle.isAvailable ? 'Available' : 'Busy'}
          </Badge>
        </div>
        <p className="mb-3 text-sm text-[var(--muted)]">{vehicle.type} in {vehicle.location}</p>
        <div className="mb-4 flex items-center justify-between text-sm">
          <p className="font-bold text-blue-700">${vehicle.pricePerDay}/day</p>
          <p className="flex items-center gap-1 text-amber-500">
            <Star size={14} fill="currentColor" /> {vehicle.rating ?? 4.7}
          </p>
        </div>
        <Button className="w-full" onClick={onView}>Quick View</Button>
      </Card>
    </motion.div>
  )
}
