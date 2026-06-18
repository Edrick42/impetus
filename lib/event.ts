export const FAVELA_RICA = {
  registerUrl: 'https://linktr.ee/favelamaisrica',
  bannerSrc: '/events/favela-rica/banner.png',
  videoSrc: '/events/favela-rica/video.mp4',
  posterSrc: '/events/favela-rica/photo-01.jpg',
  photos: Array.from(
    { length: 12 },
    (_, i) => `/events/favela-rica/photo-${String(i + 1).padStart(2, '0')}.jpg`,
  ),
  startDate: '2026-06-26',
  endDate: '2026-06-27',
} as const;
