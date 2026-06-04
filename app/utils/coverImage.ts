export function coverImage(seed: string, width = 800, height = 450): string {
  const clean = seed.replace(/[^a-z0-9]/gi, '').slice(0, 20) || 'falador'
  return `https://picsum.photos/seed/${clean}/${width}/${height}`
}
