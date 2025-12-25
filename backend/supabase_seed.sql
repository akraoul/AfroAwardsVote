-- Seed Data for Nominees
-- Run this AFTER creating the tables.

INSERT INTO nominees (category, name, sub_text) VALUES
-- Best Artist Performance
('best-artist-performance', 'Afrococoa', NULL),
('best-artist-performance', 'Mansa', NULL),
('best-artist-performance', 'Union Sacree', NULL),
('best-artist-performance', 'Motion Group', NULL),
('best-artist-performance', 'Manur', NULL),
('best-artist-performance', 'J bliz', NULL),
('best-artist-performance', 'cj wanted', NULL),

-- Best Song
('best-song', 'Certifiee', 'Union Sacree'),
('best-song', '1960 Groove', 'Afrococoa'),
('best-song', 'zero on zero', 'Mansa'),
('best-song', 'ebelebe', 'cj wanted'),
('best-song', 'my head', 'Motion'),

-- Best DJ
('best-dj', 'Dj Anthony', NULL),
('best-dj', 'Dj Dejavu', NULL),
('best-dj', 'Dj djafar', NULL),
('best-dj', 'Dj Escobar', NULL),
('best-dj', 'Dj foxie', NULL),

-- Best Album
('best-album', '3 Am', 'Afrococoa'),
('best-album', 'motion', NULL),
('best-album', 'top tier', 'Mansa'),

-- Best Tiktoker
('best-tiktoker', 'Nav', NULL),
('best-tiktoker', 'nathan', NULL),
('best-tiktoker', 'Alias', NULL),
('best-tiktoker', 'La fleure', NULL),
('best-tiktoker', 'certified malee', NULL),
('best-tiktoker', 'Rexigner', NULL),
('best-tiktoker', 'zamani', NULL),
('best-tiktoker', 'dilan', NULL),

-- Best MC
('best-mc', 'Izzy', NULL),
('best-mc', 'kartel', NULL),
('best-mc', 'Miller', NULL),
('best-mc', 'iceflare', NULL),

-- Best Male Model
('best-male-model', 'Rexigner', NULL),
('best-male-model', 'walther vill', NULL),
('best-male-model', 'Michael chimaobi', NULL),
('best-male-model', 'Lory carel', NULL),

-- Best Female Model
('best-female-model', 'monique', NULL),
('best-female-model', 'Priscilla', NULL),
('best-female-model', 'koriane', NULL),
('best-female-model', 'Dixie b', NULL),

-- Best Dancer
('best-dancer', 'prince afro', NULL),
('best-dancer', 'Dc vibe', NULL),
('best-dancer', 'l''ovni', NULL),
('best-dancer', 'thoko', NULL),

-- Best Promoter
('best-promoter', 'josh flex', NULL),
('best-promoter', 'dasylva', NULL),
('best-promoter', 'xclusiv tonye', NULL),
('best-promoter', 'olivier', NULL),
('best-promoter', 'Escausé', NULL),
('best-promoter', 'fifty', NULL),
('best-promoter', 'Yves', NULL),

-- Best Rap Artist
('best-rap-artist', 'Rexigner', NULL),
('best-rap-artist', 'jbliz', NULL),
('best-rap-artist', 'no game le ghost', NULL),
('best-rap-artist', 'lafigth Rondo', NULL),
('best-rap-artist', 'fritz Diddy', NULL),
('best-rap-artist', 'Destroyer drex', NULL),
('best-rap-artist', 'KUMBA BOY', NULL),

-- Best Rap Song
('best-rap-song', 'Amiri', 'la figth'),
('best-rap-song', 'shake', 'rexigner'),
('best-rap-song', 'again', 'fritz diddy'),
('best-rap-song', 'hightunes', 'jbliz'),
('best-rap-song', 'dejavu', 'destroyer drex'),
('best-rap-song', 'Incompris', 'no game le ghost'),

-- Best Athlete
('best-athlete', 'Bara', NULL),
('best-athlete', 'camara', NULL),
('best-athlete', 'mpomez', NULL)

ON CONFLICT (category, name) DO NOTHING;
