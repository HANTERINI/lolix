/**
 * Meme Generator Pro - Showcase Edition (Final Release)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Canvas & Core Elements ---
    const canvas = document.getElementById('memeCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    if (!canvas || !ctx) return;

    // --- State Variables ---
    let bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    let isImageLoaded = false;

    let layers = [];
    let activeLayerId = null;

    let drawings = [];
    let isDrawingMode = false;
    let isDrawing = false;
    let currentPath = [];

    let filters = {
        brightness: 100,
        contrast: 100,
        saturate: 100,
        sepia: 0,
        grayscale: 0
    };

    let brushSettings = {
        color: '#ff0055',
        size: 6
    };

    let zoomLevel = 1.0;
    // Drag & Resize Interaction States
    let isDragging = false;
    let isResizing = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let resizeStartSize = 48;
    let resizeStartDist = 1;
    // Touch Pointer Tracker for Pinch Gestures
    const activePointers = new Map();
    // Default Templates Catalog
    let fetchedMemes = typeof MEME_PRESETS !== 'undefined' ? [...MEME_PRESETS] : [];
    // --- Initialization ---
    init();

    async function init() {
        setupTabs();
        setupCategoryFilters();
        setupSearchFilter();
        renderStickersCatalog();
        setupEventListeners();
        
        renderTemplatesGrid(fetchedMemes);
        await loadImgflipMemes();
        
        if (fetchedMemes.length > 0) {
            selectTemplate(fetchedMemes[0]);
        }
    }
    // --- Tab Navigation ---
    function setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const content = document.getElementById('tab-' + targetTab);
                if (content) content.classList.add('active');
            });
        });
    }

    function setupCategoryFilters() {
        const catBtns = document.querySelectorAll('.cat-btn');
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-category');
                const searchInput = document.getElementById('templateSearch');
                filterTemplates(category, searchInput ? searchInput.value : '');
            });
        });
    }

    function setupSearchFilter() {
        const searchInput = document.getElementById('templateSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const activeCatBtn = document.querySelector('.cat-btn.active');
                const category = activeCatBtn ? activeCatBtn.getAttribute('data-category') : 'all';
                filterTemplates(category, e.target.value);
            });
        }
    }

    function filterTemplates(category, searchQuery = '') {
        const query = searchQuery.toLowerCase().trim();
        const filtered = fetchedMemes.filter(m => {
            const matchesCat = (category === 'all' || m.category === category);
            const matchesSearch = !query || m.name.toLowerCase().includes(query);
            return matchesCat && matchesSearch;
        });
        renderTemplatesGrid(filtered);
    }

    async function loadImgflipMemes() {
        try {
            const response = await fetch('https://api.imgflip.com/get_memes');
            const data = await response.json();
            if (data.success && data.data.memes) {
                const apiMemes = data.data.memes.slice(0, 80).map(m => {
                    const defaultText = typeof getMemeDefaultText === 'function' 
                        ? getMemeDefaultText(m.id, m.name) 
                        : ["ВЕРХНИЙ ТЕКСТ", "НИЖНИЙ ТЕКСТ"];
                    return {
                        id: m.id,
                        name: m.name,
                        url: m.url,
                        fallbackUrl: m.url,
                        width: m.width,
                        height: m.height,
                        box_count: m.box_count,
                        category: 'classic',
                        defaultText: defaultText
                    };
                });
                const existingIds = new Set(MEME_PRESETS.map(p => p.id));
                const uniqueApiMemes = apiMemes.filter(m => !existingIds.has(m.id));
                fetchedMemes = [...MEME_PRESETS, ...uniqueApiMemes];
                renderTemplatesGrid(fetchedMemes);
            }
        } catch (e) {
            console.warn('Imgflip API load fallback used', e);
        }
    }

    function renderTemplatesGrid(memes) {
        const grid = document.getElementById('templatesGrid');
        if (!grid) return;
        grid.innerHTML = '';

        if (memes.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 20px;">Шаблоны не найдены</div>';
            return;
        }

        memes.forEach(meme => {
            const card = document.createElement('div');
            card.className = 'template-card';
            const fallback = meme.fallbackUrl || '';
            card.innerHTML = `
                <img src="${meme.url}" alt="${meme.name}" onerror="if('${fallback}'){this.onerror=null; this.src='${fallback}';}" loading="lazy">
                <div class="template-name">${meme.name}</div>
            `;
            card.addEventListener('click', () => selectTemplate(meme));
            grid.appendChild(card);
        });
    }

    function selectTemplate(meme) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        const applyLoadedImage = (loadedImg) => {
            bgImage = loadedImg;
            isImageLoaded = true;

            canvas.width = loadedImg.naturalWidth || meme.width || 800;
            canvas.height = loadedImg.naturalHeight || meme.height || 800;

            const dimEl = document.getElementById('canvasDimensions');
            if (dimEl) dimEl.textContent = `${canvas.width} x ${canvas.height} px`;

            const memeText = meme.defaultText || (typeof getMemeDefaultText === 'function' ? getMemeDefaultText(meme.id, meme.name) : ["ВЕРХНИЙ ТЕКСТ", "НИЖНИЙ ТЕКСТ"]);
            createDefaultTextLayers(memeText);
            
            renderCanvas();
            showToast(`Шаблон "${meme.name}" загружен`, 'success');
        };

        img.onload = () => applyLoadedImage(img);
        
        img.onerror = () => {
            const fallbackUrl = meme.fallbackUrl || meme.url;
            const fallbackImg = new Image();
            fallbackImg.onload = () => applyLoadedImage(fallbackImg);
            fallbackImg.src = fallbackUrl;
        };

        img.src = meme.url;
    }

    function createDefaultTextLayers(defaults = ["ВЕРХНИЙ ТЕКСТ", "НИЖНИЙ ТЕКСТ"]) {
        const topText = defaults[0] || "";
        const bottomText = defaults[1] || "";

        const dynamicFontSize = Math.max(24, Math.round(canvas.height * 0.075));
        const strokeW = Math.max(2, Math.round(dynamicFontSize * 0.08));

        layers = [
            {
                id: 'top_layer',
                type: 'text',
                text: topText,
                x: canvas.width / 2,
                y: canvas.height * 0.12,
                fontSize: dynamicFontSize,
                fontFamily: 'Impact',
                textColor: '#ffffff',
                strokeColor: '#000000',
                strokeWidth: strokeW,
                isUppercase: true,
                align: 'center'
            },
            {
                id: 'bottom_layer',
                type: 'text',
                text: bottomText,
                x: canvas.width / 2,
                y: canvas.height * 0.88,
                fontSize: dynamicFontSize,
                fontFamily: 'Impact',
                textColor: '#ffffff',
                strokeColor: '#000000',
                strokeWidth: strokeW,
                isUppercase: true,
                align: 'center'
            }
        ];

        if (defaults[2]) {
            layers.push({
                id: 'middle_layer',
                type: 'text',
                text: defaults[2],
                x: canvas.width / 2,
                y: canvas.height * 0.5,
                fontSize: Math.round(dynamicFontSize * 0.85),
                fontFamily: 'Impact',
                textColor: '#ffffff',
                strokeColor: '#000000',
                strokeWidth: strokeW,
                isUppercase: true,
                align: 'center'
            });
        }

        activeLayerId = 'top_layer';
        updateTextInputValues();
        renderLayersList();
    }

    function wrapText(context, text, maxWidth) {
        if (!text) return [''];
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0] || '';

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
    // --- Render Canvas Engine ---
    function renderCanvas() {
        if (!isImageLoaded) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%)`;
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        drawings.forEach(path => {
            if (!path.points || path.points.length < 2) return;
            ctx.save();
            ctx.strokeStyle = path.color;
            ctx.lineWidth = path.size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(path.points[0].x, path.points[0].y);
            for (let i = 1; i < path.points.length; i++) {
                ctx.lineTo(path.points[i].x, path.points[i].y);
            }
            ctx.stroke();
            ctx.restore();
        });

        if (currentPath.length > 1) {
            ctx.save();
            ctx.strokeStyle = brushSettings.color;
            ctx.lineWidth = brushSettings.size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(currentPath[0].x, currentPath[0].y);
            for (let i = 1; i < currentPath.length; i++) {
                ctx.lineTo(currentPath[i].x, currentPath[i].y);
            }
            ctx.stroke();
            ctx.restore();
        }

        layers.forEach(layer => {
            if (layer.type === 'text') {
                drawTextLayer(layer);
            } else if (layer.type === 'sticker') {
                drawStickerLayer(layer);
            }
        });

        if (activeLayerId) {
            const activeLayer = layers.find(l => l.id === activeLayerId);
            if (activeLayer) {
                drawSelectionBox(activeLayer);
            }
        }
    }

    function drawTextLayer(layer) {
        ctx.save();
        ctx.translate(layer.x, layer.y);

        const displayText = layer.isUppercase ? layer.text.toUpperCase() : layer.text;
        ctx.font = `900 ${layer.fontSize}px "${layer.fontFamily}", sans-serif`;
        
        const maxWidth = canvas.width * 0.92;
        const lines = wrapText(ctx, displayText, maxWidth);
        const lineHeight = layer.fontSize * 1.15;
        const totalHeight = lines.length * lineHeight;
        const startY = -(totalHeight / 2) + (lineHeight / 2);

        ctx.textAlign = layer.align || 'center';
        ctx.textBaseline = 'middle';

        lines.forEach((line, index) => {
            const curY = startY + index * lineHeight;

            if (layer.strokeWidth > 0) {
                ctx.strokeStyle = layer.strokeColor;
                ctx.lineWidth = Math.min(layer.strokeWidth * 2, layer.fontSize * 0.2);
                ctx.lineJoin = 'round';
                ctx.strokeText(line, 0, curY);
            }

            ctx.fillStyle = layer.textColor;
            ctx.fillText(line, 0, curY);
        });

        ctx.restore();
    }

    function drawStickerLayer(layer) {
        ctx.save();
        ctx.translate(layer.x, layer.y);
        ctx.font = `${layer.fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.value, 0, 0);
        ctx.restore();
    }
    // Bounding Box with Resizing Handle Controls
    function getLayerBounds(layer) {
        let width = 200;
        let height = layer.fontSize * 1.2;

        if (layer.type === 'text') {
            ctx.font = `900 ${layer.fontSize}px "${layer.fontFamily}", sans-serif`;
            const textToMeasure = layer.isUppercase ? layer.text.toUpperCase() : layer.text;
            const maxWidth = canvas.width * 0.92;
            const lines = wrapText(ctx, textToMeasure, maxWidth);
            
            let maxLineWidth = 0;
            lines.forEach(l => {
                const w = ctx.measureText(l || ' ').width;
                if (w > maxLineWidth) maxLineWidth = w;
            });

            width = maxLineWidth + 24;
            height = Math.max(layer.fontSize * 1.2, lines.length * layer.fontSize * 1.15 + 16);
        } else if (layer.type === 'sticker') {
            width = layer.fontSize * 1.3;
            height = layer.fontSize * 1.3;
        }
        return { width, height };
    }

    function drawSelectionBox(layer) {
        ctx.save();
        ctx.translate(layer.x, layer.y);

        const { width, height } = getLayerBounds(layer);
    // Dashed bounding box
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.strokeRect(-width / 2, -height / 2, width, height);
    // 4 Interactive Corner Handles for Drag Resizing
        ctx.setLineDash([]);
        const handleSize = 14;
    // Corner Positions
        const corners = [
            { x: -width / 2, y: -height / 2 },
            { x: width / 2, y: -height / 2 },
            { x: -width / 2, y: height / 2 },
            { x: width / 2, y: height / 2 } // Primary resize handle
        ];

        corners.forEach((c, idx) => {
            ctx.fillStyle = idx === 3 ? '#ec4899' : '#06b6d4';
            ctx.beginPath();
            ctx.arc(c.x, c.y, handleSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        ctx.restore();
    }
    // --- Mouse & Pointer Events with Direct Drag Resizing ---
    canvas.addEventListener('pointerdown', (e) => {
        canvas.setPointerCapture(e.pointerId);
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        if (isDrawingMode) {
            isDrawing = true;
            currentPath = [{ x: mouseX, y: mouseY }];
            return;
        }
    // Check Corner Resize Handle Hit on Active Layer
        if (activeLayerId) {
            const activeLayer = layers.find(l => l.id === activeLayerId);
            if (activeLayer) {
                const bounds = getLayerBounds(activeLayer);
                const handleX = activeLayer.x + bounds.width / 2;
                const handleY = activeLayer.y + bounds.height / 2;
                const distToResizeHandle = Math.hypot(mouseX - handleX, mouseY - handleY);

                if (distToResizeHandle < 30) {
                    isResizing = true;
                    resizeStartSize = activeLayer.fontSize;
                    resizeStartDist = Math.hypot(mouseX - activeLayer.x, mouseY - activeLayer.y);
                    return;
                }
            }
        }
    // Hit Test for Layer Dragging Selection
        let foundLayer = null;
        for (let i = layers.length - 1; i >= 0; i--) {
            const l = layers[i];
            const bounds = getLayerBounds(l);
            if (Math.abs(mouseX - l.x) < bounds.width / 2 + 10 && Math.abs(mouseY - l.y) < bounds.height / 2 + 10) {
                foundLayer = l;
                break;
            }
        }

        if (foundLayer) {
            activeLayerId = foundLayer.id;
            isDragging = true;
            dragOffsetX = mouseX - foundLayer.x;
            dragOffsetY = mouseY - foundLayer.y;
            updateInspectorPanel(foundLayer);

            if (window.innerWidth <= 900) {
                const propsTab = document.getElementById('mobilePropsTab');
                if (propsTab && !propsTab.classList.contains('active')) {
                    propsTab.click();
                }
            }
        } else {
            activeLayerId = null;
        }

        renderLayersList();
        renderCanvas();
    });

    canvas.addEventListener('pointermove', (e) => {
        if (!activePointers.has(e.pointerId)) return;
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
    // Multi-touch Pinch Gesture for Resizing Layer or Canvas
        if (activePointers.size === 2) {
            const points = Array.from(activePointers.values());
            const currentDist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);

            if (activeLayerId) {
                const activeLayer = layers.find(l => l.id === activeLayerId);
                if (activeLayer) {
                    activeLayer.fontSize = Math.max(14, Math.min(200, Math.round(currentDist * 0.4)));
                    updateInspectorPanel(activeLayer);
                    renderCanvas();
                    return;
                }
            }
        }

        if (isDrawingMode && isDrawing) {
            currentPath.push({ x: mouseX, y: mouseY });
            renderCanvas();
            return;
        }

        if (isResizing && activeLayerId) {
            const activeLayer = layers.find(l => l.id === activeLayerId);
            if (activeLayer) {
                const currentDist = Math.hypot(mouseX - activeLayer.x, mouseY - activeLayer.y);
                const scaleFactor = currentDist / Math.max(1, resizeStartDist);
                activeLayer.fontSize = Math.max(12, Math.min(200, Math.round(resizeStartSize * scaleFactor)));
                updateInspectorPanel(activeLayer);
                renderCanvas();
            }
            return;
        }

        if (isDragging && activeLayerId) {
            const activeLayer = layers.find(l => l.id === activeLayerId);
            if (activeLayer) {
                activeLayer.x = mouseX - dragOffsetX;
                activeLayer.y = mouseY - dragOffsetY;
                renderCanvas();
            }
        }
    });

    canvas.addEventListener('pointerup', (e) => {
        canvas.releasePointerCapture(e.pointerId);
        activePointers.delete(e.pointerId);

        if (isDrawingMode && isDrawing) {
            isDrawing = false;
            drawings.push({
                color: brushSettings.color,
                size: brushSettings.size,
                points: [...currentPath]
            });
            currentPath = [];
            renderCanvas();
        }
        isDragging = false;
        isResizing = false;
    });

    canvas.addEventListener('pointercancel', (e) => {
        activePointers.delete(e.pointerId);
        isDragging = false;
        isResizing = false;
    });
    // --- Stickers Catalog Rendering ---
    function renderStickersCatalog() {
        const grid = document.getElementById('stickerGrid');
        if (!grid || typeof STICKERS_CATALOG === 'undefined') return;
        grid.innerHTML = '';

        STICKERS_CATALOG.forEach(sticker => {
            const item = document.createElement('div');
            item.className = 'sticker-item';
            item.textContent = sticker.value;
            item.title = sticker.label;
            item.addEventListener('click', () => addStickerLayer(sticker.value));
            grid.appendChild(item);
        });
    }

    function addStickerLayer(emojiValue) {
        const newLayer = {
            id: 'sticker_' + Date.now(),
            type: 'sticker',
            value: emojiValue,
            x: canvas.width / 2,
            y: canvas.height / 2,
            fontSize: Math.round(canvas.height * 0.12)
        };
        layers.push(newLayer);
        activeLayerId = newLayer.id;
        renderLayersList();
        renderCanvas();
        showToast('Стикер добавлен на мем', 'success');
    }

    function updateTextInputValues() {
        const topL = layers.find(l => l.id === 'top_layer');
        const bottomL = layers.find(l => l.id === 'bottom_layer');

        const topInput = document.getElementById('topTextInput');
        const bottomInput = document.getElementById('bottomTextInput');

        if (topInput) topInput.value = topL ? topL.text : '';
        if (bottomInput) bottomInput.value = bottomL ? bottomL.text : '';
    }

    function setupEventListeners() {
        const topInput = document.getElementById('topTextInput');
        if (topInput) {
            topInput.addEventListener('input', (e) => {
                let topL = layers.find(l => l.id === 'top_layer');
                if (!topL) {
                    createDefaultTextLayers([e.target.value, ""]);
                } else {
                    topL.text = e.target.value;
                }
                renderCanvas();
            });
        }

        const bottomInput = document.getElementById('bottomTextInput');
        if (bottomInput) {
            bottomInput.addEventListener('input', (e) => {
                let bottomL = layers.find(l => l.id === 'bottom_layer');
                if (!bottomL) {
                    createDefaultTextLayers(["", e.target.value]);
                } else {
                    bottomL.text = e.target.value;
                }
                renderCanvas();
            });
        }

        const addCustomTextBtn = document.getElementById('addCustomTextBtn');
        if (addCustomTextBtn) {
            addCustomTextBtn.addEventListener('click', () => {
                const newLayer = {
                    id: 'text_' + Date.now(),
                    type: 'text',
                    text: 'НОВЫЙ ТЕКСТ',
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    fontSize: Math.round(canvas.height * 0.06),
                    fontFamily: 'Impact',
                    textColor: '#ffffff',
                    strokeColor: '#000000',
                    strokeWidth: 4,
                    isUppercase: true,
                    align: 'center'
                };
                layers.push(newLayer);
                activeLayerId = newLayer.id;
                renderLayersList();
                renderCanvas();
                showToast('Текстовый блок добавлен', 'success');
            });
        }

        const fontFamilySel = document.getElementById('propFontFamily');
        if (fontFamilySel) {
            fontFamilySel.addEventListener('change', (e) => {
                const active = layers.find(l => l.id === activeLayerId);
                if (active && active.type === 'text') {
                    active.fontFamily = e.target.value;
                    renderCanvas();
                }
            });
        }

        const fontSizeSlider = document.getElementById('propFontSize');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                const valSpan = document.getElementById('propFontSizeVal');
                if (valSpan) valSpan.textContent = `${val}px`;
                const active = layers.find(l => l.id === activeLayerId);
                if (active) {
                    active.fontSize = val;
                    renderCanvas();
                }
            });
        }

        const textColorPicker = document.getElementById('propTextColor');
        if (textColorPicker) {
            textColorPicker.addEventListener('input', (e) => {
                const active = layers.find(l => l.id === activeLayerId);
                if (active && active.type === 'text') {
                    active.textColor = e.target.value;
                    renderCanvas();
                }
            });
        }

        const strokeColorPicker = document.getElementById('propStrokeColor');
        if (strokeColorPicker) {
            strokeColorPicker.addEventListener('input', (e) => {
                const active = layers.find(l => l.id === activeLayerId);
                if (active && active.type === 'text') {
                    active.strokeColor = e.target.value;
                    renderCanvas();
                }
            });
        }

        const strokeWidthSlider = document.getElementById('propStrokeWidth');
        if (strokeWidthSlider) {
            strokeWidthSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                const valSpan = document.getElementById('propStrokeWidthVal');
                if (valSpan) valSpan.textContent = `${val}px`;
                const active = layers.find(l => l.id === activeLayerId);
                if (active && active.type === 'text') {
                    active.strokeWidth = val;
                    renderCanvas();
                }
            });
        }

        const uppercaseBtn = document.getElementById('propUppercaseBtn');
        if (uppercaseBtn) {
            uppercaseBtn.addEventListener('click', () => {
                const active = layers.find(l => l.id === activeLayerId);
                if (active && active.type === 'text') {
                    active.isUppercase = !active.isUppercase;
                    renderCanvas();
                }
            });
        }

        const layerUpBtn = document.getElementById('layerUpBtn');
        if (layerUpBtn) {
            layerUpBtn.addEventListener('click', () => {
                if (!activeLayerId) return;
                const idx = layers.findIndex(l => l.id === activeLayerId);
                if (idx < layers.length - 1) {
                    const temp = layers[idx];
                    layers[idx] = layers[idx + 1];
                    layers[idx + 1] = temp;
                    renderLayersList();
                    renderCanvas();
                }
            });
        }

        const layerDownBtn = document.getElementById('layerDownBtn');
        if (layerDownBtn) {
            layerDownBtn.addEventListener('click', () => {
                if (!activeLayerId) return;
                const idx = layers.findIndex(l => l.id === activeLayerId);
                if (idx > 0) {
                    const temp = layers[idx];
                    layers[idx] = layers[idx - 1];
                    layers[idx - 1] = temp;
                    renderLayersList();
                    renderCanvas();
                }
            });
        }

        const deleteLayerBtn = document.getElementById('deleteLayerBtn');
        if (deleteLayerBtn) {
            deleteLayerBtn.addEventListener('click', () => {
                if (!activeLayerId) return;
                layers = layers.filter(l => l.id !== activeLayerId);
                activeLayerId = layers.length > 0 ? layers[layers.length - 1].id : null;
                renderLayersList();
                renderCanvas();
                showToast('Слой удален', 'warning');
            });
        }

        ['Brightness', 'Contrast', 'Saturate', 'Sepia', 'Grayscale'].forEach(filterName => {
            const slider = document.getElementById(`filter${filterName}`);
            const valSpan = document.getElementById(`${filterName.toLowerCase()}Val`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    const val = e.target.value;
                    filters[filterName.toLowerCase()] = parseInt(val);
                    if (valSpan) valSpan.textContent = `${val}%`;
                    renderCanvas();
                });
            }
        });

        const deepFryBtn = document.getElementById('deepFryBtn');
        if (deepFryBtn) {
            deepFryBtn.addEventListener('click', () => {
                filters = { brightness: 140, contrast: 220, saturate: 280, sepia: 20, grayscale: 0 };
                updateFilterUI();
                renderCanvas();
                showToast('🔥 МЕМ УСПЕШНО ПЕРЕЖАРЕН!', 'error');
            });
        }

        const resetFiltersBtn = document.getElementById('resetFiltersBtn');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                filters = { brightness: 100, contrast: 100, saturate: 100, sepia: 0, grayscale: 0 };
                updateFilterUI();
                renderCanvas();
                showToast('Фильтры сброшены', 'success');
            });
        }

        const toggleDrawBtn = document.getElementById('toggleDrawBtn');
        if (toggleDrawBtn) {
            toggleDrawBtn.addEventListener('click', (e) => {
                isDrawingMode = !isDrawingMode;
                toggleDrawBtn.classList.toggle('btn-primary', isDrawingMode);
                toggleDrawBtn.textContent = isDrawingMode ? '✏️ Рисование ВКЛЮЧЕНО' : '✏️ Включить рисователь';
                canvas.style.cursor = isDrawingMode ? 'crosshair' : 'default';
                showToast(isDrawingMode ? 'Режим рисования включен' : 'Режим выбора слоев', 'success');
            });
        }

        const brushColorPicker = document.getElementById('brushColor');
        if (brushColorPicker) {
            brushColorPicker.addEventListener('input', (e) => {
                brushSettings.color = e.target.value;
                const hexSpan = document.getElementById('brushColorHex');
                if (hexSpan) hexSpan.textContent = e.target.value;
            });
        }

        const brushSizeSlider = document.getElementById('brushSize');
        if (brushSizeSlider) {
            brushSizeSlider.addEventListener('input', (e) => {
                brushSettings.size = parseInt(e.target.value);
                const valSpan = document.getElementById('brushSizeVal');
                if (valSpan) valSpan.textContent = `${brushSettings.size}px`;
            });
        }

        const clearDrawBtn = document.getElementById('clearDrawBtn');
        if (clearDrawBtn) {
            clearDrawBtn.addEventListener('click', () => {
                drawings = [];
                renderCanvas();
                showToast('Рисунки очищены', 'warning');
            });
        }

        const randomCaptionBtn = document.getElementById('randomCaptionBtn');
        if (randomCaptionBtn && typeof FUNNY_CAPTIONS !== 'undefined') {
            randomCaptionBtn.addEventListener('click', () => {
                const rand = FUNNY_CAPTIONS[Math.floor(Math.random() * FUNNY_CAPTIONS.length)];
                createDefaultTextLayers([rand.top, rand.bottom]);
                renderCanvas();
                showToast('🎲 Случайный мем сгенерирован!', 'success');
            });
        }

        const dropzone = document.getElementById('uploadDropzone');
        const imageInput = document.getElementById('imageInput');

        if (dropzone && imageInput) {
            dropzone.addEventListener('click', () => imageInput.click());

            imageInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                }
            });

            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.style.borderColor = '#8b5cf6';
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                }
            });
        }
    // Export PNG Download
        const downloadBtn = document.getElementById('downloadMemeBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                const tempActive = activeLayerId;
                activeLayerId = null;
                renderCanvas();

                try {
                    const dataUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = `meme_${Date.now()}.png`;
                    link.href = dataUrl;
                    link.click();
                    saveMemeToStorage(dataUrl);
                    showToast('📥 Мем успешно скачан в PNG!', 'success');
                } catch (err) {
                    console.error('Canvas export error', err);
                    showToast('Ошибка при скачивании мема', 'error');
                }

                activeLayerId = tempActive;
                renderCanvas();
            });
        }
    // Web Share API
        const shareBtn = document.getElementById('shareMemeBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                const tempActive = activeLayerId;
                activeLayerId = null;
                renderCanvas();

                try {
                    canvas.toBlob(async (blob) => {
                        if (!blob) return;
                        const file = new File([blob], `meme_${Date.now()}.png`, { type: 'image/png' });
                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                            await navigator.share({
                                title: 'LOLIX Meme Craft Pro',
                                text: 'Посмотри мем, который я сделал!',
                                files: [file]
                            });
                            showToast('🚀 Мем успешно отправлен!', 'success');
                        } else {
                            await navigator.clipboard.write([
                                new ClipboardItem({ 'image/png': blob })
                            ]);
                            showToast('📋 Скопировано в буфер обмена!', 'success');
                        }
                    });
                } catch (err) {
                    console.error('Share error', err);
                }

                activeLayerId = tempActive;
                renderCanvas();
            });
        }
    // Copy Image to Clipboard
        const copyBtn = document.getElementById('copyClipboardBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                const tempActive = activeLayerId;
                activeLayerId = null;
                renderCanvas();

                try {
                    canvas.toBlob(async (blob) => {
                        if (!blob) {
                            showToast('Ошибка создания изображения', 'error');
                            return;
                        }
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        showToast('📋 Мем скопирован в буфер обмена!', 'success');
                    });
                } catch (err) {
                    console.error('Clipboard copy error', err);
                    showToast('Ошибка копирования в буфер обмена', 'error');
                }

                activeLayerId = tempActive;
                renderCanvas();
            });
        }
    // Gallery Modal
        const galleryBtn = document.getElementById('openGalleryBtn');
        const galleryModal = document.getElementById('galleryModal');
        const closeGalleryBtn = document.getElementById('closeGalleryModal');

        if (galleryBtn && galleryModal) {
            galleryBtn.addEventListener('click', () => {
                const grid = document.getElementById('galleryGrid');
                const saved = JSON.parse(localStorage.getItem('saved_memes') || '[]');

                if (grid) {
                    grid.innerHTML = '';
                    if (saved.length === 0) {
                        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 20px;">Пока нет сохраненных мемов.</p>';
                    } else {
                        saved.forEach(src => {
                            const item = document.createElement('div');
                            item.className = 'gallery-item';
                            item.innerHTML = `<img src="${src}" alt="Meme">`;
                            grid.appendChild(item);
                        });
                    }
                }
                galleryModal.classList.add('active');
            });
        }

        if (closeGalleryBtn && galleryModal) {
            closeGalleryBtn.addEventListener('click', () => {
                galleryModal.classList.remove('active');
            });
        }
    // Zoom & Canvas View Controls
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        const resetViewBtn = document.getElementById('resetViewBtn');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                zoomLevel = Math.min(2.0, zoomLevel + 0.15);
                applyZoom();
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                zoomLevel = Math.max(0.4, zoomLevel - 0.15);
                applyZoom();
            });
        }

        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => {
                zoomLevel = 1.0;
                applyZoom();
            });
        }
    }

    function applyZoom() {
        canvas.style.transform = `scale(${zoomLevel})`;
        const levelSpan = document.getElementById('zoomLevel');
        if (levelSpan) levelSpan.textContent = `${Math.round(zoomLevel * 100)}%`;
    }

    function updateFilterUI() {
        ['Brightness', 'Contrast', 'Saturate', 'Sepia', 'Grayscale'].forEach(f => {
            const slider = document.getElementById(`filter${f}`);
            const valSpan = document.getElementById(`${f.toLowerCase()}Val`);
            const key = f.toLowerCase();
            if (slider) slider.value = filters[key];
            if (valSpan) valSpan.textContent = `${filters[key]}%`;
        });
    }

    function updateInspectorPanel(layer) {
        if (layer.type === 'text') {
            const fontSel = document.getElementById('propFontFamily');
            const fontSizeSlider = document.getElementById('propFontSize');
            const fontSizeVal = document.getElementById('propFontSizeVal');
            const textColorPicker = document.getElementById('propTextColor');
            const strokeColorPicker = document.getElementById('propStrokeColor');
            const strokeWidthSlider = document.getElementById('propStrokeWidth');
            const strokeWidthVal = document.getElementById('propStrokeWidthVal');

            if (fontSel) fontSel.value = layer.fontFamily;
            if (fontSizeSlider) fontSizeSlider.value = layer.fontSize;
            if (fontSizeVal) fontSizeVal.textContent = `${layer.fontSize}px`;
            if (textColorPicker) textColorPicker.value = layer.textColor;
            if (strokeColorPicker) strokeColorPicker.value = layer.strokeColor;
            if (strokeWidthSlider) strokeWidthSlider.value = layer.strokeWidth;
            if (strokeWidthVal) strokeWidthVal.textContent = `${layer.strokeWidth}px`;
        }
    }

    function renderLayersList() {
        const list = document.getElementById('layersList');
        if (!list) return;
        list.innerHTML = '';

        layers.forEach((l) => {
            const item = document.createElement('div');
            item.className = `layer-item ${l.id === activeLayerId ? 'active' : ''}`;
            item.innerHTML = `
                <div class="layer-info">
                    <span class="layer-icon">${l.type === 'text' ? '🔤' : '🎨'}</span>
                    <span class="layer-name">${l.type === 'text' ? l.text : l.value}</span>
                </div>
            `;
            item.addEventListener('click', () => {
                activeLayerId = l.id;
                updateInspectorPanel(l);
                renderLayersList();
                renderCanvas();
            });
            list.appendChild(item);
        });
    }

    function handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                bgImage = img;
                isImageLoaded = true;
                canvas.width = img.width;
                canvas.height = img.height;
                const dimEl = document.getElementById('canvasDimensions');
                if (dimEl) dimEl.textContent = `${img.width} x ${img.height} px`;
                createDefaultTextLayers(["МОЙ МЕМ", "ТЕКСТ"]);
                renderCanvas();
                showToast('Ваше изображение загружено', 'success');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function saveMemeToStorage(dataUrl) {
        try {
            const existing = JSON.parse(localStorage.getItem('saved_memes') || '[]');
            existing.unshift(dataUrl);
            localStorage.setItem('saved_memes', JSON.stringify(existing.slice(0, 20)));
        } catch (e) {
            console.warn('LocalStorage error', e);
        }
    }

    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
