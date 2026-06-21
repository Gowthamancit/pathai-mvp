import crypto from 'crypto'

export function hashPassword(password: string): string {
  // Use Node's built-in crypto for hashing
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function generateSessionToken(): string {
  return crypto.randomUUID()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim().toLowerCase())
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
