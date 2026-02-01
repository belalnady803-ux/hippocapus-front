import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import {API_URL} from '../store/authStore.js';

export default function CourseReviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await axios.get(`${API_URL}/courses/${id}/reviews`);
        setReviews(res.data.data);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id]);

  const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    if (!reviews) return {};
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) return <p className="text-center mt-20 dark:text-p4">Loading course...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!reviews) return <p className="text-center mt-20 dark:text-p4">Course not found.</p>;
  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews?.length || 0;

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">Student Reviews & Ratings</p>
      </div>

      {/* Overall Rating Summary */}
      <div className="bg-p4 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-p4 mb-2">{averageRating}</div>
            <div className="flex justify-center mb-2">
              <StarRating rating={Math.round(averageRating)} />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-800 dark:text-p4 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDistribution[rating] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-p4 mb-6">
          Student Reviews ({totalReviews})
        </h2>
        
        {reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-p4 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {review.user?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-p4">
                        {review.user || 'Anonymous User'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {review.rating} out of 5
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.createdAt && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {review.comment}
                </div>

                {/* Review Tags (if available) */}
                {review.tags && review.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {review.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-p4 mb-2">No reviews yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to review this course and share your experience!
            </p>
          </div>
        )}
      </div>

      {/* Review Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Review Guidelines
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Share your honest experience with the course</li>
          <li>• Focus on the content quality and instructor effectiveness</li>
          <li>• Mention specific aspects you found helpful or challenging</li>
          <li>• Keep reviews constructive and respectful</li>
        </ul>
      </div>
    </div>
  );
}
