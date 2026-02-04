// API Configuration - Usar configuración externa
// const API_CONFIG ya está definido en api-config.js

const DEFAULT_GITHUB_USER = "juliyonose7"; // Cambia por tu usuario por defecto

const state = {
    username: DEFAULT_GITHUB_USER,
    repos: [],
    languages: new Set(),
};

const els = {
    year: null,
    navToggle: null,
    menu: null,
    usernameInput: null,
    userForm: null,
    reposGrid: null,
    emptyState: null,
    languageFilter: null,
    githubProfileLink: null,
    githubProfileBtn: null,
};

function qs(sel) { return document.querySelector(sel); }

function setBusy(isBusy) {
    if (!els.reposGrid) return;
    els.reposGrid.setAttribute("aria-busy", String(isBusy));
}

async function fetchRepos(username) {
    const perPage = 100;
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&sort=updated`;
    const res = await fetch(url, { headers: { "Accept": "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();
    return data
        .filter(r => !r.fork)
        .map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            html_url: r.html_url,
            homepage: r.homepage,
            stargazers_count: r.stargazers_count,
            language: r.language,
            updated_at: r.updated_at,
        }));
}

function renderLanguageOptions() {
    if (!els.languageFilter) return;
    const current = els.languageFilter.value;
    const languages = ["", ...Array.from(state.languages).sort((a, b) => (a || "").localeCompare(b || ""))];
    els.languageFilter.innerHTML = "";
    for (const lang of languages) {
        const opt = document.createElement("option");
        opt.value = lang || "";
        opt.textContent = lang || "Todos";
        if (current && current === lang) opt.selected = true;
        els.languageFilter.appendChild(opt);
    }
}

function createRepoCard(repo) {
    const card = document.createElement("article");
    card.className = "repo-card";
    card.setAttribute("role", "listitem");

    const title = document.createElement("h3");
    const link = document.createElement("a");
    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = repo.name;
    title.appendChild(link);

    const desc = document.createElement("p");
    desc.textContent = repo.description || "Sin descripción.";

    const meta = document.createElement("div");
    meta.className = "repo-meta";
    const lang = document.createElement("span");
    lang.className = "badge";
    lang.textContent = repo.language || "N/A";
    const stars = document.createElement("span");
    stars.className = "badge";
    stars.textContent = `★ ${repo.stargazers_count}`;
    const updated = document.createElement("span");
    updated.className = "badge";
    const d = new Date(repo.updated_at);
    updated.textContent = `Act: ${d.toLocaleDateString()}`;
    meta.append(lang, stars, updated);

    const actions = document.createElement("div");
    actions.className = "cta-row";
    if (repo.homepage) {
        const live = document.createElement("a");
        live.className = "btn ghost";
        live.href = repo.homepage;
        live.target = "_blank";
        live.rel = "noopener";
        live.textContent = "Demo";
        actions.appendChild(live);
    }
    const view = document.createElement("a");
    view.className = "btn primary";
    view.href = repo.html_url;
    view.target = "_blank";
    view.rel = "noopener";
    view.textContent = "Código";
    actions.appendChild(view);

    card.append(title, desc, meta, actions);
    return card;
}

function renderRepos() {
    if (!els.reposGrid || !els.emptyState) return;
    const filter = els.languageFilter?.value || "";
    const filtered = state.repos.filter(r => !filter || (r.language || "") === filter);
    els.reposGrid.innerHTML = "";
    if (filtered.length === 0) {
        els.emptyState.hidden = false;
        return;
    }
    els.emptyState.hidden = true;
    for (const repo of filtered) {
        els.reposGrid.appendChild(createRepoCard(repo));
    }
}

async function loadUser(username) {
    try {
        setBusy(true);
        state.username = username;
        const repos = await fetchRepos(username);
        state.repos = repos;
        state.languages = new Set(repos.map(r => r.language).filter(Boolean));
        renderLanguageOptions();
        renderRepos();
        // Enlaces de perfil
        if (els.githubProfileLink) {
            els.githubProfileLink.href = `https://github.com/${encodeURIComponent(username)}`;
            const span = els.githubProfileLink.querySelector('[data-bind="username"]');
            if (span) span.textContent = username;
        }
        if (els.githubProfileBtn) {
            els.githubProfileBtn.href = `https://github.com/${encodeURIComponent(username)}`;
        }
    } catch (err) {
        console.error(err);
        state.repos = [];
        state.languages = new Set();
        renderLanguageOptions();
        renderRepos();
        alert("No se pudieron cargar los repos de GitHub. Verifica el usuario.");
    } finally {
        setBusy(false);
    }
}

function initNav() {
    els.navToggle?.addEventListener("click", () => {
        const expanded = els.navToggle.getAttribute("aria-expanded") === "true";
        els.navToggle.setAttribute("aria-expanded", String(!expanded));
        els.menu?.classList.toggle("open");
    });
}

function initForm() {
    els.userForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = (els.usernameInput?.value || "").trim();
        if (username) loadUser(username);
    });
    els.languageFilter?.addEventListener("change", renderRepos);
}

function initCrayonHover() {
    const hero = qs(".hero");
    const crayonPaths = qs(".crayon-line")?.querySelectorAll(".crayon-path");
    
    if (!hero || !crayonPaths) return;

    hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calcular distancia y dirección para alejar las líneas
        const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        const maxDistance = 200;
        const intensity = Math.min(distance / maxDistance, 1);
        
        // Calcular vector de alejamiento (opuesto al mouse)
        const awayX = -mouseX * intensity * 0.3;
        const awayY = -mouseY * intensity * 0.3;
        
        crayonPaths.forEach((path, index) => {
            const delay = index * 0.05; // Pequeño delay escalonado
            setTimeout(() => {
                path.style.setProperty("--mouse-x", `${awayX}px`);
                path.style.setProperty("--mouse-y", `${awayY}px`);
                path.classList.add("hover-away");
            }, delay * 1000);
        });
    });

    hero.addEventListener("mouseleave", () => {
        crayonPaths.forEach((path, index) => {
            const delay = index * 0.03;
            setTimeout(() => {
                path.style.setProperty("--mouse-x", "0px");
                path.style.setProperty("--mouse-y", "0px");
                path.classList.remove("hover-away");
            }, delay * 1000);
        });
    });
}

