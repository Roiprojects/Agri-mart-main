import { redirect } from 'next/navigation';

export default function ContentManagementIndexPage() {
  redirect('/admin/content/topics');
}
