// data/playlistData.ts
export interface Song {
    title: string;
    artist: string;
    comment: string;
    emoji: string;
    imageUri: string;
    date: string;
  }
  
export interface WeeklyPlaylist {
    week: string;
    songs: Song[];
  }

export const weeklyPlaylists: Record<string, Song[]> = {
    'May - 1st week': [
      {
        title: 'Hype Boy',
        artist: 'New Jeans',
        comment: '오늘은 기분 좋아요!',
        emoji: '😆',
        imageUri: 'https://example.com/hypeboy.jpg',
        date: '2025-05-01',
      },
      {
        title: 'Cupid',
        artist: 'Fifty Fifty',
        comment: '설레는 하루~',
        emoji: '💘',
        imageUri: 'https://example.com/cupid.jpg',
        date: '2025-05-02',
      },
    ],
    'May - 2nd week': [
      {
        title: 'Ditto',
        artist: 'New Jeans',
        comment: '오늘은 맑,,,',
        emoji: '😄',
        imageUri: 'https://example.com/ditto.jpg',
        date: '2025-05-08',
      },
      {
        title: 'Attention',
        artist: 'New Jeans',
        comment: '햇살 좋은 날이에요.',
        emoji: '🌞',
        imageUri: 'https://example.com/attention.jpg',
        date: '2025-05-09',
      },
    ],
    // 원하는 만큼 추가 가능
  };
  