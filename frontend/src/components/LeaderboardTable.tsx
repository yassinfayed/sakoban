import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { LeaderboardEntry } from '@/types/user';
import axios from 'axios';
import { useAuth } from '@/services/authContext';
import { getLevels, getLeaderboard } from '@/services/api';

const ITEMS_PER_PAGE = 5;

interface LeaderboardTableProps {
  updateTrigger?: number; // Prop to trigger updates
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ updateTrigger }) => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<number | null>(null);
  
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [availableLevels, setAvailableLevels] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userScore, setUserScore] = useState<LeaderboardEntry | null>(null);

  // Fetch available levels
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const levels = await getLevels();
        const levelOptions = levels.map((level: any) => ({
          id: level.level,
          name: `Level ${level.level}`
        }));
        console.log('Fetched available levels:', levelOptions); // Log available levels
        setAvailableLevels(levelOptions);
        
        // Set default filter to the first level if no filter is set
        if (filter === null && levelOptions.length > 0) {
          const defaultFilter = levelOptions[0].id;
          console.log('Setting default filter:', defaultFilter); // Log default filter
          setFilter(defaultFilter);
        }
      } catch (err) {
        console.error('Error fetching levels:', err);
      }
    };
    
    fetchLevels();
  }, []); // Depend on [] to fetch levels only once

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const sortedData = await getLeaderboard();
        console.log('Fetched sortedData:', sortedData); // Log fetched data
        
        setLeaderboardData(sortedData);

        console.log('Fetched leaderboard:',leaderboardData);

        // Find current user's score
        const userId = user?.id || localStorage.getItem('anonymousUserId');
        if (userId) {
          const currentUserScore = sortedData.find(
            // Ensure consistent comparison type
            (entry: LeaderboardEntry) => entry.user_id === userId
          );
          setUserScore(currentUserScore || null);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [user, updateTrigger]);

  const filteredEntries = filter 
    ? leaderboardData.filter(entry => entry.level_id === filter)
    : leaderboardData;
  
  console.log('Filtered Entries:', filteredEntries, 'Current Filter:', filter); // Log filtered data and filter

  const sortedEntries = filteredEntries;
  
  console.log('Sorted Entries:', sortedEntries); // Log sorted data

  const totalPages = Math.ceil(sortedEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  console.log('Paginated Entries:', paginatedEntries, 'Current Page:', currentPage, 'Items Per Page:', ITEMS_PER_PAGE); // Log paginated data and pagination info

  if (isLoading) {
    return <div className="text-center">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <div className="flex gap-2">
          <select 
            className="p-2 rounded border"
            value={filter || availableLevels[0]?.id || ""}
            onChange={(e) => setFilter(e.target.value ? Number(e.target.value) : null)}
          >
            {availableLevels.map(level => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {userScore && (
        <div className="border p-4 rounded-md bg-blue-100">
           <h3 className="font-bold">Your Best Score</h3>
           <p>Player: {userScore.is_anonymous ? 'Anonymous' : userScore.username}</p>
           <p>Level: {userScore.level_name || `Level ${userScore.level_id}`}</p>
           <p>Moves: {userScore.moves}</p>
        </div>
      )}

      <Table>
        <TableCaption>Top scores across all players{filter && ` for Level ${filter}`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Moves</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEntries.map((entry, index) => {
            const rank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
            return (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                </TableCell>
                <TableCell>{entry.is_anonymous ? 'Anonymous Player' : entry.username}</TableCell>
                <TableCell className="text-right">{entry.moves}</TableCell>
                <TableCell className="text-right">
                  {new Date(entry.completed_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  onClick={() => setCurrentPage(i + 1)} 
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default LeaderboardTable; 