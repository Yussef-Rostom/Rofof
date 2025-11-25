import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ListingDetailsSkeleton = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <Skeleton className="h-6 w-48 mb-6" /> {/* Back to Browse button placeholder */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section Skeleton */}
          <div>
            <Skeleton className="aspect-[3/4] w-full rounded-lg mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Skeleton className="aspect-square rounded" />
              <Skeleton className="aspect-square rounded" />
              <Skeleton className="aspect-square rounded" />
              <Skeleton className="aspect-square rounded" />
            </div>
          </div>

          {/* Details Section Skeleton */}
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" /> {/* Listing Title */}
            <Skeleton className="h-6 w-1/2 mb-4" /> {/* Author */}
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-20" /> {/* Badge 1 */}
              <Skeleton className="h-6 w-20" /> {/* Badge 2 */}
            </div>
            <Skeleton className="h-10 w-1/4 mb-6" /> {/* Price */}

            <Skeleton className="h-6 w-full mb-3" /> {/* Description Title */}
            <Skeleton className="h-24 w-full mb-8" /> {/* Description text */}

            <Skeleton className="h-32 w-full mb-8" /> {/* Seller Info Card */}

            <Skeleton className="h-12 w-full" /> {/* Add to Cart Button */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsSkeleton;
