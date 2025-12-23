import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const CATEGORIES = [
    { id: 'all', label: 'All Categories' },
    { id: 'best-artist-performance', label: 'Artist Performance' },
    { id: 'best-song', label: 'Best Song' },
    { id: 'best-dj', label: 'Best DJ' },
    { id: 'best-album', label: 'Best Album' },
    { id: 'best-tiktoker', label: 'Tik Toker' },
    { id: 'best-mc', label: 'Best MC' },
    { id: 'best-male-model', label: 'Male Model' },
    { id: 'best-female-model', label: 'Female Model' },
    { id: 'best-dancer', label: 'Best Dancer' },
    { id: 'best-promoter', label: 'Promoter' },
    { id: 'best-rap-artist', label: 'Rap Artist' },
    { id: 'best-rap-song', label: 'Rap Song' },
    { id: 'best-athlete', label: 'Athlete' },
];

export default function Sidebar({ activeCategory, onCategorySelect }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Toggle Button (Visible when closed on mobile, or always) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed right-0 top-24 z-[2001] bg-[#FDB931] text-black p-2 rounded-l-lg shadow-[0_0_15px_rgba(253,185,49,0.3)] transition-all duration-300 ${isOpen ? 'translate-x-0 right-[250px]' : 'translate-x-0'}`}
            >
                {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Sidebar Panel */}
            <aside
                className={`fixed top-0 right-0 h-full w-[250px] bg-[#0a1520]/95 backdrop-blur-md border-l border-[#FDB931]/30 z-[2000] transform transition-transform duration-300 ease-in-out pt-24 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="px-6 pb-20 space-y-8">
                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-[#FDB931] font-bold text-xl mb-4 font-['Placard Condensed'] tracking-widest border-b border-[#FDB931]/20 pb-2">
                            MENU
                        </h3>
                        <nav className="flex flex-col space-y-2">
                            {['Vote', 'Details', 'About', 'Contact'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-right px-4 py-2 text-gray-300 hover:text-[#FDB931] hover:bg-white/5 rounded transition-all duration-200 uppercase tracking-wider font-semibold"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-[#FDB931] font-bold text-xl mb-4 font-['Placard Condensed'] tracking-widest border-b border-[#FDB931]/20 pb-2">
                            CATEGORIES
                        </h3>
                        <div className="space-y-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        onCategorySelect(cat.id);
                                        setIsOpen(false);
                                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Reset scroll to show content
                                    }}
                                    className={`block w-full text-right px-4 py-3 text-sm rounded transition-all duration-200 ${activeCategory === cat.id
                                        ? 'bg-gradient-to-l from-[#FDB931] to-transparent text-white font-bold border-r-4 border-[#FDB931]'
                                        : 'text-gray-400 hover:text-[#FDB931] hover:bg-white/5'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
