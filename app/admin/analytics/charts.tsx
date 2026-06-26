'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// User Growth Chart Data
export const userGrowthData = [
  { date: 'Jun 1', users: 14200, activeUsers: 8100 },
  { date: 'Jun 2', users: 14450, activeUsers: 8250 },
  { date: 'Jun 3', users: 14680, activeUsers: 8380 },
  { date: 'Jun 4', users: 14920, activeUsers: 8520 },
  { date: 'Jun 5', users: 15120, activeUsers: 8650 },
  { date: 'Jun 6', users: 15280, activeUsers: 8750 },
  { date: 'Jun 7', users: 15420, activeUsers: 8340 },
];

// Revenue Chart Data
export const revenueData = [
  { date: 'Jun 1', revenue: 8450, subscriptions: 6200, courses: 1450, jobs: 800 },
  { date: 'Jun 2', revenue: 9120, subscriptions: 6800, courses: 1520, jobs: 800 },
  { date: 'Jun 3', revenue: 8950, subscriptions: 6600, courses: 1480, jobs: 870 },
  { date: 'Jun 4', revenue: 10240, subscriptions: 7500, courses: 1640, jobs: 1100 },
  { date: 'Jun 5', revenue: 11680, subscriptions: 8400, courses: 1980, jobs: 1300 },
  { date: 'Jun 6', revenue: 12340, subscriptions: 8900, courses: 2140, jobs: 1300 },
  { date: 'Jun 7', revenue: 13580, subscriptions: 9800, courses: 2280, jobs: 1500 },
];

// Subscription Plan Distribution
export const subscriptionData = [
  { name: 'Community', value: 4250, color: '#f59e0b' },
  { name: 'Professional', value: 3180, color: '#3b82f6' },
  { name: 'Dual Mode', value: 2890, color: '#8b5cf6' },
];

// Conversion Funnel Data
export const conversionFunnelData = [
  { stage: 'Visitors', count: 125000 },
  { stage: 'Signups', count: 28100 },
  { stage: 'Profile Complete', count: 18920 },
  { stage: 'Paid Subscription', count: 10320 },
];

// Engagement Metrics
export const engagementData = [
  { metric: 'Messages', value: 45230 },
  { metric: 'Connections', value: 12450 },
  { metric: 'Job Applications', value: 3280 },
  { metric: 'Course Enrollments', value: 2150 },
];

// User Acquisition by Channel
export const acquisitionData = [
  { channel: 'Organic', users: 5240, percentage: 34 },
  { channel: 'Paid Ads', users: 3890, percentage: 25 },
  { channel: 'Referral', users: 3120, percentage: 20 },
  { channel: 'Social', users: 2170, percentage: 14 },
  { channel: 'Direct', users: 1000, percentage: 7 },
];

// Churn Analysis
export const churnData = [
  { cohort: 'Week 1', retention: 85 },
  { cohort: 'Week 2', retention: 72 },
  { cohort: 'Week 3', retention: 58 },
  { cohort: 'Week 4', retention: 48 },
  { cohort: 'Month 2', retention: 42 },
  { cohort: 'Month 3', retention: 38 },
];

export function UserGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={userGrowthData}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
        <Legend />
        <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" name="Total Users" />
        <Area type="monotone" dataKey="activeUsers" stroke="#10b981" fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
        <Legend />
        <Bar dataKey="subscriptions" stackId="a" fill="#3b82f6" name="Subscriptions" />
        <Bar dataKey="courses" stackId="a" fill="#8b5cf6" name="Courses" />
        <Bar dataKey="jobs" stackId="a" fill="#f59e0b" name="Jobs" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SubscriptionDistribution() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={subscriptionData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value, percentage }) => `${name}: ${value} (${((value / 10320) * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {subscriptionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} users`} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ConversionFunnel() {
  const maxCount = Math.max(...conversionFunnelData.map((d) => d.count));

  return (
    <div className="space-y-4">
      {conversionFunnelData.map((item, index) => {
        const percentage = ((item.count / conversionFunnelData[0].count) * 100).toFixed(1);
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

        return (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">{item.stage}</span>
              <span className="text-sm font-semibold text-slate-900">{item.count.toLocaleString()} ({percentage}%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: colors[index],
                }}
              >
                <span className="text-xs font-bold text-white">{percentage}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EngagementMetrics() {
  const maxValue = Math.max(...engagementData.map((d) => d.value));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={engagementData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" stroke="#6b7280" />
        <YAxis dataKey="metric" type="category" stroke="#6b7280" width={120} />
        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
        <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function UserAcquisitionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={acquisitionData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="channel" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
        <Legend />
        <Bar dataKey="users" fill="#3b82f6" name="Users" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RetentionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={churnData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="cohort" stroke="#6b7280" />
        <YAxis stroke="#6b7280" domain={[0, 100]} />
        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
        <Legend />
        <Line
          type="monotone"
          dataKey="retention"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ fill: '#10b981', r: 5 }}
          activeDot={{ r: 7 }}
          name="Retention %"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
