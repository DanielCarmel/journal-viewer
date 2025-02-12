import React, { useEffect, useState } from 'react';
import { JournalViewer } from './components/JournalViewer';
import type { JournalEntry } from './types';

function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        // Import all JSON files from the data directory
        const entryModules = import.meta.glob<JournalEntry>('../data-files/*.json', { eager: true });
        
        // Convert the modules object to an array of entries
        const loadedEntries = Object.values(entryModules);
        
        setEntries(loadedEntries);
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    };

    loadEntries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <JournalViewer entries={entries} />
    </div>
  );
}

export default App;