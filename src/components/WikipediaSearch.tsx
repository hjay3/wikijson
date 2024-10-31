import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import axios from 'axios';

interface WikipediaSearchProps {
  onArticleSelect: (title: string) => void;
}

const WikipediaSearch: React.FC<WikipediaSearchProps> = ({ onArticleSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      if (search.length >= 3) {
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${search}&limit=5&format=json&origin=*`;
        try {
          const response = await axios.get(apiUrl);
          setOptions(response.data[1]);
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      } else {
        setOptions([]);
      }
    };

    const timeoutId = setTimeout(fetchOptions, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleSelect = (title: string) => {
    onArticleSelect(title);
    setOpen(false);
  };

  return (
    <div className="mb-4">
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => setOpen(true)}
      >
        Search Wikipedia (Ctrl+K)
      </button>
      
      <Command.Dialog open={open} onOpenChange={setOpen} label="Search Wikipedia">
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search Wikipedia..."
        />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          {options.map((option) => (
            <Command.Item key={option} onSelect={() => handleSelect(option)}>
              {option}
            </Command.Item>
          ))}
        </Command.List>
      </Command.Dialog>
    </div>
  );
};

export default WikipediaSearch;