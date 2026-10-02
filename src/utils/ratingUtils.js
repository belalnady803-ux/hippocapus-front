export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1);
};

export const getRatingDistribution = (reviews) => {
  if (!reviews) return {};
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    if (distribution[review.rating] !== undefined) {
      distribution[review.rating]++;
    }
  });
  return distribution;
};
