import React from 'react';
import { Star, MessageSquare, Clock, TrendingUp } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { NormalizedReview } from '@/types';

interface StatsCardsProps {
  reviews: NormalizedReview[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews || 0;
  const pendingApproval = reviews.filter((r) => !r.isApproved).length;
  const approvedThisMonth = reviews.filter((r) => {
    const reviewDate = new Date(r.date);
    const now = new Date();
    return (
      r.isApproved &&
      reviewDate.getMonth() === now.getMonth() &&
      reviewDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const stats = [
    {
      title: 'Total Reviews',
      value: totalReviews,
      icon: MessageSquare,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Average Rating',
      value: averageRating.toFixed(1),
      icon: Star,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Pending Approval',
      value: pendingApproval,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Approved This Month',
      value: approvedThisMonth,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};