import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Users, Clock, Folder, Share2, Settings, Archive } from 'lucide-react';
import { ProjectSettingsModal } from './ProjectSettingsModal';
import { SessionShareButton } from './SessionShareButton';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  id: string;
  project_name: string;
  project_description: string | null;
  project_color: string;
  project_icon: string;
  current_phase: string;
  updated_at: string;
  is_owner: boolean;
  access_level?: string;
  collaborators_count: number;
  onClick: () => void;
  onUpdate: () => void;
}

export function ProjectCard({
  id,
  project_name,
  project_description,
  project_color,
  project_icon,
  current_phase,
  updated_at,
  is_owner,
  access_level,
  collaborators_count,
  onClick,
  onUpdate,
}: ProjectCardProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const phaseColors: Record<string, string> = {
    SPARK: 'bg-yellow-500',
    BUILD: 'bg-blue-500',
    TEST: 'bg-purple-500',
    LAUNCH: 'bg-green-500',
    ITERATE: 'bg-orange-500',
  };

  return (
    <>
      <Card 
        className="group hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
        style={{ borderTopColor: project_color, borderTopWidth: '3px' }}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {is_owner && (
                <>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(true);
                  }}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {(is_owner || access_level === 'editor') && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setShowShare(true);
                }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardHeader className="pb-3" onClick={onClick}>
          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: project_color }}
            >
              <Folder className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{project_name}</h3>
              {project_description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {project_description}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent onClick={onClick}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Badge className={phaseColors[current_phase] || 'bg-gray-500'}>
                {current_phase}
              </Badge>
              {!is_owner && access_level && (
                <Badge variant="outline" className="capitalize">
                  {access_level}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              {collaborators_count > 1 && (
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{collaborators_count}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs">
                  {formatDistanceToNow(new Date(updated_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {is_owner && (
        <ProjectSettingsModal
          open={showSettings}
          onOpenChange={setShowSettings}
          sessionId={id}
          projectName={project_name}
          projectDescription={project_description}
          projectColor={project_color}
          projectIcon={project_icon}
          onUpdate={onUpdate}
        />
      )}

      {showShare && (
        <div onClick={(e) => e.stopPropagation()}>
          <SessionShareButton sessionId={id} />
        </div>
      )}
    </>
  );
}
