import { useEffect, useState } from 'react';
import type { Route } from './+types/admin';
import { Brain, Cable, Database, Gem, RefreshCcw, ShoppingBasket, TrendingUp, Users, UsersIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useFetch } from '~/lib/api-client';
import { Feedback } from '~/components/admin/feedback';
import UserManagement from '~/components/admin/user-management';
import { Button } from '~/components/ui/button';
export function meta({}: Route.MetaArgs) {
  return [{ title: 'Admin page' }, { name: 'Admin', content: 'Welcome to Munchora!' }];
}

type TMetricsTitle =
  | 'TotalUsers'
  | 'GroceryLists'
  | 'SharedListRelations'
  | 'RecipesGenerated'
  | 'AIPrompts'
  | 'TotalTokens'
  | 'TotalFeedback'
  | 'DatabaseSize';

interface IMetrics {
  title: TMetricsTitle;
  value: string;
}

export default function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchData } = useFetch<{ stats: IMetrics[] }>();
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '0', icon: Users },
    { title: 'Grocery Lists', value: '0', icon: ShoppingBasket },
    { title: 'Shared List Relations', value: '0', icon: UsersIcon },
    { title: 'Recipes Generated', value: '0', icon: TrendingUp },
    { title: 'AI Prompts', value: '0', icon: Brain },
    { title: 'Total Tokens', value: '0', icon: Gem },
    { title: 'Total Feedback', value: '0', icon: Gem },
    { title: 'Database Size', value: '0', icon: Database },
    { title: 'Action Cable Subscriptions', value: '0', icon: Cable },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const metricsRes = await fetchData('/metrics');
      setStats((cur) => {
        return cur.map((stat) => ({ ...stat, value: metricsRes.stats.find((metric) => metric.title === stat.title)?.value || '0' }));
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Monitor and manage Munchora</p>
        <Button onClick={fetchStats} disabled={isLoading} className="mt-4">
          <RefreshCcw className="h-4 w-4" />
          <span>Refresh Stats</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-final" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              {/* <p className="text-xs text-emerald-600 mt-1">{stat.change} from last month</p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <UserManagement />

      <Feedback />
    </div>
  );
}
