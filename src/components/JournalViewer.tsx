import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Music, Heart, Tag, ChevronRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Props {
  entries: JournalEntry[];
}

export function JournalViewer({ entries }: Props) {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [sortedEntries, setSortedEntries] = useState<JournalEntry[]>([]);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    // Sort from oldest to newest
    const sorted = [...entries].sort((a, b) => a.date_journal - b.date_journal);
    setSortedEntries(sorted);
    if (sorted.length > 0 && !selectedEntry) {
      setSelectedEntry(sorted[0]);
    }
  }, [entries]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '');
    const words = plainText.split(' ');
    return words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
  };

  const handleEntrySelect = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsContentVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex" dir="rtl">
      {/* Sidebar */}
      <div className={`w-full lg:w-80 bg-white border-l border-gray-200 ${isContentVisible ? 'hidden lg:block' : 'block'}`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">יומן מסע</h1>
        </div>
        <div className="divide-y divide-gray-200">
          {sortedEntries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => handleEntrySelect(entry)}
              className={`w-full p-4 text-right hover:bg-gray-50 transition-colors ${
                selectedEntry?.id === entry.id ? 'bg-blue-50' : ''
              }`}
            >
              <p className="text-sm text-gray-500">
                {formatDate(entry.date_journal)}
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {truncateText(entry.preview_text)}
              </p>
              {entry.address && (
                <div className="mt-2 flex items-center text-gray-500 text-sm">
                  <MapPin className="w-3 h-3 ml-1 shrink-0" />
                  <span className="truncate">{entry.address}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={`fixed inset-0 lg:static bg-gray-50 transform transition-transform duration-300 ${
          isContentVisible ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {selectedEntry ? (
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center">
              <button
                onClick={() => setIsContentVisible(false)}
                className="lg:hidden ml-2 p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {formatDate(selectedEntry.date_journal)}
                </h2>
              </div>
              <button
                onClick={() => {}}
                className={`p-2 rounded-full ${
                  selectedEntry.favourite
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${selectedEntry.favourite ? 'fill-current' : ''}`}
                />
              </button>
            </div>

            <div className="p-4 lg:p-8 max-w-3xl mx-auto">
              {selectedEntry.address && (
                <div className="flex items-center space-x-2 space-x-reverse text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{selectedEntry.address}</span>
                </div>
              )}

              {(selectedEntry.music_title || selectedEntry.music_artist) && (
                <div className="flex items-center space-x-2 space-x-reverse text-gray-600 mb-4">
                  <Music className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedEntry.music_title} - {selectedEntry.music_artist}
                  </span>
                </div>
              )}

              <div
                className="prose prose-blue max-w-none mt-6"
                dangerouslySetInnerHTML={{ __html: selectedEntry.text }}
              />

              {selectedEntry.tags.length > 0 && (
                <div className="mt-6 flex items-center space-x-2 space-x-reverse flex-wrap gap-y-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {selectedEntry.lat && selectedEntry.lon && (
                <div className="mt-8 h-64 rounded-lg overflow-hidden shadow-md">
                  <MapContainer
                    center={[selectedEntry.lat, selectedEntry.lon]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[selectedEntry.lat, selectedEntry.lon]}>
                      <Popup>{selectedEntry.address}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            בחר רשומה כדי לצפות בה
          </div>
        )}
      </div>
    </div>
  );
}