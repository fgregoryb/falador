// Maps a timezone string to a human-readable city/region label
const TIMEZONE_LABELS: Record<string, string> = {
  // Brasil
  'America/Sao_Paulo':   'São Paulo, Brasil',
  'America/Manaus':      'Manaus, Brasil',
  'America/Belem':       'Belém, Brasil',
  'America/Fortaleza':   'Fortaleza, Brasil',
  'America/Recife':      'Recife, Brasil',
  'America/Porto_Velho': 'Porto Velho, Brasil',
  'America/Boa_Vista':   'Boa Vista, Brasil',
  'America/Rio_Branco':  'Rio Branco, Brasil',
  'America/Noronha':     'Fernando de Noronha, Brasil',
  // América do Sul
  'America/Buenos_Aires':'Buenos Aires, Argentina',
  'America/Santiago':    'Santiago, Chile',
  'America/Bogota':      'Bogotá, Colômbia',
  'America/Lima':        'Lima, Peru',
  'America/Caracas':     'Caracas, Venezuela',
  // América do Norte
  'America/New_York':    'New York, EUA',
  'America/Chicago':     'Chicago, EUA',
  'America/Denver':      'Denver, EUA',
  'America/Los_Angeles': 'Los Angeles, EUA',
  'America/Toronto':     'Toronto, Canadá',
  'America/Vancouver':   'Vancouver, Canadá',
  'America/Mexico_City': 'Cidade do México, México',
  'America/Anchorage':   'Anchorage, EUA',
  'Pacific/Honolulu':    'Honolulu, EUA',
  // Europa
  'Europe/Lisbon':       'Lisboa, Portugal',
  'Europe/London':       'Londres, Reino Unido',
  'Europe/Paris':        'Paris, França',
  'Europe/Berlin':       'Berlim, Alemanha',
  'Europe/Madrid':       'Madri, Espanha',
  'Europe/Rome':         'Roma, Itália',
  'Europe/Amsterdam':    'Amsterdã, Holanda',
  'Europe/Moscow':       'Moscou, Rússia',
  'Europe/Istanbul':     'Istambul, Turquia',
  // Ásia / Pacífico
  'Asia/Dubai':          'Dubai, EAU',
  'Asia/Kolkata':        'Mumbai, Índia',
  'Asia/Dhaka':          'Dhaka, Bangladesh',
  'Asia/Bangkok':        'Bancoc, Tailândia',
  'Asia/Shanghai':       'Xangai, China',
  'Asia/Singapore':      'Cingapura',
  'Asia/Tokyo':          'Tóquio, Japão',
  'Australia/Sydney':    'Sydney, Austrália',
  'Pacific/Auckland':    'Auckland, Nova Zelândia',
  // Universal
  'UTC':                 'UTC',
}

export function timezoneToLocation(tz: string | null | undefined): string {
  if (!tz) return ''
  if (TIMEZONE_LABELS[tz]) return TIMEZONE_LABELS[tz]
  // Fallback: extract city from "Region/City" → "City"
  const city = tz.split('/').pop()?.replace(/_/g, ' ') ?? tz
  return city
}
