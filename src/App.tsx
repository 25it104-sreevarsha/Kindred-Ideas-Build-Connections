import { useState } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import IcebreakerTab from '@/components/icebreaker/IcebreakerTab';
import SayItBetterTab from '@/components/sayitbetter/SayItBetterTab';
import type { Tab } from '@/types';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('icebreaker');

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-100 via-slate-50 to-pink-100 font-sans text-slate-900">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-8 sm:px-6 sm:pt-10">
        <div key={activeTab}>
          {activeTab === 'icebreaker' ? <IcebreakerTab /> : <SayItBetterTab />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
