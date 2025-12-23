import React from 'react';

export default function NomineeCard({ nominee, votes, totalVotes, onVote }) {
    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

    return (
        <div
            className="flex items-center gap-4 bg-[#0a1520]/80 rounded-lg p-3 border border-[#FDB931]/20 hover:border-[#FDB931] hover:-translate-y-1 transition-all duration-300 w-full"
            onClick={onVote}
        >
            <div
                className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-cover bg-center border border-[#FDB931]/30 shadow-lg relative"
                style={{ backgroundImage: `url('${nominee.image || '/assets/placeholder_user.png'}')` }}
            >
                {!nominee.image && (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                        👤
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 text-left">
                <h4 className="text-white font-bold text-lg leading-tight truncate font-['Placard Condensed']">
                    {nominee.name}
                </h4>
                {nominee.subText && (
                    <p className="text-gray-400 text-xs truncate mb-2">{nominee.subText}</p>
                )}

                <div className="mt-1">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#FDB931] to-[#9e7f2a] transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                        <span>{votes} votes</span>
                        <span>{percentage}%</span>
                    </div>
                </div>
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onVote(); }}
                className="px-4 py-1.5 bg-gradient-to-r from-[#FDB931] to-[#9e7f2a] text-black font-bold text-xs uppercase rounded hover:shadow-[0_0_10px_#FDB931] transition-shadow"
            >
                Vote
            </button>
        </div>
    );
}
