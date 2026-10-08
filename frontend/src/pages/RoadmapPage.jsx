import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieRoadmapFinder from '../components/roadmap/MovieRoadmapFinder';

export default function RoadmapPage() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug') || searchParams.get('movie') || 'spider-man-brand-new-day';

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <MovieRoadmapFinder initialSlug={slug} />
    </div>
  );
}
