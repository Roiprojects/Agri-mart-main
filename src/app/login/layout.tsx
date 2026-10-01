import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In & Verification | AGRI MART MEGA',
  description: 'Farmer and operational team sign-in portal.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
