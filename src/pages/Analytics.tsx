import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Activity, TrendingUp, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface DauData {
  date: string;
  real_users: number;
  test_users: number;
}

interface EventData {
  event_type: string;
  count: number;
  is_test: boolean;
}

interface FunnelData {
  step: string;
  real_users: number;
  test_users: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dauData, setDauData] = useState<DauData[]>([]);
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [showTestUsers, setShowTestUsers] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAnalytics();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch all events from last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: allEvents, error } = await supabase
        .from('user_events')
        .select('player_id, event_type, is_test_event, created_at')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!allEvents) {
        setLoading(false);
        return;
      }

      // Process DAU data (last 14 days)
      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const dauMap = new Map<string, { real_users: Set<string>, test_users: Set<string> }>();
      
      allEvents.forEach(event => {
        const eventDate = new Date(event.created_at);
        if (eventDate >= fourteenDaysAgo) {
          const dateStr = eventDate.toISOString().split('T')[0];
          if (!dauMap.has(dateStr)) {
            dauMap.set(dateStr, { real_users: new Set(), test_users: new Set() });
          }
          const entry = dauMap.get(dateStr)!;
          if (event.is_test_event) {
            entry.test_users.add(event.player_id);
          } else {
            entry.real_users.add(event.player_id);
          }
        }
      });

      const dauDataProcessed = Array.from(dauMap.entries())
        .map(([date, counts]) => ({
          date,
          real_users: counts.real_users.size,
          test_users: counts.test_users.size
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setDauData(dauDataProcessed);

      // Process event breakdown
      const eventCounts = new Map<string, { real: number, test: number }>();
      allEvents.forEach(event => {
        if (!eventCounts.has(event.event_type)) {
          eventCounts.set(event.event_type, { real: 0, test: 0 });
        }
        const count = eventCounts.get(event.event_type)!;
        if (event.is_test_event) {
          count.test++;
        } else {
          count.real++;
        }
      });

      const eventDataProcessed: EventData[] = [];
      eventCounts.forEach((counts, type) => {
        eventDataProcessed.push({ event_type: type, count: counts.real, is_test: false });
        if (counts.test > 0) {
          eventDataProcessed.push({ event_type: type, count: counts.test, is_test: true });
        }
      });

      setEventData(eventDataProcessed);

      // Process funnel data
      const userFunnel = new Map<string, { hasSignup: boolean, hasMessage: boolean, hasLevelUp: boolean, isTest: boolean }>();
      
      allEvents.forEach(event => {
        if (!userFunnel.has(event.player_id)) {
          userFunnel.set(event.player_id, { 
            hasSignup: false, 
            hasMessage: false, 
            hasLevelUp: false,
            isTest: event.is_test_event 
          });
        }
        const user = userFunnel.get(event.player_id)!;
        if (event.event_type === 'signup_completed') user.hasSignup = true;
        if (event.event_type === 'message_sent') user.hasMessage = true;
        if (event.event_type === 'level_up') user.hasLevelUp = true;
      });

      let realSignups = 0, realMessages = 0, realLevelUps = 0;
      let testSignups = 0, testMessages = 0, testLevelUps = 0;

      userFunnel.forEach(user => {
        if (user.isTest) {
          if (user.hasSignup) testSignups++;
          if (user.hasMessage) testMessages++;
          if (user.hasLevelUp) testLevelUps++;
        } else {
          if (user.hasSignup) realSignups++;
          if (user.hasMessage) realMessages++;
          if (user.hasLevelUp) realLevelUps++;
        }
      });

      setFunnelData([
        { step: 'Signup', real_users: realSignups, test_users: testSignups },
        { step: 'First Message', real_users: realMessages, test_users: testMessages },
        { step: 'Level Up', real_users: realLevelUps, test_users: testLevelUps }
      ]);

    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const filteredEventData = showTestUsers 
    ? eventData 
    : eventData.filter(e => !e.is_test);

  const topEvents = filteredEventData
    .reduce((acc, curr) => {
      const existing = acc.find(e => e.event_type === curr.event_type);
      if (existing) {
        existing.count += curr.count;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, [] as EventData[])
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/shipit')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Game
            </Button>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          </div>
          <Button
            variant={showTestUsers ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTestUsers(!showTestUsers)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showTestUsers ? 'Hide Test Users' : 'Show Test Users'}
          </Button>
        </div>
        <p className="text-muted-foreground">Track user engagement and game metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Events (30d)</p>
              <p className="text-3xl font-bold mt-2">
                {eventData.reduce((sum, e) => sum + e.count, 0)}
              </p>
            </div>
            <Activity className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg DAU (14d)</p>
              <p className="text-3xl font-bold mt-2">
                {dauData.length > 0 
                  ? Math.round(dauData.reduce((sum, d) => sum + d.real_users + (showTestUsers ? d.test_users : 0), 0) / dauData.length)
                  : 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-3xl font-bold mt-2">
                {funnelData.length > 0 && funnelData[0].real_users > 0
                  ? `${Math.round((funnelData[2].real_users / funnelData[0].real_users) * 100)}%`
                  : '0%'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="dau" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dau">Daily Active Users</TabsTrigger>
            <TabsTrigger value="events">Event Breakdown</TabsTrigger>
            <TabsTrigger value="funnel">User Funnel</TabsTrigger>
          </TabsList>

          <TabsContent value="dau">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Daily Active Users (Last 14 Days)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dauData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="real_users" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Real Users"
                  />
                  {showTestUsers && (
                    <Line 
                      type="monotone" 
                      dataKey="test_users" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Test Users"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Top Events (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topEvents}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="event_type" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))"
                    name="Event Count"
                  />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Event Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topEvents}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.event_type}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="count"
                    >
                      {topEvents.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="funnel">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">User Conversion Funnel</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="step" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="real_users" 
                    fill="hsl(var(--primary))"
                    name="Real Users"
                  />
                  {showTestUsers && (
                    <Bar 
                      dataKey="test_users" 
                      fill="hsl(var(--muted-foreground))"
                      name="Test Users"
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="font-medium">Signup → First Message</span>
                  <span className="text-lg font-bold">
                    {funnelData[0]?.real_users > 0
                      ? `${Math.round((funnelData[1]?.real_users / funnelData[0]?.real_users) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="font-medium">First Message → Level Up</span>
                  <span className="text-lg font-bold">
                    {funnelData[1]?.real_users > 0
                      ? `${Math.round((funnelData[2]?.real_users / funnelData[1]?.real_users) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="font-medium">Overall Conversion</span>
                  <span className="text-lg font-bold">
                    {funnelData[0]?.real_users > 0
                      ? `${Math.round((funnelData[2]?.real_users / funnelData[0]?.real_users) * 100)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
