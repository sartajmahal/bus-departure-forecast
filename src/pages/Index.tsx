
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import DepartureBoard from '@/components/DepartureBoard';
import { Bus, Clock } from 'lucide-react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <motion.div 
            className="flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-2">
              <Bus className="h-8 w-8 text-board-accent mr-2" />
              <h1 className="text-4xl font-bold tracking-tight">Washington Bus Tracker</h1>
            </div>
            <div className="flex items-center mt-2 mb-6 text-gray-400">
              <Clock className="h-5 w-5 mr-2" />
              <div className="font-mono text-xl">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit',
                  hour12: true 
                })}
              </div>
            </div>
            
            <p className="text-lg text-gray-300 max-w-2xl">
              Real-time Washington bus departure information for Seattle, Bellevue, and surrounding areas.
            </p>
          </motion.div>
        </header>
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <SearchBar onSearch={handleSearch} placeholder="Search by route number (e.g., 271 for Bellevue)..." />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <DepartureBoard searchTerm={searchTerm} />
        </motion.div>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Note: This is a demonstration using simulated data for Washington state bus routes. 
            In a production environment, this would connect to the real OneBusAway API.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