function initSkillsCrayonDrawing() {
    // Support both Spanish and English versions
    const skillsSection = qs('#habilidades') || qs('#skills');
    const crayonSvg = qs('.skills-crayon-svg');
    
    if (!skillsSection || !crayonSvg) return;

    let currentPath = null;
    let pathPoints = [];
    let pathId = 0;
    let isDrawing = false;
    let lastMousePos = { x: 0, y: 0 };
    let drawingTimer = null;
    let allPaths = []; // Track all paths for canvas simulation
    let maxPaths = 8; // Maximum number of visible paths

    // Blue crayon colors with different tones (matching hero section)
    const crayonColors = [
        '#5ad2ff', '#2e73ff', '#7bb3ff', '#4a9eff', 
        '#6ba6ff', '#3d8bff', '#8bc5ff', '#1e5fff'
    ];

    const crayonClasses = [
        'crayon-1', 'crayon-2', 'crayon-3', 'crayon-4',
        'crayon-5', 'crayon-6', 'crayon-7', 'crayon-8'
    ];

    function getRandomColor() {
        return crayonColors[Math.floor(Math.random() * crayonColors.length)];
    }

    function getRandomCrayonClass() {
        return crayonClasses[Math.floor(Math.random() * crayonClasses.length)];
    }

    function createSwimmingCrayonPath(startX, startY) {
        pathId++;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const crayonClass = getRandomCrayonClass();
        path.setAttribute('class', `skills-crayon-path ${crayonClass} swimming-path`);
        path.setAttribute('stroke', getRandomColor());
        path.setAttribute('stroke-width', Math.random() * 1.2 + 1.5); // Slightly thicker for visibility
        path.setAttribute('id', `crayon-path-${pathId}`);
        path.setAttribute('opacity', Math.random() * 0.15 + 0.3); // More visible
        
        // Create organic swimming path like a fish - expanded for larger canvas
        const swimLength = 300 + Math.random() * 500; // Longer paths for bigger canvas
        const swimDirection = Math.random() * Math.PI * 2; // Initial direction
        const waveAmplitude = 40 + Math.random() * 70; // Bigger waves for larger space
        const waveFrequency = 0.02 + Math.random() * 0.03; // Wave frequency
        
        // Generate organic swimming path with multiple control points
        const pathPoints = [];
        const numPoints = 8; // Number of curve points
        
        for (let i = 0; i <= numPoints; i++) {
            const progress = i / numPoints;
            
            // Base movement along the swimming direction
            const baseX = startX + Math.cos(swimDirection) * swimLength * progress;
            const baseY = startY + Math.sin(swimDirection) * swimLength * progress;
            
            // Add organic wave movement (like fish swimming)
            const waveOffset = Math.sin(progress * Math.PI * 4 + Math.random() * Math.PI) * waveAmplitude * (1 - progress * 0.3);
            const perpX = -Math.sin(swimDirection) * waveOffset;
            const perpY = Math.cos(swimDirection) * waveOffset;
            
            const finalX = Math.max(30, Math.min(1170, baseX + perpX));
            const finalY = Math.max(30, Math.min(770, baseY + perpY));
            
            if (i === 0) {
                pathPoints.push(`M${finalX},${finalY}`);
            } else {
                // Use smooth curves between points
                const prevProgress = (i - 1) / numPoints;
                const controlOffset = 20 + Math.random() * 30;
                
                if (i === 1) {
                    pathPoints.push(`Q${finalX + controlOffset},${finalY} ${finalX},${finalY}`);
                } else {
                    pathPoints.push(`T${finalX},${finalY}`);
                }
            }
        }
        
        const pathData = pathPoints.join(' ');
        path.setAttribute('d', pathData);
        
        // Add unique animation duration and delay
        const animationDuration = 3 + Math.random() * 4; // 3-7 seconds
        const animationDelay = Math.random() * 2; // 0-2 seconds delay
        
        path.style.setProperty('--swim-duration', `${animationDuration}s`);
        path.style.setProperty('--swim-delay', `${animationDelay}s`);
        
        crayonSvg.appendChild(path);
        
        // Add to paths array for canvas management
        allPaths.push({
            element: path,
            id: pathId,
            timestamp: Date.now(),
            isActive: true,
            animationDuration: animationDuration * 1000 + animationDelay * 1000 // Total time in ms
        });
        
        return path;
    }

    function manageCanvasPaths() {
        // Clean up old paths more efficiently
        allPaths = allPaths.filter((pathObj, index) => {
            if (!pathObj.element || !pathObj.element.parentNode) {
                return false; // Remove from array
            }
            
            const age = Date.now() - pathObj.timestamp;
            
            // Mark non-current active paths as fading
            if (pathObj.isActive && pathObj.element !== currentPath) {
                pathObj.isActive = false;
                pathObj.element.classList.remove('drawing', 'active');
                pathObj.element.classList.add('fading');
                
                // Schedule removal after fade
                setTimeout(() => {
                    if (pathObj.element && pathObj.element.parentNode) {
                        pathObj.element.parentNode.removeChild(pathObj.element);
                    }
                }, 500); // 0.5 seconds fade time
                
                return false; // Remove from array
            }
            
            // Remove very old paths immediately
            if (age > 2000) { // 2 seconds max age
                if (pathObj.element && pathObj.element.parentNode) {
                    pathObj.element.parentNode.removeChild(pathObj.element);
                }
                return false; // Remove from array
            }
            
            return true; // Keep in array
        });
        
        // Limit number of paths more aggressively
        if (allPaths.length > maxPaths) {
            const excessPaths = allPaths.splice(0, allPaths.length - maxPaths);
            excessPaths.forEach(pathObj => {
                if (pathObj.element && pathObj.element.parentNode) {
                    pathObj.element.parentNode.removeChild(pathObj.element);
                }
            });
        }
    }

    // Remove updatePath function as we'll use prediction instead

    function startSwimmingPath(e) {
        // Manage existing paths before creating new one
        manageCanvasPaths();
        
        // Use skills section rect instead of SVG rect for better positioning
        const sectionRect = skillsSection.getBoundingClientRect();
        
        // Convert screen coordinates to SVG coordinates (entry point)
        const startX = ((e.clientX - sectionRect.left) / sectionRect.width) * 1200;
        const startY = ((e.clientY - sectionRect.top) / sectionRect.height) * 800;
        
        // Create swimming fish-like path
        const swimmingPath = createSwimmingCrayonPath(startX, startY);
        swimmingPath.classList.add('swimming');
        
        // Schedule automatic cleanup based on animation duration
        const pathObj = allPaths.find(p => p.element === swimmingPath);
        if (pathObj) {
            setTimeout(() => {
                if (swimmingPath && swimmingPath.parentNode) {
                    swimmingPath.classList.add('fading');
                    setTimeout(() => {
                        if (swimmingPath && swimmingPath.parentNode) {
                            swimmingPath.parentNode.removeChild(swimmingPath);
                        }
                    }, 500);
                }
            }, pathObj.animationDuration);
        }
    }

    // Simplified trigger function
    function triggerSwimming(e) {
        startSwimmingPath(e);
    }

    // Event listeners for fish-like swimming paths
    let lastSwimTime = 0;
    
    // Trigger swimming paths on mouse movement with throttling
    skillsSection.addEventListener('mousemove', (e) => {
        const now = Date.now();
        
        // Only create new swimming paths every 800ms for elegant effect
        if (now - lastSwimTime < 800) return;
        
        triggerSwimming(e);
        lastSwimTime = now;
    });
    
    // Also trigger on mouse enter
    skillsSection.addEventListener('mouseenter', (e) => {
        triggerSwimming(e);
        lastSwimTime = Date.now();
    });
    
    // Trigger on skill item hover for interactive feel
    const skillItems = skillsSection.querySelectorAll('.skills li');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const now = Date.now();
            if (now - lastSwimTime > 400) { // Shorter delay for direct item interaction
                triggerSwimming(e);
                lastSwimTime = now;
            }
        });
    });

    // Removed burst effects to avoid conflicts with main crayon drawing
}

