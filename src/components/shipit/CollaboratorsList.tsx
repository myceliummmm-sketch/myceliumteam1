import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface Collaborator {
  user_id: string;
  username?: string;
  online_at: string;
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  currentUserId: string;
}

export function CollaboratorsList({ collaborators, currentUserId }: CollaboratorsListProps) {
  if (collaborators.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
      <Users className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {collaborators.length} online
      </span>
      <div className="flex -space-x-2">
        {collaborators.map((collab) => (
          <div
            key={collab.user_id}
            className="w-8 h-8 rounded-full bg-primary border-2 border-background flex items-center justify-center text-xs font-medium text-primary-foreground"
            title={collab.username || 'User'}
          >
            {collab.user_id === currentUserId ? (
              'You'
            ) : (
              collab.username?.charAt(0).toUpperCase() || '?'
            )}
          </div>
        ))}
      </div>
      {collaborators.length > 1 && (
        <Badge variant="secondary" className="ml-2">
          {collaborators.length - 1} {collaborators.length === 2 ? 'other' : 'others'}
        </Badge>
      )}
    </div>
  );
}
