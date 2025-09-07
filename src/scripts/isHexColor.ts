export const isHexColor = (color: string): boolean => {
  const regex = /^#[0-9A-Fa-f]{6}$/
  return regex.test(color)
}
