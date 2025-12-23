

import { useState, useEffect } from 'react';
import { defaultNominees } from '../data/nominees';

// Use relative path for proxying (Vite in dev, Vercel in prod)
// Use environment variable for production, fallback to proxy for dev
const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export function useNominees() {
    const [nominees, setNominees] = useState(defaultNominees);
    const [voteCounts, setVoteCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [totalVotes, setTotalVotes] = useState(0);

    const getNomineeId = (category, name) => `${category}_${name.replace(/[^a-zA-Z0-9]/g, '_')}`;

    useEffect(() => {
        fetchNominees();
        // Poll for updates (simple realtime simulation)
        const interval = setInterval(fetchNominees, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const total = Object.values(voteCounts).reduce((a, b) => a + b, 0);
        setTotalVotes(total);
    }, [voteCounts]);

    const fetchNominees = async () => {
        try {
            const res = await fetch(`${API_URL}/nominees`);
            const json = await res.json();

            if (json.data) {
                // Transform DB rows to App State
                const newNominees = {};
                const newVoteCounts = {};

                // Reset with defaults structure to ensure all cats exist
                Object.keys(defaultNominees).forEach(key => newNominees[key] = []);

                json.data.forEach(row => {
                    if (!newNominees[row.category]) newNominees[row.category] = [];

                    newNominees[row.category].push({
                        name: row.name,
                        subText: row.sub_text,
                        image: row.image_url,
                        dbId: row.id
                    });

                    const key = getNomineeId(row.category, row.name);
                    newVoteCounts[key] = row.vote_count;
                });

                setNominees(newNominees);
                setVoteCounts(newVoteCounts);
            }
        } catch (err) {
            console.error("API Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const recordVote = async (category, name) => {
        const key = getNomineeId(category, name);

        // Optimistic Update
        setVoteCounts(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));

        try {
            const res = await fetch(`${API_URL}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, name })
            });

            if (!res.ok) {
                // Revert optimistic update
                setVoteCounts(prev => ({ ...prev, [key]: (prev[key] || 0) - 1 }));

                if (res.status === 429) {
                    throw new Error("Daily limit reached (3 votes/category).");
                } else {
                    const err = await res.json();
                    throw new Error(err.error || "Vote failed.");
                }
            }

            // Success - stick with optimistic value (or re-fetch if strict)
        } catch (err) {
            console.error("Vote Error:", err);
            // Revert optimistic update (if not already reverted)
            // Note: In simple flow, checking !res.ok handles most. Network err here.
            // For network error we should also revert if we want consistency.
            // But logic above handles API errors.
            // If network error (fetch throws), validation is hard. 
            // Better to re-fetch nominees?
            // For now, simple throw to let UI know.
            throw err;
        }
    };

    return { nominees, voteCounts, totalVotes, loading, recordVote, getNomineeId };
}
