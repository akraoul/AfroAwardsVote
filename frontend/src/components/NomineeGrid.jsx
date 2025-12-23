import React from 'react';
import NomineeCard from './NomineeCard';
import { categoryMapping } from '../data/nominees';

export default function NomineeGrid({
    nominees,
    voteCounts,
    onVote,
    activeCategory,
    searchQuery,
    getNomineeId
}) {

    // Flatten and filter logic
    const renderSections = () => {
        return Object.entries(nominees).map(([catKey, list]) => {
            // Filter by Category
            if (activeCategory !== 'all' && activeCategory !== catKey) return null;

            // Filter by Search
            const lowerQuery = searchQuery.toLowerCase();
            const filteredList = list.filter(nom =>
                nom.name.toLowerCase().includes(lowerQuery) ||
                (nom.subText && nom.subText.toLowerCase().includes(lowerQuery)) ||
                categoryMapping[catKey].toLowerCase().includes(lowerQuery)
            );

            if (filteredList.length === 0) return null;

            // Calculate category specific total for percentages
            const catTotalVotes = list.reduce((sum, nom) => {
                const key = getNomineeId(catKey, nom.name);
                return sum + (voteCounts[key] || 0);
            }, 0);

            return (
                <section key={catKey} id={catKey} className="mb-16 scroll-mt-24">
                    <h3 className="text-3xl font-bold text-[#FDB931] mb-6 border-b border-[#FDB931]/30 pb-2 inline-block font-['Placard Condensed'] tracking-wide">
                        {categoryMapping[catKey] || catKey}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredList.map((nom, idx) => {
                            const voteKey = getNomineeId(catKey, nom.name);
                            const votes = voteCounts[voteKey] || 0;

                            return (
                                <NomineeCard
                                    key={idx}
                                    nominee={nom}
                                    votes={votes}
                                    totalVotes={catTotalVotes} // Per category percentage
                                    onVote={() => onVote(catKey, nom.name)}
                                />
                            );
                        })}
                    </div>
                </section>
            );
        });
    };

    return (
        <div id="awards-container" className="w-full">
            {renderSections()}
        </div>
    );
}
