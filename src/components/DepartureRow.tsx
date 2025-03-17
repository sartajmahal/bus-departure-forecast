
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BusDeparture, getStatusColor, getTimeRemaining } from '@/services/busService';

interface DepartureRowProps {
  departure: BusDeparture;
  index: number;
}

const DepartureRow = ({ departure, index }: DepartureRowProps) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(departure.estimatedArrival));
  const [animateUpdate, setAnimateUpdate] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(departure.estimatedArrival));
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(timer);
  }, [departure.estimatedArrival]);
  
  useEffect(() => {
    setAnimateUpdate(true);
    const timer = setTimeout(() => setAnimateUpdate(false), 500);
    return () => clearTimeout(timer);
  }, [departure]);
  
  const statusColorClass = getStatusColor(departure.status);
  
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  // Handle special styling for different route types (RapidRide, Link, Sounder)
  const getRouteStyle = (routeNumber: string) => {
    if (routeNumber === 'Link') {
      return "bg-red-600 text-white px-2 py-0.5 rounded";
    } else if (routeNumber === 'Sounder') {
      return "bg-green-700 text-white px-2 py-0.5 rounded";
    } else if (['A', 'B', 'C', 'D', 'E', 'F'].includes(routeNumber)) {
      return "bg-board-accent text-black font-bold px-2 py-0.5 rounded";
    }
    return "";
  };

  return (
    <motion.div 
      className="board-row"
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <div className="text-board-accent font-mono text-lg font-medium">
        <span className={getRouteStyle(departure.routeNumber)}>
          {departure.routeNumber}
        </span>
      </div>
      
      <div className="text-left font-medium truncate">
        {departure.destination}
      </div>
      
      <div className="text-left truncate text-gray-300">
        {departure.currentStop}
      </div>
      
      <div className={`font-mono ${animateUpdate ? 'animate-flip' : ''}`}>
        {departure.estimatedArrival}
        <span className="ml-2 text-sm text-gray-400">({timeLeft})</span>
      </div>
      
      <div className={`uppercase tracking-wider text-right font-medium ${statusColorClass}`}>
        {departure.status}
      </div>
    </motion.div>
  );
};

export default DepartureRow;