// Visitor Analytics (CountAPI + Geo)
const VISITOR_CONFIG = (typeof API_CONFIG !== 'undefined' && API_CONFIG.VISITORS) ? API_CONFIG.VISITORS : {
    COUNT_BASE_URL: 'https://api.countapi.xyz',
    NAMESPACE: 'julian-portfolio-tron',
    GEO_URL: 'https://ipapi.co/json/'
};

const VISITOR_POPULAR_COUNTRIES = [
    'US', 'CO', 'MX', 'ES', 'AR', 'CL', 'PE', 'BR', 'GB', 'DE',
    'FR', 'IT', 'CA', 'AU', 'JP', 'KR', 'IN', 'NL', 'SE', 'CH'
];

const VISITOR_COUNTRY_DATA = {
    US: { es: 'Estados Unidos', en: 'United States', lat: 39.5, lon: -98.35 },
    CO: { es: 'Colombia', en: 'Colombia', lat: 4.57, lon: -74.3 },
    MX: { es: 'México', en: 'Mexico', lat: 23.63, lon: -102.55 },
    ES: { es: 'España', en: 'Spain', lat: 40.42, lon: -3.7 },
    AR: { es: 'Argentina', en: 'Argentina', lat: -34.6, lon: -58.38 },
    CL: { es: 'Chile', en: 'Chile', lat: -33.45, lon: -70.67 },
    PE: { es: 'Perú', en: 'Peru', lat: -12.05, lon: -77.04 },
    BR: { es: 'Brasil', en: 'Brazil', lat: -15.79, lon: -47.88 },
    GB: { es: 'Reino Unido', en: 'United Kingdom', lat: 51.5, lon: -0.12 },
    DE: { es: 'Alemania', en: 'Germany', lat: 52.52, lon: 13.4 },
    FR: { es: 'Francia', en: 'France', lat: 48.85, lon: 2.35 },
    IT: { es: 'Italia', en: 'Italy', lat: 41.9, lon: 12.5 },
    CA: { es: 'Canadá', en: 'Canada', lat: 45.4, lon: -75.7 },
    AU: { es: 'Australia', en: 'Australia', lat: -35.3, lon: 149.1 },
    JP: { es: 'Japón', en: 'Japan', lat: 35.68, lon: 139.7 },
    KR: { es: 'Corea del Sur', en: 'South Korea', lat: 37.57, lon: 126.98 },
    IN: { es: 'India', en: 'India', lat: 28.6, lon: 77.2 },
    NL: { es: 'Países Bajos', en: 'Netherlands', lat: 52.37, lon: 4.9 },
    SE: { es: 'Suecia', en: 'Sweden', lat: 59.33, lon: 18.07 },
    CH: { es: 'Suiza', en: 'Switzerland', lat: 46.95, lon: 7.44 }
};

let visitorMapProjection = null;
let visitorMapReady = false;

function getVisitorLocale() {
    return document.documentElement.lang === 'en' ? 'en-US' : 'es-CO';
}

function getCountryLabel(code, fallbackName) {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
    if (!code) return fallbackName || (lang === 'en' ? 'Unknown location' : 'Ubicación desconocida');
    const data = VISITOR_COUNTRY_DATA[code];
    if (data) return data[lang] || fallbackName || code;
    return fallbackName || code;
}

function formatVisitorNumber(value) {
    const locale = getVisitorLocale();
    return new Intl.NumberFormat(locale).format(value || 0);
}

