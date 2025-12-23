import React, { useState } from 'react';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const handleNavClick = () => setIsMobileMenuOpen(false);

    return (
        <header className="sticky top-0 z-[2000] bg-black/95 backdrop-blur-md border-b border-white/10 h-20">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img src="/assets/logo.png" alt="Afro Awards Logo" className="h-12 w-auto object-contain" />
                    {/* <h2 className="text-2xl font-bold tracking-widest text-[#FDB931]" style={{ fontFamily: 'Placard Condensed' }}>
                        AFRO AWARDS
                    </h2> */}
                </div>

                {/* Desktop Nav (Keep for large screens if desired, or remove if sidebar handles everything. Keeping for now as sidebar is togglable) */}
                <nav className="hidden md:flex items-center gap-8 mr-12">
                    {/* Links here are optional if Sidebar is primary, but standard pattern is Navbar links + Sidebar drawer. 
                         User said "professional right menu". Let's keep desktop navbar for quick access but rely on Sidebar for Categories.
                     */}
                    <a href="#vote" className="text-white hover:text-[#FDB931] uppercase tracking-wider text-sm font-semibold transition-colors">Vote Now</a>
                    <a href="#details" className="text-white hover:text-[#FDB931] uppercase tracking-wider text-sm font-semibold transition-colors">Event Details</a>
                    <a href="#about" className="text-white hover:text-[#FDB931] uppercase tracking-wider text-sm font-semibold transition-colors">About</a>
                    <a href="#contact" className="text-white hover:text-[#FDB931] uppercase tracking-wider text-sm font-semibold transition-colors">Contact</a>
                </nav>
            </div>
        </header>
    );
}
