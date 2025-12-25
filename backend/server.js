const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const supabase = require('./db');
// Removed sqlite3 dependency

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Get all nominees
app.get('/api/nominees', async (req, res) => {
    const { data, error } = await supabase
        .from('nominees')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ data });
});

// Add Nominee (Manager)
app.post('/api/nominees', async (req, res) => {
    const { category, name, subText, image } = req.body;
    if (!category || !name) {
        return res.status(400).json({ error: "Category and Name are required" });
    }

    const { data, error } = await supabase
        .from('nominees')
        .insert([
            { category, name, sub_text: subText || '', image_url: image || '' }
        ])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id, success: true });
});

// Update Nominee (Manager)
app.put('/api/nominees/:id', async (req, res) => {
    const { name, subText, image } = req.body;
    const { id } = req.params;

    const updates = { name, sub_text: subText || '' };
    if (image !== undefined) {
        updates.image_url = image;
    }

    const { error } = await supabase
        .from('nominees')
        .update(updates)
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// Delete Nominee (Manager)
app.delete('/api/nominees/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('nominees')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// Vote (Public) with Rate Limiting
app.post('/api/vote', async (req, res) => {
    const { category, name } = req.body;
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (ip === '::1') ip = '127.0.0.1';
    if (ip && ip.indexOf(',') > -1) {
        ip = ip.split(',')[0];
    }

    if (!category || !name) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    // 1. Check Rate Limit (Count votes by IP/Category today)
    // Note: Supabase 'created_at' is generic. query by range is best.
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    const { count, error: countError } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .eq('category', category)
        .gte('created_at', todayISO);

    if (countError) {
        console.error("Rate limit check error:", countError);
        return res.status(500).json({ error: "Server error during vote check" });
    }

    if (count >= 3) {
        return res.status(429).json({ error: "Daily vote limit reached for this category (3 votes/day)." });
    }

    // 2. Initial lookup to get ID and ensure nominee exists
    const { data: nominee, error: findError } = await supabase
        .from('nominees')
        .select('id, vote_count')
        .eq('category', category)
        .eq('name', name)
        .single();

    if (findError || !nominee) {
        return res.status(404).json({ error: "Nominee not found" });
    }

    // 3. Record Vote
    const { error: voteError } = await supabase
        .from('votes')
        .insert([
            { ip_address: ip, category, nominee_name: name }
        ]);

    if (voteError) {
        return res.status(500).json({ error: "Failed to record vote" });
    }

    // 4. Update Count (Atomic RPC or Read-Write)
    // Try RPC first if user set it up, otherwise fallback or just fallback to update
    // We'll use SIMPLE UPDATE for now to avoid 'function not found' errors if they didn't run SQL properly.
    // Ideally: await supabase.rpc('increment_vote', { row_id: nominee.id })
    // Fallback:
    const { error: updateError } = await supabase
        .from('nominees')
        .update({ vote_count: nominee.vote_count + 1 })
        .eq('id', nominee.id);

    if (updateError) {
        // Vote was recorded but count not updated. Inconsistent state potential.
        console.error("Failed to update count:", updateError);
        // We still return success because the vote is strictly "recorded" in votes table.
        // The count is just a cache.
    }

    res.json({ success: true, newCount: nominee.vote_count + 1, votesToday: count + 1 });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
