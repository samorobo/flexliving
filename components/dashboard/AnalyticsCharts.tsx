'use client';

import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NormalizedReview } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

interface AnalyticsChartsProps {
  reviews: NormalizedReview[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ reviews }) => {
  // Rating distribution
  const ratingDistribution = Array.from({ length: 11 }, (_, i) => {
    const count = reviews.filter(r => Math.floor(r.rating) === i).length;
    return { rating: i, count };
  }).filter(d => d.count > 0);

  // Reviews by property
  const reviewsByProperty = Object.entries(
    reviews.reduce((acc, review) => {
      acc[review.propertyName] = (acc[review.propertyName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name: name.substring(0, 20), count }));

  // Reviews by channel
  const reviewsByChannel = Object.entries(
    reviews.reduce((acc, review) => {
      acc[review.channel] = (acc[review.channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Monthly trend
  const monthlyTrend = Object.entries(
    reviews.reduce((acc, review) => {
      const month = new Date(review.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([month, count]) => ({ month, count })).slice(-6);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-900">Rating Distribution</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

    
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-900">Reviews by Channel</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reviewsByChannel}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {reviewsByChannel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-900">Reviews by Property</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reviewsByProperty} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-900">Reviews Trend (Last 6 Months)</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
};