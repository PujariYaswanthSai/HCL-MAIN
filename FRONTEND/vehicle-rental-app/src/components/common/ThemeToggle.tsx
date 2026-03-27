import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from '../../app/providers/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button variant="secondary" size="sm" onClick={toggleTheme}>
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      {theme === 'dark' ? 'Light' : 'Dark'}
    </Button>
  )
}
