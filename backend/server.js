const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

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
app.post('/api/vote', (req, res) => {
    const { category, name } = req.body;

    if (!category || !name) {
        res.status(400).json({ error: "Missing parameters" });
        return;
    }

    // Check if exists
    db.get("SELECT id, vote_count FROM nominees WHERE category = ? AND name = ?", [category, name], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (row) {
            // Upvote
            db.run("UPDATE nominees SET vote_count = vote_count + 1 WHERE id = ?", [row.id], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ success: true, newCount: row.vote_count + 1 });
            });
        } else {
            res.status(404).json({ error: "Nominee not found" });
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
