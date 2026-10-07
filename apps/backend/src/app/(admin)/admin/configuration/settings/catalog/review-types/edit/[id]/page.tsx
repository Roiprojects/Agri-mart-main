'use client';

import React, { use } from 'react';
import { ReviewTypeForm } from '../../ReviewTypeForm';

interface EditReviewTypePageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function EditReviewTypePage({ params }: EditReviewTypePageProps) {
  // Support both Promise params (Next.js 15+) and direct object params
  const resolvedParams = params instanceof Promise || (typeof (params as any)?.then === 'function')
    ? use(params as Promise<{ id: string }>)
    : (params as { id: string });

  return <ReviewTypeForm isEdit={true} reviewTypeId={resolvedParams.id} />;
}
