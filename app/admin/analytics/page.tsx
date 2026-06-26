"use client";
export const dynamic = "force-dynamic";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  UserGrowthChart,
  RevenueChart,
  SubscriptionDistribution,
  ConversionFunnel,
  EngagementMetrics,
  UserAcquisitionChart,
  RetentionChart,
} from './charts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

interface KPI {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

export default function AdminAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('7d');

  const kpis: KPI[] = [
    {
      label: 'Total Users',
      value: '15,420',
      change: '+3.2%',
      trend: 'up',
      icon: <Users className="w-8 h-8 text-blue-500" />,
    },
    {
      label: 'Active Users',
      value: '8,340',
      change: '+2.8%',
      trend: 'up',
      icon: <Activity className="w-8 h-8 text-green-500" />,
    },
    {
      label: 'Total Revenue',
      value: '$125,680',
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign className="w-8 h-8 text-amber-500" />,
    },
    {
      label: 'Conversion Rate',
      value: '22.5%',
      change: '+1.2%',
      trend: 'up',
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600">Monitor key metrics and platform performance</p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-8 flex gap-2">
          {['7d', '30d', '90d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range === '90d' ? 'Last 90 Days' : 'All Time'}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">{kpi.label}</CardTitle>
                  {kpi.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 mb-2">{kpi.value}</div>
                <p className={`text-sm font-semibold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change} {kpi.trend === 'up' ? '↑' : '↓'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Total and active users over time</CardDescription>
            </CardHeader>
            <CardContent>
              <UserGrowthChart />
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Revenue by Source</CardTitle>
              <CardDescription>Breakdown of revenue streams</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>

          {/* Subscription Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Subscription Distribution</CardTitle>
              <CardDescription>Users by subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionDistribution />
            </CardContent>
          </Card>

          {/* User Acquisition */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>User Acquisition Channels</CardTitle>
              <CardDescription>Where users are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <UserAcquisitionChart />
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>User activity across features</CardDescription>
            </CardHeader>
            <CardContent>
              <EngagementMetrics />
            </CardContent>
          </Card>

          {/* Retention */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>User Retention</CardTitle>
              <CardDescription>Cohort retention rates</CardDescription>
            </CardHeader>
            <CardContent>
              <RetentionChart />
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>User journey from visitor to paid subscriber</CardDescription>
          </CardHeader>
          <CardContent>
            <ConversionFunnel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
