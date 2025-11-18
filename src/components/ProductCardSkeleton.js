import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './ProductCardSkeleton.css';

const ProductCardSkeleton = () => {
  return (
    <div className="product-card-skeleton">
      <Skeleton height={250} />
      <div className="skeleton-content">
        <Skeleton width="60%" height={20} style={{ marginBottom: '10px' }} />
        <Skeleton width="40%" height={16} style={{ marginBottom: '10px' }} />
        <Skeleton width="30%" height={24} style={{ marginBottom: '10px' }} />
        <Skeleton width="100%" height={40} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
