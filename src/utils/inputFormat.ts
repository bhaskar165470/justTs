export const formatCountryCodePhone = (input: string): string => {
  const digits = input.replace(/\D/g, '').slice(0, 13)
  if (!digits) return ''
  return `+${digits}`
}

export const formatZip = (input: string): string => input.replace(/\D/g, '').slice(0, 6)