function latLonToXY(lat, lon, width, height) {
    if (visitorMapProjection) {
        const point = visitorMapProjection([lon, lat]);
        if (point) return { x: point[0], y: point[1] };
    }
    const x = ((lon + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
}

async function initWorldMap() {
    if (visitorMapReady) return;
    const svg = qs('#visitor-map-svg');
    const landGroup = qs('#map-land');
    const graticuleGroup = qs('#map-graticule');
    if (!svg || !landGroup || !graticuleGroup) return;
    if (!window.d3 || !window.topojson) return;

    try {
        const res = await fetch('https://unpkg.com/world-atlas@2/land-110m.json');
        if (!res.ok) throw new Error('World map unavailable');
        const world = await res.json();
        const land = window.topojson.feature(world, world.objects.land);

        const width = 900;
        const height = 450;
        visitorMapProjection = window.d3.geoNaturalEarth1().fitSize([width, height], land);
        const path = window.d3.geoPath(visitorMapProjection);
        const graticule = window.d3.geoGraticule10();

        const landSelection = window.d3.select(landGroup)
            .selectAll('path')
            .data(land.features)
            .join('path')
            .attr('d', path);

        window.d3.select(graticuleGroup)
            .selectAll('path')
            .data([graticule])
            .join('path')
            .attr('d', path);

        visitorMapReady = true;
        return landSelection;
    } catch (error) {
        console.warn('Map render failed:', error);
    }
}

async function fetchGeoData() {
    try {
        const res = await fetch(VISITOR_CONFIG.GEO_URL, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error('Geo unavailable');
        return await res.json();
    } catch (error) {
        console.warn('Geo lookup failed:', error);
        return null;
    }
}

async function hitCounter(key) {
    try {
        const res = await fetch(`${VISITOR_CONFIG.COUNT_BASE_URL}/hit/${VISITOR_CONFIG.NAMESPACE}/${key}`);
        if (!res.ok) throw new Error('CountAPI hit failed');
        const data = await res.json();
        return data?.value ?? 0;
    } catch (error) {
        console.warn('CountAPI hit failed:', error);
        return 0;
    }
}

async function getCounter(key) {
    try {
        const res = await fetch(`${VISITOR_CONFIG.COUNT_BASE_URL}/get/${VISITOR_CONFIG.NAMESPACE}/${key}`);
        if (!res.ok) return 0;
        const data = await res.json();
        return data?.value ?? 0;
    } catch (error) {
        console.warn('CountAPI get failed:', error);
        return 0;
    }
}

function renderCountryList(countries) {
    const listEl = qs('#visitor-country-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    if (!countries.length) {
        const empty = document.createElement('li');
        empty.className = 'country-item';
        empty.textContent = document.documentElement.lang === 'en'
            ? 'No country data yet. Be the first visitor!'
            : 'Aún no hay datos por país. ¡Sé el primer visitante!';
        listEl.appendChild(empty);
        return;
    }

    const maxCount = Math.max(...countries.map(c => c.count));
    countries.forEach(country => {
        const item = document.createElement('li');
        item.className = 'country-item';

        if (country.code) {
            const flag = document.createElement('img');
            flag.className = 'country-flag';
            flag.loading = 'lazy';
            flag.alt = country.name;
            flag.src = `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`;
            item.appendChild(flag);
        }

        const name = document.createElement('span');
        name.className = 'country-name';
        name.textContent = country.name;

        const count = document.createElement('span');
        count.className = 'country-count';
        count.textContent = formatVisitorNumber(country.count);

        const bar = document.createElement('div');
        bar.className = 'country-bar';
        const barFill = document.createElement('span');
        const ratio = maxCount ? country.count / maxCount : 0;
        barFill.style.width = `${Math.max(8, Math.round(ratio * 100))}%`;
        bar.appendChild(barFill);

        item.append(name, count, bar);
        listEl.appendChild(item);
    });
}

function renderMapMarkers(countries, currentLocation) {
    const svg = qs('#visitor-map-svg');
    const markerGroup = qs('#map-markers');
    if (!svg || !markerGroup) return;
    markerGroup.innerHTML = '';

    const width = 900;
    const height = 450;
    const maxCount = Math.max(1, ...countries.map(c => c.count));

    countries.forEach(country => {
        if (typeof country.lat !== 'number' || typeof country.lon !== 'number') return;
        const { x, y } = latLonToXY(country.lat, country.lon, width, height);
        const radius = 3 + (country.count / maxCount) * 4;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'map-dot');
        circle.setAttribute('cx', x.toFixed(2));
        circle.setAttribute('cy', y.toFixed(2));
        circle.setAttribute('r', radius.toFixed(2));
        markerGroup.appendChild(circle);
    });

    if (currentLocation && typeof currentLocation.lat === 'number' && typeof currentLocation.lon === 'number') {
        const { x, y } = latLonToXY(currentLocation.lat, currentLocation.lon, width, height);
        const crosshair = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        crosshair.setAttribute('class', 'map-crosshair');
        crosshair.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);

        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('r', '8');

        const inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        inner.setAttribute('r', '3');

        const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hLine.setAttribute('x1', '-14');
        hLine.setAttribute('y1', '0');
        hLine.setAttribute('x2', '-6');
        hLine.setAttribute('y2', '0');

        const hLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hLine2.setAttribute('x1', '6');
        hLine2.setAttribute('y1', '0');
        hLine2.setAttribute('x2', '14');
        hLine2.setAttribute('y2', '0');

        const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vLine.setAttribute('x1', '0');
        vLine.setAttribute('y1', '-14');
        vLine.setAttribute('x2', '0');
        vLine.setAttribute('y2', '-6');

        const vLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        vLine2.setAttribute('x1', '0');
        vLine2.setAttribute('y1', '6');
        vLine2.setAttribute('x2', '0');
        vLine2.setAttribute('y2', '14');

        crosshair.append(ring, inner, hLine, hLine2, vLine, vLine2);
        markerGroup.appendChild(crosshair);
    }
}

async function initVisitorAnalytics() {
    const totalEl = qs('[data-visitor-total]');
    const countryEl = qs('[data-visitor-country]');
    const updatedEl = qs('[data-visitor-updated]');
    const flagEl = qs('[data-visitor-flag]');
    if (!totalEl || !countryEl || !updatedEl) return;

    await initWorldMap();
    const geo = await fetchGeoData();
    const countryCode = geo?.country_code ? geo.country_code.toUpperCase() : null;
    const countryName = getCountryLabel(countryCode, geo?.country_name);

    const sessionKey = 'visitor-analytics-counted';
    const shouldCount = !sessionStorage.getItem(sessionKey);

    const totalCount = shouldCount ? await hitCounter('total') : await getCounter('total');
    const countryKey = countryCode ? `country-${countryCode}` : null;
    const countryCount = countryKey ? (shouldCount ? await hitCounter(countryKey) : await getCounter(countryKey)) : 0;

    if (shouldCount) sessionStorage.setItem(sessionKey, 'true');

    totalEl.textContent = formatVisitorNumber(totalCount);
    if (countryCode) {
        countryEl.textContent = `${countryName} · ${formatVisitorNumber(countryCount)}`;
        if (flagEl) {
            flagEl.src = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
            flagEl.style.display = 'inline-block';
        }
    } else {
        countryEl.textContent = countryName;
        if (flagEl) {
            flagEl.style.display = 'none';
        }
    }

    updatedEl.textContent = new Date().toLocaleTimeString(getVisitorLocale(), { hour: '2-digit', minute: '2-digit' });

    const candidates = new Set(VISITOR_POPULAR_COUNTRIES);
    if (countryCode) candidates.add(countryCode);
    const results = await Promise.all(Array.from(candidates).map(async (code) => {
        const value = code === countryCode && countryCount ? countryCount : await getCounter(`country-${code}`);
        const data = VISITOR_COUNTRY_DATA[code];
        return {
            code,
            count: value || 0,
            name: getCountryLabel(code),
            lat: data?.lat,
            lon: data?.lon
        };
    }));

    const topCountries = results.filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

    renderCountryList(topCountries);
    renderMapMarkers(topCountries, geo ? { lat: geo.latitude, lon: geo.longitude } : null);
}


// Citas Históricas Colombianas API Integration
// Using centralized API configuration
const CITAS_API_BASE_URL = API_CONFIG.BASE_URL;

let citasTimer = null;
let citasCountdown = 30;
let currentCita = null;

const citasElements = {
    quote: null,
    author: null,
    authorName: null,
    authorEra: null,
    refreshBtn: null,
    timerProgress: null,
    timerText: null
};

// Base de datos local de citas como fallback
const citasDatabase = [
    {
        autor: "Jorge Eliécer Gaitán",
        cita: "¡Yo no soy un hombre, soy un pueblo!",
        epoca: "Siglo XX (1903-1948)"
    },
    {
        autor: "Policarpa Salavarrieta",
        cita: "¡Pueblo indolente! ¡Cuán distinta sería hoy vuestra suerte si conocierais el precio de la libertad!",
        epoca: "Siglo XIX (1795-1817)"
    },
    {
        autor: "Antonio Nariño",
        cita: "¡No hay que esperar recompensa por servir a la patria!",
        epoca: "Siglo XVIII-XIX (1765-1823)"
    },
    {
        autor: "Antonio Ricaurte",
        cita: "¡Que el fuego me siga a mí, sálvense ustedes y la patria!",
        epoca: "Siglo XIX (1786-1814)"
    },
    {
        autor: "Alexander von Humboldt",
        cita: "El conocimiento es la riqueza que se puede transmitir sin empobrecerse.",
        epoca: "Siglo XVIII-XIX (1769-1859)"
    },
    {
        autor: "Antonio José de Sucre",
        cita: "Los soldados de la libertad no asesinan.",
        epoca: "Siglo XIX (1795-1830)"
    },
    {
        autor: "José Celestino Mutis",
        cita: "El estudio de la naturaleza es el templo donde se rinde culto a la divinidad.",
        epoca: "Siglo XVIII-XIX (1732-1808)"
    },
    {
        autor: "Gustavo Rojas Pinilla",
        cita: "Ni sangre ni fuerza: corazón y amor.",
        epoca: "Siglo XX (1900-1975)"
    }
];

async function fetchRandomCita() {
    try {
        const response = await fetch(`${CITAS_API_BASE_URL}${API_CONFIG.ENDPOINTS.CITAS_COLOMBIANAS}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();
        return {
            autor: data.autor,
            cita: data.cita,
            epoca: data.origen || "Fuente histórica"
        };
    } catch (error) {
        console.log('API no disponible, usando base de datos local:', error.message);
        // Usar base de datos local como fallback
        const randomIndex = Math.floor(Math.random() * citasDatabase.length);
        return citasDatabase[randomIndex];
    }
}

function updateCitaDisplay(cita) {
    if (!citasElements.quote || !citasElements.authorName || !citasElements.authorEra) return;
    
    // Animación de fade out
    citasElements.quote.style.opacity = '0';
    citasElements.authorName.style.opacity = '0';
    citasElements.authorEra.style.opacity = '0';
    
    setTimeout(() => {
        // Actualizar contenido
        citasElements.quote.textContent = cita.cita;
        citasElements.authorName.textContent = cita.autor;
        citasElements.authorEra.textContent = cita.epoca;
        
        // Remover clase de loading
        citasElements.quote.classList.remove('loading');
        
        // Animación de fade in
        citasElements.quote.style.opacity = '1';
        citasElements.authorName.style.opacity = '1';
        citasElements.authorEra.style.opacity = '1';
        
        currentCita = cita;
    }, 300);
}

function startCitasTimer() {
    citasCountdown = 30;
    updateTimerDisplay();
    
    citasTimer = setInterval(() => {
        citasCountdown--;
        updateTimerDisplay();
        
        if (citasCountdown <= 0) {
            loadNewCita();
            citasCountdown = 30;
        }
    }, 1000);
}

function updateTimerDisplay() {
    if (!citasElements.timerProgress || !citasElements.timerText) return;
    
    const progress = (citasCountdown / 30) * 100;
    const circumference = 2 * Math.PI * 15.9155; // radius = 15.9155
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    citasElements.timerProgress.style.strokeDashoffset = strokeDashoffset;
    citasElements.timerText.textContent = `${citasCountdown}s`;
}

async function loadNewCita() {
    if (!citasElements.quote) return;
    
    // Mostrar loading
    citasElements.quote.classList.add('loading');
    citasElements.quote.textContent = "Cargando nueva cita...";
    
    try {
        const cita = await fetchRandomCita();
        updateCitaDisplay(cita);
    } catch (error) {
        console.error('Error loading cita:', error);
        citasElements.quote.classList.remove('loading');
        citasElements.quote.textContent = "Error al cargar la cita. Intenta de nuevo.";
    }
}

function initCitasHistoricas() {
    // Obtener elementos
    citasElements.quote = qs('#citas-quote');
    citasElements.author = qs('#citas-author');
    citasElements.authorName = qs('.author-name');
    citasElements.authorEra = qs('.author-era');
    citasElements.refreshBtn = qs('#refresh-cita');
    citasElements.timerProgress = qs('.timer-progress');
    citasElements.timerText = qs('.timer-text');
    
    if (!citasElements.quote || !citasElements.refreshBtn) return;
    
    // Event listener para botón de refresh
    citasElements.refreshBtn.addEventListener('click', () => {
        loadNewCita();
        citasCountdown = 30; // Reset timer
        updateTimerDisplay();
    });
    
    // Cargar primera cita
    loadNewCita();
    
    // Iniciar timer
    startCitasTimer();
}

// International Authors Functionality
let authorsElements = {};
let authorsTimer = null;
let authorsCountdown = 30;
let currentAuthor = null;
let currentCategory = null;

// Base de datos local de autores internacionales como fallback
const authorsDatabase = [
    {
        cita: "I'm not saying I'm gonna change the world, but I guarantee that I will spark the brain that will change the world.",
        autor: "Tupac Shakur (2Pac)",
        epoca: "20th Century (1971-1996)",
        categoria: "philosophy"
    },
    {
        cita: "Somewhere, something incredible is waiting to be known.",
        autor: "Carl Sagan",
        epoca: "20th Century (1934-1996)",
        categoria: "science"
    },
    {
        cita: "Talk is cheap. Show me the code.",
        autor: "Linus Torvalds",
        epoca: "20th-21st Century (1969-present)",
        categoria: "technology"
    },
    {
        cita: "Life is not a dress rehearsal. Get on with it.",
        autor: "Ridley Scott",
        epoca: "20th-21st Century (1937-present)",
        categoria: "entertainment"
    },
    {
        cita: "The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom.",
        autor: "Isaac Asimov",
        epoca: "20th Century (1920-1992)",
        categoria: "science"
    }
];

async function fetchRandomAuthor() {
    try {
        // Intentar obtener desde la API
        const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.AUTORES_INTERNACIONALES;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('API no disponible');
        
        const data = await response.json();
        return {
            cita: data.cita,
            autor: data.autor,
            epoca: data.origen || "Historical Source"
        };
    } catch (error) {
        console.log('API no disponible, usando base de datos local:', error.message);
        // Usar base de datos local como fallback
        const randomIndex = Math.floor(Math.random() * authorsDatabase.length);
        return authorsDatabase[randomIndex];
    }
}

function updateAuthorDisplay(author) {
    if (!authorsElements.quote || !authorsElements.authorName || !authorsElements.authorEra) return;
    
    // Animación de fade out
    authorsElements.quote.style.opacity = '0';
    authorsElements.authorName.style.opacity = '0';
    authorsElements.authorEra.style.opacity = '0';
    
    setTimeout(() => {
        // Actualizar contenido
        authorsElements.quote.textContent = author.cita;
        authorsElements.authorName.textContent = author.autor;
        authorsElements.authorEra.textContent = author.epoca;
        
        // Remover clase de loading
        authorsElements.quote.classList.remove('loading');
        
        // Animación de fade in
        authorsElements.quote.style.opacity = '1';
        authorsElements.authorName.style.opacity = '1';
        authorsElements.authorEra.style.opacity = '1';
        
        currentAuthor = author;
    }, 300);
}

function startAuthorsTimer() {
    authorsCountdown = 30;
    updateAuthorsTimerDisplay();
    
    if (authorsTimer) {
        clearInterval(authorsTimer);
    }
    
    authorsTimer = setInterval(() => {
        authorsCountdown--;
        updateAuthorsTimerDisplay();
        
        if (authorsCountdown <= 0) {
            loadNewAuthor();
            authorsCountdown = 30;
        }
    }, 1000);
}

function updateAuthorsTimerDisplay() {
    if (!authorsElements.timerProgress || !authorsElements.timerText) return;
    
    const progress = (authorsCountdown / 30) * 100;
    const circumference = 2 * Math.PI * 15.9155; // radius = 15.9155
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    authorsElements.timerProgress.style.strokeDashoffset = strokeDashoffset;
    authorsElements.timerText.textContent = `${authorsCountdown}s`;
}

async function loadNewAuthor() {
    if (!authorsElements.quote) return;
    
    // Mostrar loading
    authorsElements.quote.classList.add('loading');
    authorsElements.quote.textContent = "Loading new quote...";
    
    try {
        const author = await fetchRandomAuthor();
        updateAuthorDisplay(author);
    } catch (error) {
        console.error('Error loading author:', error);
        authorsElements.quote.classList.remove('loading');
        authorsElements.quote.textContent = "Error loading quote. Please try again.";
    }
}

function filterByCategory(categoria) {
    // Función deshabilitada para diseño simplificado
    console.log('Category filtering disabled in simplified design');
}

// Hacer la función disponible globalmente para el HTML
window.filterByCategory = filterByCategory;

function initInternationalAuthors() {
    // Obtener elementos
    authorsElements.quote = qs('#authors-quote');
    authorsElements.author = qs('#authors-author');
    authorsElements.authorName = qs('#authors-author .author-name');
    authorsElements.authorEra = qs('#authors-author .author-era');
    authorsElements.refreshBtn = qs('#refresh-author');
    authorsElements.timerProgress = qs('.authors-timer .timer-progress');
    authorsElements.timerText = qs('.authors-timer .timer-text');
    
    if (!authorsElements.quote || !authorsElements.refreshBtn) return;
    
    // Event listener para botón de refresh
    authorsElements.refreshBtn.addEventListener('click', () => {
        loadNewAuthor();
        authorsCountdown = 30; // Reset timer
        updateAuthorsTimerDisplay();
    });
    
    // Cargar primera cita
    loadNewAuthor();
    
    // Iniciar timer
    startAuthorsTimer();
}

// Language Switching Functionality
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if button is disabled (current language)
            if (btn.disabled) {
                return; // Do nothing if clicking on current language
            }
            
            const targetLang = btn.dataset.lang;
            switchLanguage(targetLang);
        });
    });
}

function switchLanguage(targetLang) {
    // Start snake pixel transition effect
    startSnakeTransition(targetLang);
}

// Snake pixel transition effect
function startSnakeTransition(targetLang) {
    const overlay = document.querySelector('.language-transition-overlay');
    const canvas = document.querySelector('.snake-canvas');
    
    // Show overlay
    overlay.classList.add('active');
    
    // Start snake animation
    startSnakeAnimation(canvas, () => {
        // Navigate to new page after animation
        navigateToLanguage(targetLang);
    });
}

function startSnakeAnimation(canvas, callback) {
    const ctx = canvas.getContext('2d');
    const pixelSize = 12;
    const cols = Math.floor(canvas.width / pixelSize);
    const rows = Math.floor(canvas.height / pixelSize);
    
    // Snake colors (inspirado en el tema del portfolio)
    const colors = ['#2e73ff', '#5ad2ff', '#4a9eff', '#7bb3ff'];
    
    // Create multiple snakes
    const snakes = [];
    const numSnakes = 8;
    
    // Initialize snakes
    for (let i = 0; i < numSnakes; i++) {
        snakes.push({
            body: [{
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows)
            }],
            direction: {
                x: Math.random() > 0.5 ? 1 : -1,
                y: Math.random() > 0.5 ? 1 : -1
            },
            color: colors[i % colors.length],
            length: Math.floor(Math.random() * 15) + 10,
            speed: Math.random() * 2 + 1
        });
    }
    
    let animationFrame = 0;
    let pixels = new Set();
    
    function animate() {
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(10, 15, 26, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw each snake
        snakes.forEach((snake, index) => {
            if (animationFrame % Math.floor(snake.speed) === 0) {
                // Move snake head
                const head = snake.body[0];
                const newHead = {
                    x: head.x + snake.direction.x,
                    y: head.y + snake.direction.y
                };
                
                // Bounce off walls
                if (newHead.x < 0 || newHead.x >= cols) {
                    snake.direction.x *= -1;
                    newHead.x = head.x + snake.direction.x;
                }
                if (newHead.y < 0 || newHead.y >= rows) {
                    snake.direction.y *= -1;
                    newHead.y = head.y + snake.direction.y;
                }
                
                // Randomly change direction occasionally
                if (Math.random() < 0.05) {
                    snake.direction.x = Math.random() > 0.5 ? 1 : -1;
                    snake.direction.y = Math.random() > 0.5 ? 1 : -1;
                }
                
                // Add new head
                snake.body.unshift(newHead);
                
                // Add to pixels set
                pixels.add(`${newHead.x},${newHead.y}`);
                
                // Limit snake length
                if (snake.body.length > snake.length) {
                    snake.body.pop();
                }
            }
            
            // Draw snake
            snake.body.forEach((segment, segIndex) => {
                const alpha = 1 - (segIndex / snake.body.length) * 0.7;
                ctx.fillStyle = snake.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                
                // Add glow effect
                ctx.shadowColor = snake.color;
                ctx.shadowBlur = 8;
                
                ctx.fillRect(
                    segment.x * pixelSize + 1,
                    segment.y * pixelSize + 1,
                    pixelSize - 2,
                    pixelSize - 2
                );
                
                ctx.shadowBlur = 0;
            });
        });
        
        animationFrame++;
        
        // Continue animation for a set duration
        if (animationFrame < 180) { // ~3 seconds at 60fps
            requestAnimationFrame(animate);
        } else {
            // Fade out effect
            let fadeFrame = 0;
            function fadeOut() {
                ctx.fillStyle = `rgba(10, 15, 26, ${0.1 + fadeFrame * 0.05})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                fadeFrame++;
                if (fadeFrame < 20) {
                    requestAnimationFrame(fadeOut);
                } else {
                    callback();
                }
            }
            fadeOut();
        }
    }
    
    animate();
}

