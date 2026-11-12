export const TRACKS = ['layout', 'logic'] as const;
export type TrackId = (typeof TRACKS)[number];

export const LEVELS = [1, 2, 3, 4, 5, 6, 7] as const;
export type Level = (typeof LEVELS)[number];
