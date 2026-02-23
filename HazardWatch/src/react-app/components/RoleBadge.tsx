import { UserRole, USER_ROLE_LABELS } from '@/shared/types';
import { Shield, Users, Crown } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return Crown;
    case 'coordinator':
      return Users;
    case 'reporter':
    default:
      return Shield;
  }
};

const getRoleColors = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'coordinator':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'reporter':
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

export default function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const Icon = getRoleIcon(role);
  const colors = getRoleColors(role);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span className={`inline-flex items-center space-x-1 ${sizeClasses[size]} font-medium rounded-full border ${colors}`}>
      <Icon className={iconSizes[size]} />
      <span>{USER_ROLE_LABELS[role]}</span>
    </span>
  );
}
