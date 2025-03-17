
import { toast } from "sonner";

// Define our types
export interface BusRoute {
  id: string;
  shortName: string;
  longName: string;
  description?: string;
  type?: string;
}

export interface BusStop {
  id: string;
  name: string;
  code: string;
  direction?: string;
  latitude: number;
  longitude: number;
}

export interface BusArrival {
  routeId: string;
  routeShortName: string;
  tripHeadsign: string;
  scheduledArrivalTime: number;
  predictedArrivalTime: number;
  scheduledDepartureTime: number;
  predictedDepartureTime: number;
  status: string;
  vehicleId?: string;
  distanceFromStop?: number;
  numberOfStopsAway?: number;
  currentStop?: string;
  lastUpdated: number;
}

export interface BusDeparture {
  id: string;
  routeNumber: string;
  destination: string;
  currentStop: string; 
  estimatedArrival: string;
  status: 'on-time' | 'delayed' | 'departed' | 'approaching';
  lastUpdated: number;
  raw: BusArrival;
}

// Since we don't have a real OneBusAway API key, we'll create mock data
const generateMockData = (): BusDeparture[] => {
  const routes = ['1', '2', '3', '7', '8', '10', '12', '13', '15', '18', '22', '25', '28', '40', '44', '70', '101', '120'];
  const destinations = [
    'Downtown Transit Center',
    'University District',
    'Capitol Hill',
    'Northgate Mall',
    'Ballard',
    'West Seattle Junction',
    'Rainier Beach',
    'South Lake Union',
    'Bellevue Transit Center',
    'Redmond Transit Center'
  ];
  
  const currentStops = [
    'Pike Street & 3rd Ave',
    'Broadway & John St',
    'University Way & 45th St',
    'Leary Way NW & 15th Ave NW',
    'California Ave SW & Alaska St',
    'Madison St & 3rd Ave',
    'Rainier Ave S & S Jackson St',
    'Westlake Ave & Denny Way',
    'NE 8th St & 108th Ave NE',
    'Overlake Transit Center'
  ];
  
  const statuses: ('on-time' | 'delayed' | 'departed' | 'approaching')[] = ['on-time', 'delayed', 'on-time', 'approaching'];
  
  const now = new Date();
  
  return Array.from({ length: 20 }, (_, i) => {
    const routeIndex = Math.floor(Math.random() * routes.length);
    const destIndex = Math.floor(Math.random() * destinations.length);
    const stopIndex = Math.floor(Math.random() * currentStops.length);
    const statusIndex = Math.floor(Math.random() * statuses.length);
    
    // Calculate a random arrival time between now and 40 minutes from now
    const minutesAway = Math.floor(Math.random() * 40) + 1;
    const arrivalTime = new Date(now.getTime() + minutesAway * 60000);
    
    // Format the arrival time as HH:MM
    const hours = arrivalTime.getHours();
    const minutes = arrivalTime.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    const mockArrival: BusArrival = {
      routeId: `route_${routes[routeIndex]}`,
      routeShortName: routes[routeIndex],
      tripHeadsign: destinations[destIndex],
      scheduledArrivalTime: arrivalTime.getTime(),
      predictedArrivalTime: arrivalTime.getTime() + (statuses[statusIndex] === 'delayed' ? 5 * 60000 : 0),
      scheduledDepartureTime: arrivalTime.getTime() + 60000,
      predictedDepartureTime: arrivalTime.getTime() + 60000 + (statuses[statusIndex] === 'delayed' ? 5 * 60000 : 0),
      status: statuses[statusIndex],
      currentStop: currentStops[stopIndex],
      lastUpdated: now.getTime(),
    };
    
    return {
      id: `departure_${i}`,
      routeNumber: routes[routeIndex],
      destination: destinations[destIndex],
      currentStop: currentStops[stopIndex],
      estimatedArrival: formattedTime,
      status: statuses[statusIndex],
      lastUpdated: now.getTime(),
      raw: mockArrival
    };
  });
};

// In a real application, we would fetch this data from the actual API
export const getBusDepartures = async (searchTerm: string = ''): Promise<BusDeparture[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock data
    const departures = generateMockData();
    
    // If search term is provided, filter the results
    if (searchTerm) {
      return departures.filter(dep => 
        dep.routeNumber.includes(searchTerm) || 
        dep.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return departures;
  } catch (error) {
    console.error('Error fetching bus departures:', error);
    toast.error('Failed to fetch bus departure information');
    return [];
  }
};

// Function to get time remaining
export const getTimeRemaining = (estimatedTime: string): string => {
  const now = new Date();
  const [hours, minutes] = estimatedTime.split(':').map(Number);
  
  const arrivalTime = new Date();
  arrivalTime.setHours(hours);
  arrivalTime.setMinutes(minutes);
  
  // If the time is for the next day (e.g., it's 23:55 now and the arrival is at 00:10)
  if (arrivalTime < now) {
    arrivalTime.setDate(arrivalTime.getDate() + 1);
  }
  
  const diffMs = arrivalTime.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins <= 0) {
    return 'Now';
  } else if (diffMins === 1) {
    return '1 min';
  } else {
    return `${diffMins} mins`;
  }
};

// Function to get the status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'on-time':
      return 'text-board-green';
    case 'delayed':
      return 'text-board-yellow';
    case 'departed':
      return 'text-gray-400';
    case 'approaching':
      return 'text-board-green animate-pulse-soft';
    default:
      return 'text-gray-200';
  }
};
