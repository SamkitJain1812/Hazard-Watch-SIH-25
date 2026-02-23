import { useState } from 'react';
import { UserCategory, USER_CATEGORY_LABELS } from '@/shared/types';
import { Users, UserCheck, Building, MapPin, Heart, BookOpen, ChevronDown } from 'lucide-react';

interface UserCategorySelectorProps {
  selectedCategory: UserCategory;
  onCategoryChange: (category: UserCategory) => void;
  compact?: boolean;
}

const getCategoryIcon = (category: UserCategory) => {
  switch (category) {
    case 'volunteer':
      return Heart;
    case 'tourist':
      return MapPin;
    case 'government':
      return Building;
    case 'local':
      return Users;
    case 'ngo':
      return UserCheck;
    case 'researcher':
      return BookOpen;
    default:
      return Users;
  }
};

const getCategoryColors = (category: UserCategory) => {
  switch (category) {
    case 'volunteer':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'tourist':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'government':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'local':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'ngo':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'researcher':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export default function UserCategorySelector({ selectedCategory, onCategoryChange, compact = false }: UserCategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const SelectedIcon = getCategoryIcon(selectedCategory);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 ${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2'} rounded-lg border-2 transition-all duration-200 ${getCategoryColors(selectedCategory)} hover:shadow-lg`}
      >
        <SelectedIcon className={compact ? "w-3 h-3" : "w-4 h-4"} />
        {!compact && <span className="font-medium">{USER_CATEGORY_LABELS[selectedCategory]}</span>}
        {compact && <span className="font-medium text-xs">{USER_CATEGORY_LABELS[selectedCategory].split(' ')[0]}</span>}
        <ChevronDown className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-blue-500/20 z-50 overflow-hidden">
          <div className="p-2 border-b border-blue-500/20 bg-gradient-to-r from-blue-600 to-blue-700">
            <h3 className="text-white font-semibold text-sm">Select Your Role</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(USER_CATEGORY_LABELS).map(([key, label]) => {
              const category = key as UserCategory;
              const Icon = getCategoryIcon(category);
              const isSelected = category === selectedCategory;
              
              return (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-600/10 transition-colors ${
                    isSelected ? 'bg-blue-600/20 border-r-4 border-blue-500' : ''
                  }`}
                >
                  <div className={`p-2 rounded-lg ${getCategoryColors(category).replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium text-sm">{label}</div>
                    <div className="text-gray-400 text-xs">
                      {category === 'volunteer' && 'Helping communities in crisis'}
                      {category === 'tourist' && 'Visiting the area temporarily'}
                      {category === 'government' && 'Official government personnel'}
                      {category === 'local' && 'Permanent resident of the area'}
                      {category === 'ngo' && 'NGO or humanitarian organization'}
                      {category === 'researcher' && 'Academic or scientific research'}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
