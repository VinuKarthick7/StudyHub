import { HubList } from '@/components/HubList';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <HubList />
    </main>
  );
}