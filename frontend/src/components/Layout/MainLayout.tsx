import type { ReactNode } from 'react';
import Header from '../Header';

export default function MainLayout({ children }: { children?: ReactNode }) {
  return (
    <>
      <section className="h-dvh bg-primary-500">
        <Header />
        {children}
      </section>
    </>
  );
}
