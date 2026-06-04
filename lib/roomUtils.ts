export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
export function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return 'server'
  const key = 'pino_uid'
  let uid = localStorage.getItem(key)
  if (!uid) {
    uid = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(key, uid)
  }
  return uid
}
