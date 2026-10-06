'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AddressAttributeForm, AddressAttributeData } from '../../AddressAttributeForm';

export default function NewAddressAttributePage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/admin/configuration/settings/customer');
  };

  const handleSave = (data: AddressAttributeData, continueEditing?: boolean) => {
    if (continueEditing) {
      alert('Address attribute created. You can now continue editing.');
    } else {
      router.push('/admin/configuration/settings/customer');
    }
  };

  return (
    <AddressAttributeForm
      isEdit={false}
      initialValues={{ displayOrder: 0, controlType: 'Drop-down list', isRequired: false }}
      onBack={handleBack}
      onSave={handleSave}
    />
  );
}
