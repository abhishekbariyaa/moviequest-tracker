
import { useState } from 'react';
import { MovieStatus } from '@/types/movie';
import { cn } from '@/lib/utils';
import { CheckIcon, ClockIcon, PauseIcon, PlayIcon, BookmarkIcon } from 'lucide-react';

interface StatusSelectorProps {
  id?: string; // Added id as an optional property
  currentStatus: MovieStatus;
  onChange: (status: MovieStatus) => void;
  className?: string;
}

const StatusSelector = ({ id, currentStatus, onChange, className }: StatusSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const statusOptions: { value: MovieStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { 
      value: 'to-watch', 
      label: 'To Watch', 
      icon: <BookmarkIcon size={14} />, 
      color: 'bg-blue-100 text-blue-800 border-blue-200' 
    },
    { 
      value: 'watching', 
      label: 'Watching', 
      icon: <PlayIcon size={14} />, 
      color: 'bg-green-100 text-green-800 border-green-200' 
    },
    { 
      value: 'on-hold', 
      label: 'On Hold', 
      icon: <PauseIcon size={14} />, 
      color: 'bg-amber-100 text-amber-800 border-amber-200' 
    },
    { 
      value: 'watched', 
      label: 'Watched', 
      icon: <CheckIcon size={14} />, 
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200' 
    }
  ];
  
  const currentOption = statusOptions.find(option => option.value === currentStatus);
  
  const handleSelect = (status: MovieStatus) => {
    onChange(status);
    setIsOpen(false);
  };
  
  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
          currentOption?.color,
          "hover:opacity-90"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentOption?.icon}
        {currentOption?.label}
      </button>
      
      {isOpen && (
        <div 
          className="absolute z-10 mt-1 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 animate-fade-in" 
          style={{ right: 0 }}
        >
          <div className="py-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 text-xs text-left transition-colors",
                  option.value === currentStatus ? 'bg-gray-100' : 'hover:bg-gray-50'
                )}
                onClick={() => handleSelect(option.value)}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusSelector;
