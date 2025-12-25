const supabase = require('./db');

const nominees = [
    // Best Artist Performance
    { category: 'best-artist-performance', name: 'Afrococoa' },
    { category: 'best-artist-performance', name: 'Mansa' },
    { category: 'best-artist-performance', name: 'Union Sacree' },
    { category: 'best-artist-performance', name: 'Motion Group' },
    { category: 'best-artist-performance', name: 'Manur' },
    { category: 'best-artist-performance', name: 'J bliz' },
    { category: 'best-artist-performance', name: 'cj wanted' },

    // Best Song
    { category: 'best-song', name: 'Certifiee', sub_text: 'Union Sacree' },
    { category: 'best-song', name: '1960 Groove', sub_text: 'Afrococoa' },
    { category: 'best-song', name: 'zero on zero', sub_text: 'Mansa' },
    { category: 'best-song', name: 'ebelebe', sub_text: 'cj wanted' },
    { category: 'best-song', name: 'my head', sub_text: 'Motion' },

    // Best DJ
    { category: 'best-dj', name: 'Dj Anthony' },
    { category: 'best-dj', name: 'Dj Dejavu' },
    { category: 'best-dj', name: 'Dj djafar' },
    { category: 'best-dj', name: 'Dj Escobar' },
    { category: 'best-dj', name: 'Dj foxie' },

    // Best Album
    { category: 'best-album', name: '3 Am', sub_text: 'Afrococoa' },
    { category: 'best-album', name: 'motion' },
    { category: 'best-album', name: 'top tier', sub_text: 'Mansa' },

    // Best Tiktoker
    { category: 'best-tiktoker', name: 'Nav' },
    { category: 'best-tiktoker', name: 'nathan' },
    { category: 'best-tiktoker', name: 'Alias' },
    { category: 'best-tiktoker', name: 'La fleure' },
    { category: 'best-tiktoker', name: 'certified malee' },
    { category: 'best-tiktoker', name: 'Rexigner' },
    { category: 'best-tiktoker', name: 'zamani' },
    { category: 'best-tiktoker', name: 'dilan' },

    // Best MC
    { category: 'best-mc', name: 'Izzy' },
    { category: 'best-mc', name: 'kartel' },
    { category: 'best-mc', name: 'Miller' },
    { category: 'best-mc', name: 'iceflare' },

    // Best Male Model
    { category: 'best-male-model', name: 'Rexigner' },
    { category: 'best-male-model', name: 'walther vill' },
    { category: 'best-male-model', name: 'Michael chimaobi' },
    { category: 'best-male-model', name: 'Lory carel' },

    // Best Female Model
    { category: 'best-female-model', name: 'monique' },
    { category: 'best-female-model', name: 'Priscilla' },
    { category: 'best-female-model', name: 'koriane' },
    { category: 'best-female-model', name: 'Dixie b' },

    // Best Dancer
    { category: 'best-dancer', name: 'prince afro' },
    { category: 'best-dancer', name: 'Dc vibe' },
    { category: 'best-dancer', name: "l'ovni" },
    { category: 'best-dancer', name: 'thoko' },

    // Best Promoter
    { category: 'best-promoter', name: 'josh flex' },
    { category: 'best-promoter', name: 'dasylva' },
    { category: 'best-promoter', name: 'xclusiv tonye' },
    { category: 'best-promoter', name: 'olivier' },
    { category: 'best-promoter', name: 'Escausé' },
    { category: 'best-promoter', name: 'fifty' },
    { category: 'best-promoter', name: 'Yves' },

    // Best Rap Artist
    { category: 'best-rap-artist', name: 'Rexigner' },
    { category: 'best-rap-artist', name: 'jbliz' },
    { category: 'best-rap-artist', name: 'no game le ghost' },
    { category: 'best-rap-artist', name: 'lafigth Rondo' },
    { category: 'best-rap-artist', name: 'fritz Diddy' },
    { category: 'best-rap-artist', name: 'Destroyer drex' },
    { category: 'best-rap-artist', name: 'KUMBA BOY' },

    // Best Rap Song
    { category: 'best-rap-song', name: 'Amiri', sub_text: 'la figth' },
    { category: 'best-rap-song', name: 'shake', sub_text: 'rexigner' },
    { category: 'best-rap-song', name: 'again', sub_text: 'fritz diddy' },
    { category: 'best-rap-song', name: 'hightunes', sub_text: 'jbliz' },
    { category: 'best-rap-song', name: 'dejavu', sub_text: 'destroyer drex' },
    { category: 'best-rap-song', name: 'Incompris', sub_text: 'no game le ghost' },

    // Best Athlete
    { category: 'best-athlete', name: 'Bara' },
    { category: 'best-athlete', name: 'camara' },
    { category: 'best-athlete', name: 'mpomez' }
];

async function seed() {
    console.log("Seeding data...");
    const { data, error } = await supabase
        .from('nominees')
        .upsert(nominees, { onConflict: 'category,name', ignoreDuplicates: true });

    if (error) {
        console.error("Error seeding data:", error);
    } else {
        console.log("Data seeded successfully!");
    }
}

seed();
