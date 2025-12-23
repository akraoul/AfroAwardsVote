const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 4000; // Updated to 4000 per user request

app.use(cors()); // Allow all origins for now to simplify Vercel connection
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for images
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Get all nominees
app.get('/api/nominees', (req, res) => {
    db.all("SELECT * FROM nominees", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// Add Nominee (Manager)
app.post('/api/nominees', (req, res) => {
    const { category, name, subText, image } = req.body;
    if (!category || !name) {
        return res.status(400).json({ error: "Category and Name are required" });
    }

    db.run("INSERT INTO nominees (category, name, sub_text, image_url) VALUES (?, ?, ?, ?)",
        [category, name, subText || '', image || ''],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, success: true });
        }
    );
});

// Update Nominee (Manager)
app.put('/api/nominees/:id', (req, res) => {
    const { name, subText, image } = req.body;
    const { id } = req.params;

    // Dynamic query to avoid overwriting image with empty string if not provided
    let sql = "UPDATE nominees SET name = ?, sub_text = ?";
    let params = [name, subText || ''];

    if (image !== undefined) {
        sql += ", image_url = ?";
        params.push(image);
    }

    sql += " WHERE id = ?";
    params.push(id);

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, changes: this.changes });
    }
    );
});

// Delete Nominee (Manager)
app.delete('/api/nominees/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM nominees WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, changes: this.changes });
    });
});

// Vote (Public)
// Vote (Public) with Rate Limiting
app.post('/api/vote', (req, res) => {
    const { category, name } = req.body;
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Normalize IP (handle ::1 for localhost)
    if (ip === '::1') ip = '127.0.0.1';
    // If x-forwarded-for contains multiple IPs, take the first one
    if (ip && ip.indexOf(',') > -1) {
        ip = ip.split(',')[0];
    }

    if (!category || !name) {
        res.status(400).json({ error: "Missing parameters" });
        return;
    }

    // 1. Check Rate Limit
    // "SELECT count(*) FROM votes WHERE ip_address = ? AND category = ? AND date(created_at) = date('now')"
    // Note: SQLite 'date("now")' uses UTC. Ensure consistency.
    const today = new Date().toISOString().split('T')[0];

    db.get(
        "SELECT count(*) as count FROM votes WHERE ip_address = ? AND category = ? AND created_at LIKE ?",
        [ip, category, `${today}%`],
        (err, row) => {
            if (err) {
                console.error("Rate limit check error:", err);
                return res.status(500).json({ error: "Server error during vote check" });
            }

            if (row.count >= 3) {
                return res.status(429).json({ error: "Daily vote limit reached for this category (3 votes/day)." });
            }

            // 2. Process Vote if allowed
            db.get("SELECT id, vote_count FROM nominees WHERE category = ? AND name = ?", [category, name], (err, nomineeRow) => {
                if (err) return res.status(500).json({ error: "Database error" });
                if (!nomineeRow) return res.status(404).json({ error: "Nominee not found" });

                // Transaction-like execution
                db.serialize(() => {
                    // Record valid vote
                    db.run("INSERT INTO votes (ip_address, category, nominee_name) VALUES (?, ?, ?)", [ip, category, name]);

                    // Update count
                    db.run("UPDATE nominees SET vote_count = vote_count + 1 WHERE id = ?", [nomineeRow.id], function (err) {
                        if (err) return res.status(500).json({ error: "Failed to count vote" });
                        res.json({ success: true, newCount: nomineeRow.vote_count + 1, votesToday: row.count + 1 });
                    });
                });
            });
        }
    );
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
