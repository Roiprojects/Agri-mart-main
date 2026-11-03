'use client';

import React, { use } from 'react';
import { ReviewTypeForm } from '../../ReviewTypeForm';

interface EditReviewTypePageProps {
  params: Promise<{ id: string }>;
}

export default function EditReviewTypePage({ params }: EditReviewTypePageProps) {
  const resolvedParams = use(params);

  return <ReviewTypeForm isEdit={true} reviewTypeId={resolvedParams.id} />;
}
