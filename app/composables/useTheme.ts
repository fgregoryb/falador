export function useTheme() {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')

  function applyTheme(t: 'light' | 'dark') {
    theme.value = t
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem('theme', t)
    }
  }

  function initTheme() {
    if (!import.meta.client) return
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    applyTheme(saved ?? preferred)
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme, initTheme }
}
