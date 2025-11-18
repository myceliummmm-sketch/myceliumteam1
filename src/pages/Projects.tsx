import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectCard } from '@/components/shipit/ProjectCard';
import { NewProjectDialog } from '@/components/shipit/NewProjectDialog';
import { Search, Grid, List, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: string;
  project_name: string;
  project_description: string | null;
  project_color: string;
  project_icon: string;
  current_phase: string;
  updated_at: string;
  player_id: string;
  is_owner: boolean;
  access_level?: string;
  collaborators_count: number;
}

export default function Projects() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get all sessions (owned + shared)
      const { data, error } = await supabase
        .from('session_collaborators')
        .select(`
          session_id,
          access_level,
          game_sessions!inner(
            id,
            player_id,
            project_name,
            project_description,
            project_color,
            project_icon,
            current_phase,
            updated_at,
            is_active
          )
        `)
        .eq('player_id', user.id)
        .not('accepted_at', 'is', null)
        .eq('game_sessions.is_active', true)
        .order('game_sessions.updated_at', { ascending: false });

      if (error) throw error;

      // Get collaborator counts for each session
      const projectsWithCounts = await Promise.all(
        (data || []).map(async (item: any) => {
          const { count } = await supabase
            .from('session_collaborators')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', item.game_sessions.id)
            .not('accepted_at', 'is', null);

          return {
            id: item.game_sessions.id,
            project_name: item.game_sessions.project_name || 'Untitled Project',
            project_description: item.game_sessions.project_description,
            project_color: item.game_sessions.project_color || '#6366f1',
            project_icon: item.game_sessions.project_icon || 'folder',
            current_phase: item.game_sessions.current_phase || 'SPARK',
            updated_at: item.game_sessions.updated_at,
            player_id: item.game_sessions.player_id,
            is_owner: item.game_sessions.player_id === user.id,
            access_level: item.access_level,
            collaborators_count: count || 0,
          };
        })
      );

      setProjects(projectsWithCounts);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const openProject = (projectId: string) => {
    navigate(`/shipit?session=${projectId}`);
  };

  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.project_description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ownedProjects = filteredProjects.filter((p) => p.is_owner);
  const sharedProjects = filteredProjects.filter((p) => !p.is_owner);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">My Projects</h1>
          </div>
          <Button onClick={() => setShowNewProjectDialog(true)}>
            + New Project
          </Button>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Your Projects */}
        {ownedProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Projects ({ownedProjects.length})</h2>
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'flex flex-col gap-4'
            }>
              {ownedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  onClick={() => openProject(project.id)}
                  onUpdate={loadProjects}
                />
              ))}
            </div>
          </div>
        )}

        {/* Shared with You */}
        {sharedProjects.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Shared with You ({sharedProjects.length})</h2>
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'flex flex-col gap-4'
            }>
              {sharedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  onClick={() => openProject(project.id)}
                  onUpdate={loadProjects}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button onClick={() => setShowNewProjectDialog(true)}>
              Create Your First Project
            </Button>
          </div>
        )}

        {/* No Results */}
        {projects.length > 0 && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects match your search</p>
          </div>
        )}
      </div>

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
        onProjectCreated={(projectId) => {
          loadProjects();
          openProject(projectId);
        }}
      />
    </div>
  );
}