// Update navigation function to include transition parameter

function animatePixelsOut(container, callback) {
    const pixels = container.querySelectorAll('.pixel');
    
    pixels.forEach((pixel, index) => {
        // Faster stagger animation
        setTimeout(() => {
            pixel.classList.add('animate-out');
        }, Math.random() * 100);
    });
    
    // Reduced wait time for faster transition
    setTimeout(callback, 400);
}

// Initialize page transition effect on load
function initPageTransition() {
    const overlay = document.querySelector('.language-transition-overlay');
    const canvas = document.querySelector('.snake-canvas');
    
    // Only run transition if coming from language change
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('transition') === 'true') {
        // Show initial state
        overlay.classList.add('active');
        
        // Animate snake transition in
        setTimeout(() => {
            animateSnakeTransitionIn(canvas, () => {
                // Hide overlay after animation
                setTimeout(() => {
                    overlay.classList.remove('active');
                    
                    // Clean URL
                    const cleanUrl = window.location.href.split('?')[0].split('#')[0];
                    window.history.replaceState({}, document.title, cleanUrl + window.location.hash);
                }, 150);
            });
        }, 50);
    }
}

function animateSnakeTransitionIn(canvas, callback) {
    const ctx = canvas.getContext('2d');
    const pixelSize = 12;
    const cols = Math.floor(canvas.width / pixelSize);
    const rows = Math.floor(canvas.height / pixelSize);
    
    // Snake colors (fade in effect)
    const colors = ['#2e73ff', '#5ad2ff', '#4a9eff', '#7bb3ff'];
    
    // Create snakes starting from center
    const snakes = [];
    const numSnakes = 6;
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);
    
    // Initialize snakes from center
    for (let i = 0; i < numSnakes; i++) {
        const angle = (i / numSnakes) * Math.PI * 2;
        snakes.push({
            body: [{ x: centerX, y: centerY }],
            direction: {
                x: Math.cos(angle),
                y: Math.sin(angle)
            },
            color: colors[i % colors.length],
            length: 8,
            speed: 1.5
        });
    }
    
    let animationFrame = 0;
    
    function animate() {
        // Clear canvas
        ctx.fillStyle = 'rgba(10, 15, 26, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw each snake
        snakes.forEach((snake, index) => {
            if (animationFrame % Math.floor(snake.speed) === 0) {
                // Move snake head outward from center
                const head = snake.body[0];
                const newHead = {
                    x: Math.round(head.x + snake.direction.x),
                    y: Math.round(head.y + snake.direction.y)
                };
                
                // Keep snakes on screen
                if (newHead.x >= 0 && newHead.x < cols && newHead.y >= 0 && newHead.y < rows) {
                    snake.body.unshift(newHead);
                    
                    // Limit snake length
                    if (snake.body.length > snake.length) {
                        snake.body.pop();
                    }
                }
            }
            
            // Draw snake with fade effect
            snake.body.forEach((segment, segIndex) => {
                const alpha = (1 - (segIndex / snake.body.length) * 0.5) * (1 - animationFrame / 100);
                if (alpha > 0) {
                    ctx.fillStyle = snake.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                    
                    // Add glow effect
                    ctx.shadowColor = snake.color;
                    ctx.shadowBlur = 6;
                    
                    ctx.fillRect(
                        segment.x * pixelSize + 1,
                        segment.y * pixelSize + 1,
                        pixelSize - 2,
                        pixelSize - 2
                    );
                    
                    ctx.shadowBlur = 0;
                }
            });
        });
        
        animationFrame++;
        
        // Continue animation for a shorter duration (fade in)
        if (animationFrame < 80) {
            requestAnimationFrame(animate);
        } else {
            // Clear canvas and callback
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            callback();
        }
    }
    
    animate();
}

