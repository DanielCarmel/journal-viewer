export interface JournalEntry {
  id: string;
  date_modified: number;
  date_journal: number;
  timezone: string;
  text: string;
  preview_text: string;
  mood: number;
  lat: number;
  lon: number;
  address: string;
  label: string;
  folder: string;
  sentiment: number;
  favourite: boolean;
  music_title: string;
  music_artist: string;
  photos: string[];
  weather: {
    id: number;
    degree_c: number;
    description: string;
    icon: string;
    place: string;
  };
  tags: string[];
  type: string;
}