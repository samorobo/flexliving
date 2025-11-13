'use client';

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Download, RefreshCw } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ReviewsTable } from '@/components/dashboard/ReviewsTable';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { Button } from '@/components/ui/Button';
import { NormalizedReview, FilterState } from '@/types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    property: 'all',
    rating: [0, 10],
    channel: [],
    dateRange: 'all',
    status: 'all',
    searchQuery: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reviews, filters]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reviews/hostaway');
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data);
        toast.success('Reviews loaded successfully');
      } else {
        toast.error('Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Error loading reviews');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reviews];

    if (filters.property !== 'all') {
      filtered = filtered.filter(r => r.propertyName === filters.property);
    }

    if (filters.status !== 'all') {
      if (filters.status === 'approved') {
        filtered = filtered.filter(r => r.isApproved);
      } else if (filters.status === 'pending') {
        filtered = filtered.filter(r => !r.isApproved);
      } else if (filters.status === 'visible') {
        filtered = filtered.filter(r => r.isVisible);
      }
    }

    
    if (filters.channel.length > 0) {
      filtered = filtered.filter(r => filters.channel.includes(r.channel));
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(r => {
        const reviewDate = new Date(r.date);
        switch (filters.dateRange) {
          case 'today':
            return reviewDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return reviewDate >= weekAgo;
          case 'month':
            return reviewDate.getMonth() === now.getMonth() && 
                   reviewDate.getFullYear() === now.getFullYear();
          case 'quarter':
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            return reviewDate >= quarterAgo;
          default:
            return true;
        }
      });
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.guestName.toLowerCase().includes(query) ||
        r.propertyName.toLowerCase().includes(query) ||
        r.comment.toLowerCase().includes(query)
      );
    }

    setFilteredReviews(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Guest', 'Property', 'Rating', 'Channel', 'Date', 'Status', 'Comment'].join(','),
      ...filteredReviews.map(r => [
        r.id,
        r.guestName,
        r.propertyName,
        r.rating,
        r.channel,
        new Date(r.date).toLocaleDateString(),
        r.isApproved ? 'Approved' : 'Pending',
        `"${r.comment.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Reviews exported successfully');
  };

  const properties = [...new Set(reviews.map(r => r.propertyName))];
  const channels = [...new Set(reviews.map(r => r.channel))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 flex items-center">
                <LayoutDashboard className="w-10 h-10 mr-4 text-indigo-600" />
                Reviews Dashboard
              </h1>
              <p className="text-slate-600 mt-2">
                Manage and analyze guest reviews across all properties
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={fetchReviews}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="primary" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

     
        <StatsCards reviews={filteredReviews} />

        
        <div className="mt-8">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            properties={properties}
            channels={channels}
          />
        </div>

        <div className="mt-8">
          <ReviewsTable reviews={filteredReviews} onUpdate={fetchReviews} />
        </div>

        <AnalyticsCharts reviews={filteredReviews} />
      </div>
    </div>
  );
}