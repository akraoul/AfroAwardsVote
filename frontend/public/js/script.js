console.log("SCRIPT.JS LOADED - TOP LEVEL");
document.addEventListener('DOMContentLoaded', () => {
    // --- Data & Initialization ---
    const categoryMapping = {
        'best-artist-performance': 'cat-artist-performance',
        'best-song': 'cat-best-song',
        'best-dj': 'cat-best-dj',
        'best-album': 'cat-best-album',
        'best-tiktoker': 'cat-best-tiktoker',
        'best-mc': 'cat-best-mc',
        'best-male-model': 'cat-best-male-model',
        'best-female-model': 'cat-best-female-model',
        'best-dancer': 'cat-best-dancer',
        'best-promoter': 'cat-best-promoter',
        'best-rap-artist': 'cat-best-rap-artist',
        'best-rap-song': 'cat-best-rap-song',
        'best-athlete': 'cat-best-athlete'
    };

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

    // --- Core Logic (Supabase) ---
    let nomineesData = defaultNominees;
    let voteCounts = {};
    renderNominees();

    fetchNominees();
    setupRealtimeSubscription();

    async function fetchNominees() {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('nominees')
            .select('*');

        if (error) {
            console.error('Error fetching nominees:', error);
            return;
        }

        if (data && data.length > 0) {
            const newNomineesData = {};
            Object.keys(categoryMapping).forEach(cat => {
                newNomineesData[cat] = [];
            });

            voteCounts = {};

            data.forEach(row => {
                if (!newNomineesData[row.category]) {
                    newNomineesData[row.category] = [];
                }
                newNomineesData[row.category].push({
                    name: row.name,
                    subText: row.sub_text,
                    image: row.image_url,
                    dbId: row.id
                });

                const key = getNomineeId(row.category, row.name);
                voteCounts[key] = row.vote_count;
            });

            nomineesData = newNomineesData;
            renderNominees();
            refreshStats();
        } else {
            console.log("Database empty. Seeding with defaults...");
            await seedDatabaseWithDefaults();
        }
    }

    async function seedDatabaseWithDefaults() {
        const payloads = [];
        for (const [category, list] of Object.entries(defaultNominees)) {
            list.forEach(nom => {
                payloads.push({
                    category: category,
                    name: nom.name,
                    sub_text: nom.subText || '',
                    image_url: '',
                    vote_count: 0
                });
            });
        }

        const { error } = await supabase
            .from('nominees')
            .insert(payloads);

        if (error) {
            console.error("Error seeding database:", error);
        } else {
            console.log("Database seeded successfully! Fetching data...");
            fetchNominees();
        }
    }

    function setupRealtimeSubscription() {
        if (!supabase) return;
        supabase
            .channel('public:nominees')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'nominees' }, payload => {
                const row = payload.new;
                const key = getNomineeId(row.category, row.name);
                voteCounts[key] = row.vote_count;
                refreshStats();
            })
            .subscribe((status) => {
                console.log("Supabase Realtime status:", status);
            });
    }

    function renderNominees() {
        for (const [categoryKey, nominees] of Object.entries(nomineesData)) {
            const containerId = categoryMapping[categoryKey];
            const section = document.getElementById(containerId);
            if (!section) continue;

            const grid = section.querySelector('.nominees-grid');
            if (!grid) continue;

            grid.innerHTML = '';

            const list = Array.isArray(nominees) ? nominees : [];

            list.forEach((nom, index) => {
                const card = document.createElement('div');
                card.className = 'nominee-card';
                card.dataset.category = categoryKey;
                card.dataset.nominee = nom.name;

                const hasImageClass = nom.image ? 'has-image' : '';

                card.innerHTML = `
                    <div class="nominee-avatar ${hasImageClass}"></div>
                    <div class="nominee-info">
                        <h4>${nom.name}</h4>
                        ${nom.subText ? `<p class="sub-text">${nom.subText}</p>` : ''}
                        
                        <!-- Vote Stats Hidden/Removed per request -->

                        <button class="vote-btn">Vote</button>
                    </div>
                `;

                if (nom.image) {
                    card.querySelector('.nominee-avatar').style.backgroundImage = `url('${nom.image}')`;
                    card.querySelector('.nominee-avatar').style.backgroundSize = 'cover';
                    card.querySelector('.nominee-avatar').style.backgroundPosition = 'center';
                }

                card.addEventListener('click', () => handleVote(card));
                grid.appendChild(card);
            });
        }
    }

    // --- Global Elements ---
    const searchInput = document.getElementById('searchInput');
    const navPills = document.querySelectorAll('.nav-pill');
    const sections = document.querySelectorAll('.category-section');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('mainNav');
    const exportBtn = document.getElementById('exportDataBtn');
    const toast = document.getElementById('voteToast');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const navDropdown = document.querySelector('.nav-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // --- Mobile Menu and Dropdown Fix ---
    console.log("Initializing mobile menu...");

    // Hamburger Menu Toggle
    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("Hamburger clicked!");

            // Toggle hamburger animation
            hamburgerBtn.classList.toggle('active');

            // Toggle main navigation
            mainNav.classList.toggle('active');

            // Close dropdown if open
            if (navDropdown && navDropdown.classList.contains('active')) {
                navDropdown.classList.remove('active');
            }
        });
    }

    // Dropdown Toggle for Mobile
    if (dropdownToggle && navDropdown && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Dropdown toggle clicked");

            // Toggle dropdown visibility
            navDropdown.classList.toggle('active');

            // On mobile, ensure hamburger state is correct
            if (window.innerWidth <= 768) {
                // If hamburger is not active but dropdown is clicked, show main nav
                if (!mainNav.classList.contains('active')) {
                    mainNav.classList.add('active');
                    hamburgerBtn.classList.add('active');
                }
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        // Close dropdown if clicking outside
        if (navDropdown && navDropdown.classList.contains('active') &&
            !navDropdown.contains(e.target)) {
            navDropdown.classList.remove('active');
        }

        // Close mobile menu if clicking outside
        if (window.innerWidth <= 768 && mainNav && mainNav.classList.contains('active') &&
            hamburgerBtn && !hamburgerBtn.contains(e.target) &&
            !mainNav.contains(e.target)) {
            mainNav.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            // Also close dropdown if open
            if (navDropdown && navDropdown.classList.contains('active')) {
                navDropdown.classList.remove('active');
            }
        }
    });

    // Close menus when clicking on nav items (except dropdown toggle)
    document.querySelectorAll('.nav-item:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    hamburgerBtn.classList.remove('active');
                }
                if (navDropdown.classList.contains('active')) {
                    navDropdown.classList.remove('active');
                }
            }
        });
    });

    // Category Filtering
    if (navPills.length > 0) {
        navPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetId = pill.dataset.target;
                filterByCategory(targetId);

                // Close menus on mobile
                if (window.innerWidth <= 768) {
                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        hamburgerBtn.classList.remove('active');
                    }
                    if (navDropdown.classList.contains('active')) {
                        navDropdown.classList.remove('active');
                    }
                }
            });
        });
    }

    // Search Functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterContent(query);
            if (query.length > 0) {
                navPills.forEach(p => {
                    if (p.dataset.target === 'all') {
                        p.classList.add('active');
                    } else {
                        p.classList.remove('active');
                    }
                });
            }
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportVoteData);
    }

    // --- Logic Functions ---
    function filterByCategory(targetId) {
        // Update active pill
        navPills.forEach(p => {
            if (p.dataset.target === targetId) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });

        if (targetId === 'all') {
            sections.forEach(sec => {
                sec.style.display = 'block';
                const cards = sec.querySelectorAll('.nominee-card');
                cards.forEach(c => c.style.display = 'flex');
            });
            searchInput.value = '';
        } else {
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.style.display = 'block';
                    const cards = sec.querySelectorAll('.nominee-card');
                    cards.forEach(c => c.style.display = 'flex');
                } else {
                    sec.style.display = 'none';
                }
            });
            searchInput.value = '';
        }

        document.querySelector('#vote').scrollIntoView({ behavior: 'smooth' });
    }

    function filterContent(query) {
        if (!query.trim()) {
            const activePill = document.querySelector('.nav-pill.active');
            if (activePill) {
                filterByCategory(activePill.dataset.target);
            }
            return;
        }

        sections.forEach(section => {
            const nominees = section.querySelectorAll('.nominee-card');
            const categoryTitle = section.querySelector('.category-title').textContent.toLowerCase();
            let hasVisibleNominees = false;
            const categoryMatch = categoryTitle.includes(query);

            nominees.forEach(card => {
                const name = card.querySelector('h4').textContent.toLowerCase();
                const subText = card.querySelector('.sub-text') ? card.querySelector('.sub-text').textContent.toLowerCase() : '';
                if (name.includes(query) || subText.includes(query) || categoryMatch) {
                    card.style.display = 'flex';
                    hasVisibleNominees = true;
                } else {
                    card.style.display = 'none';
                }
            });

            section.style.display = hasVisibleNominees ? 'block' : 'none';
        });
    }

    // --- Voting System ---
    function getNomineeId(category, name) {
        return `${category}_${name.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }

    const API_URL = window.API_BASE_URL || "/api"; // defined in config.js or fallback

    async function handleVote(selectedCard) {
        const category = selectedCard.dataset.category;
        const nominee = selectedCard.dataset.nominee;
        const voteKey = getNomineeId(category, nominee);

        try {
            // Optimistic UI Update (optional, but disabled for strict enforcement feedback)
            // Better to wait for server response to confirm vote is allowed.

            const res = await fetch(`${API_URL}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, name: nominee })
            });

            const data = await res.json();

            if (res.ok) {
                // Success
                voteCounts[voteKey] = data.newCount;
                refreshStats();
                showToast("Vote Recieved! ✅");

                // Track locally just for immediate UI feedback consistency if needed
                localStorage.setItem('afroAwardsOfflineCount', JSON.stringify(voteCounts));
            } else if (res.status === 429) {
                // Rate Limit Reached
                alert("⚠️ Limit Reached: You can only vote 3 times per day for this category.");
            } else {
                // Other Error
                console.error("Vote failed:", data.error);
                alert("Vote failed: " + (data.error || "Unknown error"));
            }

        } catch (error) {
            console.error("Network error submitting vote:", error);
            alert("Network error. Please check your connection.");
        }
    }

    function refreshStats() {
        const allCategories = Object.keys(nomineesData);
        let globalTotalVotes = 0;

        allCategories.forEach(cat => {
            const catNominees = nomineesData[cat] || [];
            let totalVotes = 0;

            catNominees.forEach(nom => {
                const key = getNomineeId(cat, nom.name);
                const val = voteCounts[key] || 0;
                totalVotes += val;
                globalTotalVotes += val;
            });

            const catCards = document.querySelectorAll(`[data-category="${cat}"]`);
            catCards.forEach(card => {
                const nomName = card.dataset.nominee;
                const key = getNomineeId(cat, nomName);
                const count = voteCounts[key] || 0;

                let percentage = 0;
                if (totalVotes > 0) {
                    percentage = Math.round((count / totalVotes) * 100);
                }

                const fill = card.querySelector('.vote-progress-fill');
                const countText = card.querySelector('.vote-count-text .count');
                const percentText = card.querySelector('.vote-count-text .percent');

                if (fill && countText && percentText) {
                    fill.style.width = `${percentage}%`;
                    countText.textContent = `${count} votes`;
                    percentText.textContent = `${percentage}%`;
                }
            });
        });

        const globalCountEl = document.getElementById('globalVoteCount');
        if (globalCountEl) {
            globalCountEl.textContent = globalTotalVotes.toLocaleString();
        }
    }

    function showToast() {
        if (!toast) return;
        toast.className = "toast show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    }

    function exportVoteData() {
        alert("Exporting current local data view.");
        const data = {
            nominees: nomineesData,
            votes: voteCounts,
            exportedAt: new Date().toISOString()
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "afro_awards_export.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // --- Leaderboard Logic ---
    const leaderboardBtn = document.getElementById('viewLeaderboardBtn');
    const leaderboardModal = document.getElementById('leaderboardModal');
    const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');

    if (leaderboardBtn && leaderboardModal && closeLeaderboardBtn) {
        leaderboardBtn.addEventListener('click', () => {
            renderLeaderboard();
            leaderboardModal.style.display = 'flex';
        });

        closeLeaderboardBtn.addEventListener('click', () => {
            leaderboardModal.style.display = 'none';
        });

        leaderboardModal.addEventListener('click', (e) => {
            if (e.target === leaderboardModal) {
                leaderboardModal.style.display = 'none';
            }
        });
    }

    function renderLeaderboard() {
        const tbody = document.getElementById('leaderboardBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        let allNominees = [];

        for (const [catKey, list] of Object.entries(nomineesData)) {
            if (Array.isArray(list)) {
                list.forEach(nom => {
                    const key = getNomineeId(catKey, nom.name);
                    const count = voteCounts[key] || 0;
                    allNominees.push({
                        name: nom.name,
                        category: catKey,
                        count: count
                    });
                });
            }
        }

        allNominees.sort((a, b) => b.count - a.count);

        allNominees.forEach((item, index) => {
            const row = document.createElement('tr');
            const catName = item.category.replace('cat-', '').replace(/-/g, ' ').toUpperCase();

            let rankClass = '';
            if (index === 0) rankClass = 'rank-1';
            if (index === 1) rankClass = 'rank-2';
            if (index === 2) rankClass = 'rank-3';

            row.innerHTML = `
                <td class="${rankClass}">#${index + 1}</td>
                <td style="font-weight:bold;">${item.name}</td>
                <td style="font-size:0.9em; opacity:0.8;">${catName}</td>
                <td class="${rankClass}">${item.count.toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Initialize with "All" filter active
    filterByCategory('all');
});