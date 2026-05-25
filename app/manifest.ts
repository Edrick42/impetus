import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Instituto Impetus',
    short_name: 'Impetus',
    description:
      'Organização comprometida com impacto social, educação e empreendedorismo.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf8',
    theme_color: '#114b5f',
    icons: [
      { src: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
  };
}
