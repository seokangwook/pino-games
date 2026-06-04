export const BGM_URLS: Record<string, string> = {
  main:     'https://cdn1.suno.ai/44ea1e04-f5e3-4ecb-ab49-42d0befc14da.mp3',
  cards:    'https://cdn1.suno.ai/c16f5517-5a7b-49ba-add3-0df6e9fd3336.mp3',
  mahjong:  'https://cdn1.suno.ai/50a571f6-d11b-4e53-b602-88e0ccf7827d.mp3',
  lobby:    'https://cdn1.suno.ai/958d927e-c760-45bc-9f02-faffafc6a0a1.mp3',
  battle:   'https://cdn1.suno.ai/674a1ef0-cf1a-4ddf-9528-51202ad5ce7f.mp3',
  victory:  'https://cdn1.suno.ai/bea869b7-97a7-40f1-938f-c308028b4f7c.mp3',
  gameover: 'https://cdn1.suno.ai/beed4299-6d89-4ca7-8b94-7a7ae91427a2.mp3',
}
export type BgmKey = keyof typeof BGM_URLS
