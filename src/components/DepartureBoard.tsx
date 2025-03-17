
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BusDeparture, getBusDepartures } from '@/services/busService';
import DepartureRow from './DepartureRow';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

interface DepartureBoardProps {
  searchTerm: string;
}

const DepartureBoard = ({ searchTerm }: DepartureBoardProps) => {
  const [departures, setDepartures] = useState<BusDeparture[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { toast } = useToast();
  
  const fetchDepartures = async () => {
    try {
      const data = await getBusDepartures(searchTerm);
      setDepartures(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching departures:', error);
      toast({
        title: "Error",
        description: "Could not retrieve bus departure information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    setLoading(true);
    fetchDepartures();
    
    // Set up auto-refresh every 60 seconds
    const refreshInterval = setInterval(() => {
      setRefreshing(true);
      fetchDepartures();
    }, 60000);
    
    return () => clearInterval(refreshInterval);
  }, [searchTerm]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-board-accent animate-spin mb-4" />
        <p className="text-gray-500">Loading departure information...</p>
      </div>
    );
  }

  if (departures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">No departures found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="board-container rounded-lg overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-board-dark to-gray-900 text-white">
        <div className="board-header">
          <div>Route</div>
          <div>Destination</div>
          <div>Current Stop</div>
          <div>Est. Arrival</div>
          <div className="text-right">Status</div>
        </div>
        
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          {departures.map((departure, index) => (
            <DepartureRow key={departure.id} departure={departure} index={index} />
          ))}
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-900/80 text-gray-400 text-sm">
          <div>
            {refreshing ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Refreshing...
              </span>
            ) : (
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
          <div>{departures.length} departures</div>
        </div>
      </div>
    </div>
  );
};

export default DepartureBoard;
