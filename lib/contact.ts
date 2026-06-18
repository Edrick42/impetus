export const CONTACT = {
  email: 'instituto@impetus.com.br',
  phone: {
    display: '(21) 99736-1901',
    tel: '+5521997361901',
  },
  address: {
    street: 'Rua da Assembleia, 85/1004',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    region: 'RJ',
    postalCode: '20011-001',
    country: 'BR',
  },
  social: {
    instagram: 'https://instagram.com/institutoimpetus',
  },
} as const;

export function formatAddressLines(): string[] {
  const { street, neighborhood, city, region, postalCode } = CONTACT.address;
  return [`${street}`, `${neighborhood} · ${city} — ${region}`, `CEP ${postalCode}`];
}
