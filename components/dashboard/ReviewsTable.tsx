'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, MoreVertical, ExternalLink } from 'lucide-react';
import { NormalizedReview } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, getInitials, getRatingColor, getChannelColor } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

interface ReviewsTableProps {
  reviews: NormalizedReview[];
  onUpdate: () => void;
}

export const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews, onUpdate }) => {
  const [selectedReview, setSelectedReview] = useState<NormalizedReview | null>(null);
  const [sortField, setSortField] = useState<keyof NormalizedReview>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof NormalizedReview) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleApprove = async (review: NormalizedReview) => {
    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !review.isApproved }),
      });

      if (response.ok) {
        toast.success(review.isApproved ? 'Review unapproved' : 'Review approved');
        onUpdate();
      }
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  const handleVisibility = async (review: NormalizedReview) => {
    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !review.isVisible }),
      });

      if (response.ok) {
        toast.success(review.isVisible ? 'Review hidden from public' : 'Review now visible');
        onUpdate();
      }
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Guest
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('propertyName')}
                >
                  Property
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('rating')}
                >
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Channel
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('date')}
                >
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedReviews.map((review) => (
                <tr key={review.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(review.guestName)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{review.guestName}</div>
                        <div className="text-sm text-slate-500">ID: {review.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{review.propertyName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getRatingColor(review.rating)}>
                      ⭐ {review.rating.toFixed(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getChannelColor(review.channel)}>
                      {review.channel}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(review.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {review.isApproved ? (
                        <Badge variant="success">Approved</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                      {review.isVisible && <Badge variant="info">Visible</Badge>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(review)}
                        title={review.isApproved ? 'Unapprove' : 'Approve'}
                      >
                        {review.isApproved ? (
                          <X className="w-4 h-4 text-red-600" />
                        ) : (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVisibility(review)}
                        title={review.isVisible ? 'Hide' : 'Show'}
                      >
                        {review.isVisible ? (
                          <EyeOff className="w-4 h-4 text-slate-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-600" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReview(review)}
                      >
                        <ExternalLink className="w-4 h-4 text-slate-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No reviews found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <Modal
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          title="Review Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(selectedReview.guestName)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{selectedReview.guestName}</div>
                  <div className="text-sm text-slate-600">{formatDate(selectedReview.date)}</div>
                </div>
              </div>
              <Badge className={getRatingColor(selectedReview.rating)}>
                ⭐ {selectedReview.rating.toFixed(1)}
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Property</h4>
              <p className="text-slate-700">{selectedReview.propertyName}</p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Review</h4>
              <p className="text-slate-700 leading-relaxed">{selectedReview.comment}</p>
            </div>

            {selectedReview.categories.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Category Ratings</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedReview.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm capitalize text-slate-700">
                        {category.category.replace(/_/g, ' ')}
                      </span>
                      <span className="font-semibold text-slate-900">{category.rating}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4 border-t border-slate-200">
              <Button
                variant={selectedReview.isApproved ? 'danger' : 'primary'}
                onClick={() => {
                  handleApprove(selectedReview);
                  setSelectedReview(null);
                }}
                className="flex-1"
              >
                {selectedReview.isApproved ? 'Unapprove' : 'Approve'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleVisibility(selectedReview);
                  setSelectedReview(null);
                }}
                className="flex-1"
              >
                {selectedReview.isVisible ? 'Hide from Public' : 'Show on Public'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};