export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'oficina-mecanica-secret-key-2025',
  expiresIn: '1h' as const,
}
