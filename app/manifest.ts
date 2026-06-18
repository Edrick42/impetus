import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Instituto Impetus',
    short_name: 'Impetus',
    description:
      'Organização comprometida com impacto social, educação e empreendedorismo.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F3FBFF',
    theme_color: '#08B0EF',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
