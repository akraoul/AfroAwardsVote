const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'awards.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.run(`CREATE TABLE IF NOT EXISTS nominees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        sub_text TEXT,
        image_url TEXT,
        vote_count INTEGER DEFAULT 0,
        UNIQUE(category, name)
    )`, (err) => {
        if (err) console.error("Error creating table:", err);
        else seedDefaults();
    });
}

const defaultNominees = {
    'best-artist-performance': [
        { name: "Afrococoa" }, { name: "Mansa" }, { name: "Union Sacree" },
        { name: "Motion Group" }, { name: "Manur" }, { name: "J bliz" }, { name: "cj wanted" }
    ],
    'best-song': [
        { name: "Certifiee", subText: "Union Sacree" }, { name: "1960 Groove", subText: "Afrococoa" },
        { name: "zero on zero", subText: "Mansa" }, { name: "ebelebe", subText: "cj wanted" },
        { name: "my head", subText: "Motion" }
    ],
    'best-dj': [
        { name: "Dj Anthony" }, { name: "Dj Dejavu" }, { name: "Dj djafar" },
        { name: "Dj Escobar" }, { name: "Dj foxie" }
    ],
    'best-album': [
        { name: "3 Am", subText: "Afrococoa" }, { name: "motion" }, { name: "top tier", subText: "Mansa" }
    ],
    'best-tiktoker': [
        { name: "Nav" }, { name: "nathan" }, { name: "Alias" }, { name: "La fleure" },
        { name: "certified malee" }, { name: "Rexigner" }, { name: "zamani" }, { name: "dilan" }
    ],
    'best-mc': [
        { name: "Izzy" }, { name: "kartel" }, { name: "Miller" }, { name: "iceflare" }
    ],
    'best-male-model': [
        { name: "Rexigner" }, { name: "walther vill" }, { name: "Michael chimaobi" }, { name: "Lory carel" }
    ],
    'best-female-model': [
        { name: "monique" }, { name: "Priscilla" }, { name: "koriane" }, { name: "Dixie b" }
    ],
    'best-dancer': [
        { name: "prince afro" }, { name: "Dc vibe" }, { name: "l'ovni" }, { name: "thoko" }
    ],
    'best-promoter': [
        { name: "josh flex" }, { name: "dasylva" }, { name: "xclusiv tonye" },
        { name: "olivier" }, { name: "Escausé" }, { name: "fifty" }, { name: "Yves" }
    ],
    'best-rap-artist': [
        { name: "Rexigner" }, { name: "jbliz" }, { name: "no game le ghost" },
        { name: "lafigth Rondo" }, { name: "fritz Diddy" }, { name: "Destroyer drex" },
        { name: "KUMBA BOY" }
    ],
    'best-rap-song': [
        { name: "Amiri", subText: "la figth" }, { name: "shake", subText: "rexigner" },
        { name: "again", subText: "fritz diddy" }, { name: "hightunes", subText: "jbliz" },
        { name: "dejavu", subText: "destroyer drex" }, { name: "Incompris", subText: "no game le ghost" }
    ],
    'best-athlete': [
        { name: "Bara" }, { name: "camara" }, { name: "mpomez" }
    ]
};

function seedDefaults() {
    db.get("SELECT count(*) as count FROM nominees", (err, row) => {
        if (err) return;
        if (row.count === 0) {
            console.log("Seeding database...");
            const stmt = db.prepare("INSERT INTO nominees (category, name, sub_text, image_url, vote_count) VALUES (?, ?, ?, ?, 0)");

            Object.entries(defaultNominees).forEach(([cat, list]) => {
                list.forEach(nom => {
                    stmt.run(cat, nom.name, nom.subText || '', '');
                });
            });
            stmt.finalize();
            console.log("Seeded.");
        }
    });
}

module.exports = db;