function animatePixelsIn(container, callback) {
    const pixels = container.querySelectorAll('.pixel');
    
    // Set initial state
    pixels.forEach(pixel => {
        pixel.classList.add('animate-out');
        pixel.style.transitionDelay = '0s';
    });
    
    // Faster animate in with reduced stagger
    setTimeout(() => {
        pixels.forEach((pixel, index) => {
            setTimeout(() => {
                pixel.classList.remove('animate-out');
                pixel.classList.add('animate-in');
            }, Math.random() * 150);
        });
    }, 30);
    
    // Reduced wait time
    setTimeout(callback, 300);
}

// Update navigation function to include transition parameter
function navigateToLanguage(targetLang) {
    const currentPage = window.location.pathname;
    let targetPage;
    
    if (targetLang === 'en') {
        // Switch to English
        if (currentPage.includes('index-en.html') || currentPage.endsWith('/')) {
            targetPage = 'index-en.html';
        } else {
            targetPage = 'index-en.html';
        }
    } else {
        // Switch to Spanish
        if (currentPage.includes('index-en.html')) {
            targetPage = 'index.html';
        } else {
            targetPage = 'index.html';
        }
    }
    
    // Preserve any query parameters and add transition flag
    const queryString = '?transition=true';
    const hash = window.location.hash;
    
    // Navigate to the target page
    window.location.href = targetPage + queryString + hash;
}

