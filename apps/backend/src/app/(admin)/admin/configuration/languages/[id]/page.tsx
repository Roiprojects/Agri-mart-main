'use client';

import React, { use } from 'react';
import LanguagesPage from '../page';

export default function LanguageEditDynamicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapped = use(params);
  return <LanguagesPage />;
}
