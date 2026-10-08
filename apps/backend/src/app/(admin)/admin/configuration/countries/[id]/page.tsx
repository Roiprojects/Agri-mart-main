'use client';

import React, { use } from 'react';
import CountriesPage from '../page';

export default function CountryEditDynamicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapped = use(params);
  // Re-uses CountriesPage with edit parameter set
  return <CountriesPage />;
}
