
import { useState, ChangeEvent, FormEvent } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (term: string) => void;
  className?: string;
  placeholder?: string;
}

const SearchBar = ({ onSearch, className, placeholder = 'Search by route number...' }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') {
      onSearch('');
    }
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "relative flex items-center w-full max-w-md mx-auto transition-all", 
        className
      )}
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="search"
          className="block w-full p-3 pl-10 pr-10 text-sm text-foreground bg-background border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="inline-flex items-center py-2.5 px-4 ml-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
