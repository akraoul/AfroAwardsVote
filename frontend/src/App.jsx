import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NomineeGrid from './components/NomineeGrid';
import { useNominees } from './hooks/useNominees';
import { Search } from 'lucide-react';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const { nominees, voteCounts, totalVotes, recordVote, getNomineeId } = useNominees();

  const handleVote = async (category, name) => {
    try {
      await recordVote(category, name);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } catch (error) {
      alert(error.message); // Show "Daily limit reached..."
    }
  };

  return (
    <div className="min-h-screen bg-[#020b14] text-white">
      <Navbar />
      <Sidebar activeCategory={activeCategory} onCategorySelect={setActiveCategory} />

      {/* Hero Section */}
      <section id="details" className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center justify-center gap-12 lg:pr-[280px] transition-all duration-300">
        <div className="w-full max-w-[320px] p-2 border border-[#FDB931] rounded-xl bg-white/5 shadow-[0_0_30px_rgba(253,185,49,0.15)] transform hover:scale-105 transition-transform duration-500">
          <img
            src="/assets/poster.jpg"
            alt="Afro Awards First Edition"
            className="w-full rounded-lg block"
          />
        </div>

        <div className="text-center md:text-left space-y-6 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight font-['Placard Condensed']">
            Afro Awards <br />
            <span className="block text-sm tracking-[0.5em] text-white mt-2 uppercase font-sans">First Edition</span>
          </h1>

          <div className="space-y-2 text-lg md:text-xl text-gray-300 font-medium border-l-2 border-[#FDB931] pl-4 md:border-none md:pl-0">
            <p><strong className="text-white">DATE:</strong> 27 DEC 2025</p>
            <p><strong className="text-white">TIME:</strong> 08:00 PM</p>
            <p><strong className="text-white">VENUE:</strong> SAFARI LOUNGE BAR</p>
            <p><strong className="text-white">LOC:</strong> MINSK, ZYBITSKAYA, 23</p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
            <a href="#vote" className="px-8 py-3 bg-gradient-to-r from-[#FDB931] to-[#9e7f2a] text-black font-bold uppercase tracking-wider shadow-[0_5px_15px_rgba(253,185,49,0.3)] hover:scale-105 transition-transform rounded-lg">
              Vote Now
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="vote" className="container mx-auto px-4 py-8 pb-20 lg:pr-[280px] transition-all duration-300">
        <div className="sticky top-20 z-[1000] bg-[#020b14]/95 backdrop-blur-md py-4 -mx-4 px-4 border-b border-white/5 mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for artist, song, or category..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#FDB931] focus:ring-1 focus:ring-[#FDB931] transition-all"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim()) setActiveCategory('all');
              }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          </div>
          {searchQuery && (
            <p className="text-center text-gray-400 text-sm mt-2">
              Searching for: <span className="text-[#FDB931]">"{searchQuery}"</span>
            </p>
          )}
        </div>

        <NomineeGrid
          nominees={nominees}
          voteCounts={voteCounts}
          onVote={handleVote}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          getNomineeId={getNomineeId}
        />
      </main>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-16 lg:pr-[280px] border-t border-white/10 transition-all duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-[#FDB931] font-['Placard Condensed'] tracking-widest">ABOUT</h2>
          <div className="bg-white/5 border border-[#FDB931]/30 rounded-2xl p-8md:p-12 relative overflow-hidden group hover:border-[#FDB931] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FDB931]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <h3 className="text-2xl md:text-4xl font-bold leading-relaxed relative z-10 italic">
              "CÉLÉBRONS LA CULTURE ET L'EXCELLENCE AFRICAINE IN BELARUS"
            </h3>
            <div className="w-24 h-1 bg-[#FDB931] mx-auto mt-6 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-16 pb-32 lg:pr-[280px] border-t border-white/10 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-[#FDB931] font-['Placard Condensed'] tracking-widest text-center">CONTACT</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="bg-[#0a1520] p-8 rounded-xl border border-white/10 text-center hover:border-[#FDB931] transition-colors group">
              <div className="w-12 h-12 bg-[#FDB931]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FDB931] group-hover:bg-[#FDB931] group-hover:text-black transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Phone</h3>
              <a href="tel:+375256299120" className="text-gray-400 hover:text-[#FDB931] transition-colors">+375 25 629-91-20</a>
            </div>

            {/* Instagram */}
            <div className="bg-[#0a1520] p-8 rounded-xl border border-white/10 text-center hover:border-[#FDB931] transition-colors group">
              <div className="w-12 h-12 bg-[#FDB931]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FDB931] group-hover:bg-[#FDB931] group-hover:text-black transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Instagram</h3>
              <a href="https://www.instagram.com/dasylva__?igsh=eGtwam85NDN6YTc3" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FDB931] transition-colors">@dasylva__</a>
            </div>

            {/* Venue */}
            <div className="bg-[#0a1520] p-8 rounded-xl border border-white/10 text-center hover:border-[#FDB931] transition-colors group">
              <div className="w-12 h-12 bg-[#FDB931]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FDB931] group-hover:bg-[#FDB931] group-hover:text-black transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Venue</h3>
              <p className="text-gray-400">Кирила и Мафодия 8</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm lg:pr-[280px]">
        <p>&copy; 2025 Afro Awards in Belarus. All rights reserved.</p>
      </footer>

      {/* Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 lg:left-[calc(50%-140px)] bg-[#FDB931] text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(253,185,49,0.4)] transform transition-all duration-300 z-[3000] flex items-center gap-2 ${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <span>Details Saved ✔</span>
      </div>
    </div>
  );
}

export default App;