function updateActiveLanguageButton() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentPage = window.location.pathname;
    
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.disabled = false; // Re-enable all buttons first
        btn.style.cursor = 'pointer';
        btn.style.removeProperty('opacity'); // Remove inline opacity
        
        const btnLang = btn.dataset.lang;
        
        // Determine which button should be active based on current page
        if (btnLang === 'en' && currentPage.includes('index-en.html')) {
            btn.classList.add('active');
            btn.disabled = true; // Disable current language button
        } else if (btnLang === 'es' && !currentPage.includes('index-en.html')) {
            btn.classList.add('active');
            btn.disabled = true; // Disable current language button
        }
    });
}

function init() {
    els.year = qs("#year");
    els.navToggle = qs(".nav-toggle");
    els.menu = qs(".menu");
    els.usernameInput = qs("#github-username");
    els.userForm = qs("#github-user-form");
    els.reposGrid = qs("#repos");
    els.emptyState = qs("#repos-empty");
    els.languageFilter = qs("#language-filter");
    els.githubProfileLink = qs("#github-profile-link");
    els.githubProfileBtn = qs("#github-profile-btn");

    if (els.year) els.year.textContent = String(new Date().getFullYear());
    initNav();
    initForm();
    initCrayonHover();
    initSkillsCrayonDrawing();
    initVisitorAnalytics();
    initLanguageSwitcher();
    initPageTransition();
    updateActiveLanguageButton();

    const hashUser = new URLSearchParams(location.search).get("u");
    const startUser = hashUser || DEFAULT_GITHUB_USER;
    if (els.usernameInput) els.usernameInput.value = startUser;
    loadUser(startUser);
}


document.addEventListener("DOMContentLoaded", init);


