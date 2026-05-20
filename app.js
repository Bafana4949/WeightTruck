document.addEventListener('DOMContentLoaded', () => {
    // --- APP STATE (Initialize from localStorage if available, or use defaults) ---
    let appState = {
        allocatedMass: 0,
        totalOrderMass: 34.00,
        hauliers: [],
        availableVehicles: [
            { id: 1, reg: 'GP-142-TR', fleet: 'V01', inducted: true, driver: 'Musa Ndiaye' },
            { id: 2, reg: 'MP-990-CL', fleet: 'V02', inducted: true, driver: 'Jaco Pretorius' },
            { id: 3, reg: 'NW-441-RT', fleet: 'V03', inducted: false, driver: 'Themba Khumalo' },
            { id: 4, reg: 'L-008-MN', fleet: 'V04', inducted: true, driver: 'Sarah Jenkins' },
            { id: 5, reg: 'GP-772-XL', fleet: 'V05', inducted: true, driver: 'Piet de Wet' }
        ],
        assignedVehicles: {}, // Map of haulierIndex -> [vehicleIds]
        
        // Active orders database
        orders: [
            { id: 'ORD-4029', type: 'Dispatch', product: 'Anthracite Pea', target: 34.00, allocated: 34.00, client: 'Glencore Operations', status: 'Approved' },
            { id: 'ORD-4030', type: 'Dispatch', product: 'RB1 Export', target: 120.00, allocated: 60.00, client: 'Exxaro Resources', status: 'Approved' },
            { id: 'ORD-4031', type: 'Receipt', product: 'Duff', target: 200.00, allocated: 150.00, client: 'Sasol Mining', status: 'Approved' },
            { id: 'ORD-4032', type: 'Receipt', product: 'Anthracite Pea', target: 50.00, allocated: 0.00, client: 'Sasol Mining', status: 'Pending' }
        ],

        // Mock Dual Ticket Data
        dualTickets: {
            1: {
                id: 'T-84210',
                dispatch: { no: 'D-11029', src: 'Primary Pit A', weight: 34.10, time: '2026-05-15 14:20' },
                receipt: { no: 'R-55902', dest: 'Stockpile C', weight: 33.69, time: '2026-05-15 15:45' },
                variance: 1.2,
                reg: 'GP-142-TR',
                prod: 'Anthracite Pea',
                status: 'Accepted'
            },
            2: {
                id: 'T-84212',
                dispatch: { no: 'D-11041', src: 'Primary Pit A', weight: 45.30, time: '2026-05-15 15:10' },
                receipt: { no: 'R-55928', dest: 'Stockpile B', weight: 43.12, time: '2026-05-15 16:30' },
                variance: 4.8,
                reg: 'NW-441-RT',
                prod: 'RB1 Export',
                status: 'Review Req'
            }
        },

        // Stockpile Levels
        stockpiles: [
            { id: 'sp1', name: 'Stockpile A', product: 'Anthracite Pea', tons: 5420, capacity: 10000, color: 'blue-fill' },
            { id: 'sp2', name: 'Stockpile B', product: 'RB1 Export', tons: 7850, capacity: 12000, color: 'amber-fill' },
            { id: 'sp3', name: 'Stockpile C', product: 'Duff', tons: 1950, capacity: 8000, color: 'cyan-fill' }
        ],

        // Notifications log
        warnings: [
            { id: 1, type: 'alert', title: 'Route Deviation Detected', desc: 'Vehicle NW-441-RT carrying RB1 Export departed from path corridor at 12:30.', time: '12 mins ago', read: false },
            { id: 2, type: 'info', title: 'Access Request Denied', desc: 'NW-441-RT denied gate access: Driver Themba Khumalo has an expired safety induction.', time: '25 mins ago', read: false },
            { id: 3, type: 'success', title: 'Intake Reconciled', desc: 'Ticket T-84210 fully reconciled with GLENCORE. Mass variance 1.2% within threshold.', time: '40 mins ago', read: true }
        ],

        // Config variables
        simulationActive: true,
        simulationInterval: 15, // seconds
        varianceThreshold: 2.0, // %
        ratePerTon: 450.00, // ZAR
        dailyTarget: 1300 // tons
    };

    const userInfo = {
        organisationId: 201,
        username: 'Irfan Zad'
    };

    // --- DATA MOCKS ---
    const products = [
        { id: 10, name: 'Anthracite Pea', stockpiles: ['Stockpile A', 'Stockpile B'] },
        { id: 11, name: 'RB1 Export', stockpiles: ['Export Bin 1', 'Export Bin 2'] },
        { id: 12, name: 'Duff', stockpiles: ['Duff Pile 1'] }
    ];

    // Load from LocalStorage if exists
    if (localStorage.getItem('wieghtruck_state')) {
        try {
            const savedState = JSON.parse(localStorage.getItem('wieghtruck_state'));
            // Merge settings
            appState = { ...appState, ...savedState };
        } catch (e) {
            console.error("Failed to load state from localStorage:", e);
        }
    }

    const saveStateToLocalStorage = () => {
        localStorage.setItem('wieghtruck_state', JSON.stringify(appState));
    };

    // --- TOAST SYSTEM ---
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        const icon = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    // --- VIEW ROUTER ---
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    const switchView = (viewName) => {
        // Toggle Nav Items
        navItems.forEach(item => {
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Toggle View Sections
        viewSections.forEach(section => {
            if (section.id === `${viewName}-view`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Specific View Renderers
        if (viewName === 'orders') renderOrdersTable();
        if (viewName === 'logistics') renderTransitVehicles();
        if (viewName === 'inventory') renderInventoryTab();
        if (viewName === 'reports') renderReportsCharts();
        if (viewName === 'settings') renderSettingsTab();
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const view = item.dataset.view;
            if (!view) return; // Leave native href behaviors alone (like Logout)
            e.preventDefault();
            switchView(view);
        });
    });

    // --- UTILS & CORE DISPLAYS ---
    const updateMassDisplays = () => {
        const allocated = appState.hauliers.reduce((sum, h) => sum + parseFloat(h.mass || 0), 0);
        const displayAllocated = document.getElementById('displayAllocatedMass');
        const displayUnallocated = document.getElementById('displayUnallocatedMass');
        const displayTotal = document.getElementById('displayTotalOrderMass');
        const maxAvail = document.getElementById('maxAvailableMass');

        if (displayAllocated) displayAllocated.textContent = allocated.toFixed(2) + ' t';
        if (displayUnallocated) displayUnallocated.textContent = Math.max(0, appState.totalOrderMass - allocated).toFixed(2) + ' t';
        if (displayTotal) displayTotal.textContent = appState.totalOrderMass.toFixed(2) + ' t';
        if (maxAvail) maxAvail.textContent = Math.max(0, appState.totalOrderMass - allocated).toFixed(2);
    };

    // Modal Control Setup
    const setupModal = (modalId, triggerBtnId) => {
        const modal = document.getElementById(modalId);
        const trigger = document.getElementById(triggerBtnId);
        if (!modal) return;
        const closers = modal.querySelectorAll('.close-modal');

        if (trigger) {
            trigger.onclick = (e) => {
                e.preventDefault();
                modal.style.display = 'block';
            };
        }
        
        closers.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                modal.style.display = 'none';
            };
        });
        
        window.addEventListener('click', (e) => {
            if (e.target == modal) modal.style.display = 'none';
        });
    };

    const closeAllModals = () => {
        document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // Setup modals
    setupModal('order-modal', 'btn-create-order');
    setupModal('order-modal', 'btn-create-order-tab');
    setupModal('haulier-modal', 'btn-add-haulier');
    setupModal('vehicle-modal', null);

    // Order modal dynamic buttons within tab views
    const tabGeneralBtn = document.querySelector('[data-tab="general"]');
    const tabHauliersBtn = document.querySelector('[data-tab="hauliers"]');
    
    if (tabGeneralBtn && tabHauliersBtn) {
        tabGeneralBtn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tabGeneralBtn.classList.add('active');
            document.getElementById('tab-general').classList.add('active');
        };
        tabHauliersBtn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tabHauliersBtn.classList.add('active');
            document.getElementById('tab-hauliers').classList.add('active');
        };
    }

    // --- MOCK TRANSIT & SIMULATED GPS CORRIDOR ---
    const mockFeed = [
        { id: 'T-84210', reg: 'GP-142-TR', prod: 'Anthracite Pea', gross: '54.20 t', net: '34.10 t', time: '12:15', status: 'Complete' },
        { id: 'T-84211', reg: 'MP-990-CL', prod: 'RB1 Export', gross: '48.15 t', net: '28.05 t', time: '12:28', status: 'In Progress' },
        { id: 'T-84212', reg: 'NW-441-RT', prod: 'RB1 Export', gross: '62.40 t', net: '43.12 t', time: '12:35', status: 'Variance Flagged' }
    ];

    const mockGateEvents = [
        { reg: 'L-008-MN', time: '12:12', status: 'granted', msg: 'Induction valid. Order active.' },
        { reg: 'NW-441-RT', time: '12:25', status: 'denied', msg: 'Missing driver induction.', error: true },
        { reg: 'GP-772-XL', time: '12:31', status: 'granted', msg: 'License valid. Access granted.' }
    ];

    const recentInventoryLogs = [
        { time: '2026-05-20 12:15', target: 'Stockpile A', product: 'Anthracite Pea', mass: '34.10 t', haulier: 'Unitrans Supply Chain', reg: 'GP-142-TR', verification: 'Accepted' },
        { time: '2026-05-20 11:42', target: 'Stockpile B', product: 'RB1 Export', mass: '28.05 t', haulier: 'Barloworld Logistics', reg: 'MP-990-CL', verification: 'Accepted' },
        { time: '2026-05-20 10:15', target: 'Stockpile C', product: 'Duff', mass: '33.69 t', haulier: 'Imperial Logistics', reg: 'L-008-MN', verification: 'Accepted' },
        { time: '2026-05-20 09:30', target: 'Stockpile B', product: 'RB1 Export', mass: '43.12 t', haulier: 'Unitrans Supply Chain', reg: 'NW-441-RT', verification: 'Variance Flagged' }
    ];

    const weeklyTonnages = [1180, 1420, 940, 1280, 1240, 480, 220]; // Mon-Sun
    const productTonnages = {
        'Anthracite Pea': 540,
        'RB1 Export': 480,
        'Duff': 220
    };

    // --- GATE ACCESS SIMULATION RENDERING ---
    const renderGateEvents = () => {
        const gateFeed = document.getElementById('gate-feed');
        if (!gateFeed) return;
        gateFeed.innerHTML = '';
        mockGateEvents.forEach(e => {
            const eventEl = document.createElement('div');
            eventEl.className = 'gate-event';
            const icon = e.status === 'granted' ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
            eventEl.innerHTML = `
                <div class="event-icon ${e.status}">${icon}</div>
                <div class="event-details">
                    <div class="event-top">
                        <strong>${e.reg}</strong>
                        <span class="event-time">${e.time}</span>
                    </div>
                    <div class="event-msg ${e.error ? 'error' : ''}">${e.msg}</div>
                </div>
            `;
            gateFeed.appendChild(eventEl);
        });
    };

    // --- LIVE FEED RENDERING ---
    const renderFeed = (items) => {
        const feed = document.getElementById('weighbridge-feed');
        if (!feed) return;
        feed.innerHTML = '';
        items.forEach((t) => {
            const row = document.createElement('tr');
            let badgeClass = 'pending';
            if (t.status === 'Complete') badgeClass = 'complete';
            if (t.status === 'In Progress') badgeClass = 'in-progress';
            if (t.status === 'Variance Flagged') badgeClass = 'variance-flagged';
            row.innerHTML = `
                <td><strong>${t.id}</strong></td>
                <td>${t.reg}</td>
                <td>${t.prod}</td>
                <td>${t.gross}</td>
                <td>${t.net}</td>
                <td>${t.time}</td>
                <td><span class="status-badge ${badgeClass}">${t.status}</span></td>
            `;
            feed.appendChild(row);
        });
    };

    // --- NOTIFICATION DRAWER LOGIC ---
    const notificationDrawer = document.getElementById('notification-drawer');
    const notificationBellBtn = document.getElementById('notification-bell-btn');
    const closeNotificationDrawerBtn = document.getElementById('close-notification-drawer-btn');
    const notificationDrawerContent = document.getElementById('notification-drawer-content');
    const notificationBadge = document.getElementById('notification-badge');

    const updateNotificationBadge = () => {
        const unreadCount = appState.warnings.filter(w => !w.read).length;
        if (notificationBadge) {
            notificationBadge.textContent = unreadCount;
            notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    };

    const renderNotifications = () => {
        if (!notificationDrawerContent) return;
        notificationDrawerContent.innerHTML = '';
        
        if (appState.warnings.length === 0) {
            notificationDrawerContent.innerHTML = '<div style="color:var(--text-muted); text-align:center; margin-top:2rem;">No system warnings logged.</div>';
            return;
        }

        appState.warnings.forEach(w => {
            const item = document.createElement('div');
            item.className = `notification-item ${w.type} ${w.read ? 'read' : ''}`;
            item.innerHTML = `
                <h4>${w.title} ${!w.read ? '<span class="inducted-tag" style="background:var(--primary-amber-glow); color:var(--primary-amber); margin-left:5px;">NEW</span>' : ''}</h4>
                <p>${w.desc}</p>
                <div class="time">${w.time}</div>
            `;
            
            // Mark as read when hovered or clicked
            item.onclick = () => {
                w.read = true;
                item.classList.add('read');
                const badge = item.querySelector('.inducted-tag');
                if (badge) badge.remove();
                updateNotificationBadge();
                saveStateToLocalStorage();
            };

            notificationDrawerContent.appendChild(item);
        });
    };

    if (notificationBellBtn) {
        notificationBellBtn.onclick = (e) => {
            e.preventDefault();
            renderNotifications();
            notificationDrawer.classList.add('open');
        };
    }

    if (closeNotificationDrawerBtn) {
        closeNotificationDrawerBtn.onclick = (e) => {
            e.preventDefault();
            notificationDrawer.classList.remove('open');
        };
    }

    // --- ANIMATED TRUCK TELEMETRY (SVG Map Pathing) ---
    const movingTruck = document.getElementById('moving-truck');
    const movingTruckReg = document.getElementById('moving-truck-reg');
    const movingTruckStatus = document.getElementById('moving-truck-status');
    const movingTruckDeviation = document.getElementById('moving-truck-deviation');
    const svgRouteLine = document.getElementById('svg-route-line');
    
    let pathProgress = 0;
    let telemetrySpeed = 0.15; // Speed multiplier for path animation
    let isTransitioning = false;

    const animateTelemetry = () => {
        if (!movingTruck || !svgRouteLine || !appState.simulationActive) return;
        
        const pathLength = svgRouteLine.getTotalLength();
        
        if (pathProgress < 100) {
            pathProgress += telemetrySpeed;
            const distance = (pathProgress / 100) * pathLength;
            const pt = svgRouteLine.getPointAtLength(distance);
            
            // SVG coordinate dimensions are mapped from 100x100
            movingTruck.style.left = pt.x + '%';
            movingTruck.style.top = pt.y + '%';
            
            // Simulation texts
            if (pathProgress > 15 && pathProgress < 80) {
                movingTruckStatus.textContent = 'En Route';
                movingTruckDeviation.textContent = 'No Deviations';
                movingTruckDeviation.className = 'status-ok';
            }
        } else if (!isTransitioning) {
            isTransitioning = true;
            movingTruckStatus.textContent = 'At Weighbridge';
            movingTruck.classList.add('pulse');
            
            // Trigger load arrival event!
            setTimeout(() => {
                triggerSimulationEvent();
                pathProgress = 0;
                isTransitioning = false;
            }, 3000);
        }
        
        requestAnimationFrame(animateTelemetry);
    };

    // --- SIMULATION DATABASE TRIGGER (New loads arrival) ---
    const triggerSimulationEvent = () => {
        // Choose random vehicle
        const vehicle = appState.availableVehicles[Math.floor(Math.random() * appState.availableVehicles.length)];
        const product = products[Math.floor(Math.random() * products.length)];
        
        // Calculate random weight
        const targetWeight = 34.00 + (Math.random() * 8 - 4); // 30 - 38 tons
        const varianceVal = parseFloat((Math.random() * 3).toFixed(1)); // 0% to 3% variance
        const receiptWeight = targetWeight * (1 - (varianceVal / 100));
        
        const newTicketId = 'T-' + Math.floor(80000 + Math.random() * 10000);
        
        // Status matching
        let ticketStatus = 'Complete';
        if (varianceVal > appState.varianceThreshold) {
            ticketStatus = 'Variance Flagged';
            // Alert notifications!
            const newWarning = {
                id: Date.now(),
                type: 'alert',
                title: 'Mass Variance Triggered',
                desc: `Vehicle ${vehicle.reg} carrying ${product.name} flagged at Weighbridge 01: variance of ${varianceVal}% exceeds the allowed ${appState.varianceThreshold}%.`,
                time: 'Just now',
                read: false
            };
            appState.warnings.unshift(newWarning);
            updateNotificationBadge();
            showToast(`Variance Alarm! Vehicle ${vehicle.reg} exceeded threshold!`, 'error');
            
            // Update live Dual comparison
            appState.dualTickets[1] = {
                id: newTicketId,
                dispatch: { no: 'D-' + Math.floor(10000 + Math.random() * 90000), src: 'Primary Pit A', weight: targetWeight, time: '11:45' },
                receipt: { no: 'R-' + Math.floor(10000 + Math.random() * 90000), dest: 'Stockpile B', weight: receiptWeight, time: '12:55' },
                variance: varianceVal,
                reg: vehicle.reg,
                prod: product.name,
                status: 'Review Req'
            };
            updateAnalytics(1);
        } else {
            showToast(`Weighbridge ticket ${newTicketId} successfully processed!`);
            // Increment inventory
            const targetSP = appState.stockpiles.find(sp => sp.product === product.name);
            if (targetSP) {
                targetSP.tons = Math.min(targetSP.capacity, targetSP.tons + receiptWeight);
            }
            
            // Add inventory log
            recentInventoryLogs.unshift({
                time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                target: targetSP ? targetSP.name : 'Stockpile A',
                product: product.name,
                mass: receiptWeight.toFixed(2) + ' t',
                haulier: 'Unitrans Supply Chain',
                reg: vehicle.reg,
                verification: 'Accepted'
            });
        }

        // Add to live feeds
        const newTicket = {
            id: newTicketId,
            reg: vehicle.reg,
            prod: product.name,
            gross: (receiptWeight * 1.45).toFixed(2) + ' t',
            net: receiptWeight.toFixed(2) + ' t',
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            status: ticketStatus
        };
        mockFeed.unshift(newTicket);
        if (mockFeed.length > 8) mockFeed.pop();
        
        // Random gate access log too
        const isGranted = Math.random() > 0.15;
        mockGateEvents.unshift({
            reg: appState.availableVehicles[Math.floor(Math.random() * appState.availableVehicles.length)].reg,
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            status: isGranted ? 'granted' : 'denied',
            msg: isGranted ? 'Access cleared. Induction and Order verified.' : 'Access denied: Missing valid site induction.',
            error: !isGranted
        });
        if (mockGateEvents.length > 5) mockGateEvents.pop();

        // Update KPIs
        appState.dailyTarget = parseFloat(appState.dailyTarget);
        const tonnageValue = weeklyTonnages.reduce((a,b)=>a+b, 0) / 7 + receiptWeight;
        
        // Update KPI HTML values directly if on Dashboard
        const tonnageEl = document.getElementById('kpi-tonnage-today');
        const activeOrdersEl = document.getElementById('kpi-active-orders');
        if (tonnageEl) tonnageEl.innerHTML = `${Math.floor(tonnageValue).toLocaleString()} <small>t</small>`;
        if (activeOrdersEl) activeOrdersEl.textContent = appState.orders.length;

        // Render feeds
        renderFeed(mockFeed);
        renderGateEvents();
        
        // Redraw views if currently visible
        const activeView = document.querySelector('.view-section.active');
        if (activeView && activeView.id === 'inventory-view') renderInventoryTab();
        
        saveStateToLocalStorage();
    };

    // Toggle simulation setting button directly in live telemetry card
    const telemetryToggleBtn = document.getElementById('telemetry-toggle-btn');
    if (telemetryToggleBtn) {
        telemetryToggleBtn.onclick = () => {
            appState.simulationActive = !appState.simulationActive;
            telemetryToggleBtn.classList.toggle('active', appState.simulationActive);
            saveStateToLocalStorage();
            if (appState.simulationActive) {
                animateTelemetry();
                showToast("Simulation Engine activated");
            } else {
                showToast("Simulation Engine paused", "error");
            }
        };
    }

    // --- VIEW 2: ORDERS RENDER & CONTROLLER ---
    const ordersListBody = document.getElementById('orders-list-body');
    
    const renderOrdersTable = () => {
        if (!ordersListBody) return;
        ordersListBody.innerHTML = '';
        
        const filterVal = document.getElementById('orders-search').value.trim().toLowerCase();
        
        const filtered = appState.orders.filter(o => 
            o.id.toLowerCase().includes(filterVal) ||
            o.product.toLowerCase().includes(filterVal) ||
            o.client.toLowerCase().includes(filterVal)
        );

        if (filtered.length === 0) {
            ordersListBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No orders found.</td></tr>';
            return;
        }

        filtered.forEach(o => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${o.id}</strong></td>
                <td>${o.type}</td>
                <td>${o.product}</td>
                <td>${o.client}</td>
                <td>${o.target.toFixed(2)} t</td>
                <td>${o.allocated.toFixed(2)} t</td>
                <td><span class="status-badge ${o.status === 'Approved' ? 'complete' : 'pending'}">${o.status}</span></td>
                <td>
                    <button class="btn-text btn-delete-order" data-id="${o.id}"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>
            `;
            ordersListBody.appendChild(row);
        });

        // Connect delete buttons
        document.querySelectorAll('.btn-delete-order').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                appState.orders = appState.orders.filter(o => o.id !== id);
                renderOrdersTable();
                showToast(`Order ${id} removed successfully`);
                saveStateToLocalStorage();
            };
        });
    };

    const ordersSearchInput = document.getElementById('orders-search');
    if (ordersSearchInput) {
        ordersSearchInput.oninput = renderOrdersTable;
    }

    // --- VIEW 3: LOGISTICS VEHICLES TELEMETRY ---
    const transitVehiclesList = document.getElementById('transit-vehicles-list');
    
    const renderTransitVehicles = () => {
        if (!transitVehiclesList) return;
        transitVehiclesList.innerHTML = '';

        appState.availableVehicles.forEach((v, index) => {
            const speed = v.inducted ? Math.floor(40 + Math.random() * 25) : 0;
            const signalStatus = v.inducted ? '<span class="status-badge complete">Online</span>' : '<span class="status-badge variance-flagged">Offline</span>';
            const location = v.inducted ? `Route Point ${String.fromCharCode(65 + index)}` : 'Terminal Gate Gate A';
            const destination = index % 2 === 0 ? 'Stockpile B' : 'Stockpile A';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${v.reg}</strong></td>
                <td>${v.driver}</td>
                <td><span style="font-family:var(--font-mono); font-weight:700;">${speed} km/h</span></td>
                <td>${location}</td>
                <td>${destination}</td>
                <td>${signalStatus}</td>
                <td>
                    <button class="btn-text" onclick="alert('Pinging telemetry box on vehicle ${v.reg}. Signal response latency 12ms. GPS locked.')"><i class="fa-solid fa-satellite-dish"></i> Ping</button>
                </td>
            `;
            transitVehiclesList.appendChild(row);
        });
    };

    // --- VIEW 4: INVENTORY LEVELS RENDERING ---
    const stockpilesGridContainer = document.getElementById('stockpiles-grid-container');
    const inventoryLogsBody = document.getElementById('inventory-logs-body');

    const renderInventoryTab = () => {
        if (!stockpilesGridContainer || !inventoryLogsBody) return;
        
        // Stockpile cards
        stockpilesGridContainer.innerHTML = '';
        appState.stockpiles.forEach(sp => {
            const fillPercentage = (sp.tons / sp.capacity) * 100;
            const card = document.createElement('div');
            card.className = `stockpile-card ${sp.color}`;
            card.innerHTML = `
                <div class="stockpile-name">
                    <span>${sp.name}</span>
                    <i class="fa-solid fa-cubes-stacked" style="color:var(--primary-cyan);"></i>
                </div>
                <div class="stockpile-details">
                    <label>Product Stored:</label>
                    <span>${sp.product}</span>
                </div>
                <div class="stockpile-details">
                    <label>Intake Volume:</label>
                    <span>${Math.floor(sp.tons).toLocaleString()} / ${sp.capacity.toLocaleString()} tons</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${fillPercentage}%;"></div>
                    </div>
                    <div style="font-size:0.75rem; text-align:right; color:var(--text-muted); margin-top:2px;">${fillPercentage.toFixed(1)}% Capacity Filled</div>
                </div>
            `;
            stockpilesGridContainer.appendChild(card);
        });

        // Intake logs
        inventoryLogsBody.innerHTML = '';
        recentInventoryLogs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.time}</td>
                <td><strong>${log.target}</strong></td>
                <td>${log.product}</td>
                <td><span style="font-family:var(--font-mono); font-weight:700;">${log.mass}</span></td>
                <td>${log.haulier}</td>
                <td><strong>${log.reg}</strong></td>
                <td><span class="status-badge ${log.verification === 'Accepted' ? 'complete' : 'variance-flagged'}">${log.verification}</span></td>
            `;
            inventoryLogsBody.appendChild(row);
        });
    };

    // --- VIEW 5: REPORTS & CHART RENDER (Drawn dynamically via SVG) ---
    const renderReportsCharts = () => {
        // 1. Line Chart rendering
        const linePath = document.getElementById('chart-line-path');
        const areaPath = document.getElementById('chart-area-path');
        const pointsGroup = document.getElementById('chart-points-group');
        const labelsGroup = document.getElementById('chart-labels-group');

        if (linePath && pointsGroup) {
            pointsGroup.innerHTML = '';
            labelsGroup.innerHTML = '';
            
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const xOffset = 50;
            const width = 520;
            const height = 150; // max chart height
            const maxVal = Math.max(...weeklyTonnages) * 1.1; // Add 10% headroom

            let pathCoords = [];
            
            days.forEach((day, index) => {
                const x = xOffset + (width / (days.length - 1)) * index;
                // y goes from 30 (high value) to 180 (0 value)
                const tonnage = weeklyTonnages[index];
                const y = 180 - (tonnage / maxVal) * height;

                pathCoords.push(`${x},${y}`);

                // Draw circles
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('class', 'chart-point');
                
                // Add hover tooltip
                circle.addEventListener('mouseover', (e) => {
                    const tooltip = document.getElementById('chart-tooltip');
                    tooltip.style.display = 'block';
                    tooltip.innerHTML = `<strong>${day}</strong>: ${tonnage} t`;
                    
                    const rect = e.target.getBoundingClientRect();
                    const containerRect = document.querySelector('.chart-wrapper').getBoundingClientRect();
                    tooltip.style.left = (rect.left - containerRect.left - 20) + 'px';
                    tooltip.style.top = (rect.top - containerRect.top - 35) + 'px';
                });

                circle.addEventListener('mouseout', () => {
                    document.getElementById('chart-tooltip').style.display = 'none';
                });

                pointsGroup.appendChild(circle);

                // Draw X-axis label
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x);
                text.setAttribute('y', 205);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('class', 'chart-axis-text');
                text.textContent = day;
                labelsGroup.appendChild(text);
            });

            // Set line path
            linePath.setAttribute('d', `M${pathCoords.join(' L')}`);

            // Set area path (fill under line)
            areaPath.setAttribute('d', `M50,180 L${pathCoords.join(' L')} L${xOffset + width},180 Z`);
        }

        // 2. Bar Chart rendering
        const barChartContent = document.getElementById('bar-chart-content');
        if (barChartContent) {
            barChartContent.innerHTML = '';
            
            const prodKeys = Object.keys(productTonnages);
            const xOffset = 50;
            const barWidth = 35;
            const chartHeight = 130;
            const maxVal = Math.max(...Object.values(productTonnages)) * 1.1;

            prodKeys.forEach((key, index) => {
                const x = xOffset + 60 * index;
                const value = productTonnages[key];
                const barHeight = (value / maxVal) * chartHeight;
                const y = 180 - barHeight;

                // Create rectangle bar
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', barWidth);
                rect.setAttribute('height', barHeight);
                rect.setAttribute('class', 'chart-bar');
                
                // Color mapping
                if (key === 'Anthracite Pea') rect.style.fill = 'var(--primary-blue)';
                if (key === 'RB1 Export') rect.style.fill = 'var(--primary-amber)';
                if (key === 'Duff') rect.style.fill = 'var(--primary-cyan)';

                // Append value text on top of bar
                const textVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                textVal.setAttribute('x', x + barWidth/2);
                textVal.setAttribute('y', y - 8);
                textVal.setAttribute('text-anchor', 'middle');
                textVal.setAttribute('class', 'chart-axis-text');
                textVal.style.fill = '#ffffff';
                textVal.style.fontWeight = '700';
                textVal.textContent = value + 't';

                // Append X-axis label
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', x + barWidth/2);
                label.setAttribute('y', 205);
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('class', 'chart-axis-text');
                label.textContent = key.split(' ')[0]; // Shorten name

                barChartContent.appendChild(rect);
                barChartContent.appendChild(textVal);
                barChartContent.appendChild(label);
            });
        }
    };

    // --- VIEW 6: SETTINGS VIEW CONTROLLERS ---
    const toggleSimSwitch = document.getElementById('settings-toggle-simulation');
    const simSpeedRange = document.getElementById('settings-simulation-speed');
    const varThresholdInput = document.getElementById('settings-variance-threshold');
    const ratePerTonInput = document.getElementById('settings-rate-per-ton');
    const dailyTargetInput = document.getElementById('settings-daily-target');
    const saveSettingsBtn = document.getElementById('btn-save-settings');

    const renderSettingsTab = () => {
        if (toggleSimSwitch) toggleSimSwitch.checked = appState.simulationActive;
        if (simSpeedRange) simSpeedRange.value = appState.simulationInterval;
        if (varThresholdInput) varThresholdInput.value = appState.varianceThreshold;
        if (ratePerTonInput) ratePerTonInput.value = appState.ratePerTon;
        if (dailyTargetInput) dailyTargetInput.value = appState.dailyTarget;
    };

    if (saveSettingsBtn) {
        saveSettingsBtn.onclick = (e) => {
            e.preventDefault();
            
            appState.simulationActive = toggleSimSwitch.checked;
            appState.simulationInterval = parseInt(simSpeedRange.value);
            appState.varianceThreshold = parseFloat(varThresholdInput.value);
            appState.ratePerTon = parseFloat(ratePerTonInput.value);
            appState.dailyTarget = parseFloat(dailyTargetInput.value);
            
            saveStateToLocalStorage();
            showToast("Configurations saved successfully!");
            
            // Reapply simulation state
            const telemetryToggleBtn = document.getElementById('telemetry-toggle-btn');
            if (telemetryToggleBtn) {
                telemetryToggleBtn.classList.toggle('active', appState.simulationActive);
            }
        };
    }

    // --- DUAL TICKET COMPARE CONTROLLER ---
    const updateAnalytics = (id) => {
        const data = appState.dualTickets[id];
        if (!data) return;

        document.getElementById('disp-no').textContent = data.dispatch.no;
        document.getElementById('disp-src').textContent = data.dispatch.src;
        document.getElementById('disp-weight').textContent = data.dispatch.weight.toFixed(2) + ' t';
        document.getElementById('disp-time').textContent = data.dispatch.time;
        
        document.getElementById('rect-no').textContent = data.receipt.no;
        document.getElementById('rect-dest').textContent = data.receipt.dest;
        document.getElementById('rect-weight').textContent = data.receipt.weight.toFixed(2) + ' t';
        document.getElementById('rect-time').textContent = data.receipt.time;

        document.getElementById('variance-val').textContent = data.variance.toFixed(1) + '%';
        const statusEl = document.getElementById('variance-status');
        
        if (data.variance < appState.varianceThreshold) {
            statusEl.textContent = 'ACCEPTED';
            statusEl.className = 'variance-status ok';
        } else {
            statusEl.textContent = 'REVIEW REQ';
            statusEl.className = 'variance-status warning';
        }
    };

    // Connected Ticket selector dropdown
    const ticketComparisonSelect = document.getElementById('ticket-comparison-select');
    if (ticketComparisonSelect) {
        // Populate dropdown
        ticketComparisonSelect.innerHTML = '';
        Object.entries(appState.dualTickets).forEach(([key, ticket]) => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = `Ticket Pair ${ticket.id} (${ticket.reg})`;
            ticketComparisonSelect.appendChild(opt);
        });

        ticketComparisonSelect.onchange = (e) => {
            updateAnalytics(e.target.value);
        };
    }

    // --- SEARCH / FILTER GLOBALS ---
    const feedSearchInput = document.getElementById('feed-search');
    const mainSearchInput = document.getElementById('main-search');
    const btnViewAllFeed = document.getElementById('btn-view-all-feed');

    const filterFeed = () => {
        const query = (feedSearchInput?.value || mainSearchInput?.value || '').trim().toLowerCase();
        if (!query) {
            renderFeed(mockFeed);
            return;
        }

        const filtered = mockFeed.filter((t) =>
            t.id.toLowerCase().includes(query) ||
            t.reg.toLowerCase().includes(query) ||
            t.prod.toLowerCase().includes(query) ||
            t.status.toLowerCase().includes(query)
        );

        renderFeed(filtered);
    };

    if (feedSearchInput) feedSearchInput.oninput = filterFeed;
    if (mainSearchInput) mainSearchInput.oninput = filterFeed;

    if (btnViewAllFeed) {
        btnViewAllFeed.onclick = (e) => {
            e.preventDefault();
            if (feedSearchInput) feedSearchInput.value = '';
            if (mainSearchInput) mainSearchInput.value = '';
            renderFeed(mockFeed);
            showToast('Showing all feed entries');
        };
    }

    // --- CREATE ORDER SUBMIT & TABS LOGIC ---
    const comboProduct = document.getElementById('comboProductId');
    const comboStockpile = document.getElementById('comboStockPileId');
    const orderEstimatedMass = document.getElementById('orderEstimatedMass');
    const orderNoteContainer = document.getElementById('order-note-container');
    const orderNoteText = document.getElementById('order-note-text');
    const haulierError = document.getElementById('haulier-error');

    const showHaulierError = (message) => {
        if (!haulierError) return;
        haulierError.textContent = message;
        haulierError.hidden = !message;
    };

    const updateOrderMass = () => {
        const mass = parseFloat(orderEstimatedMass.value || 0);
        appState.totalOrderMass = mass;
        const totalMassEl = document.getElementById('displayTotalOrderMass');
        if (totalMassEl) totalMassEl.textContent = mass.toFixed(2) + ' t';
        updateMassDisplays();
    };

    if (comboProduct) {
        comboProduct.onchange = (e) => {
            const product = products.find(p => p.id == e.target.value);
            if (comboStockpile) {
                comboStockpile.innerHTML = '<option value="0">Select Stockpile...</option>';
                if (product) {
                    product.stockpiles.forEach((s, i) => {
                        const opt = document.createElement('option');
                        opt.value = i + 1;
                        opt.textContent = s;
                        comboStockpile.appendChild(opt);
                    });
                }
            }
            if (product && product.id == 10) {
                if (orderNoteContainer) orderNoteContainer.style.display = 'block';
                if (orderNoteText) orderNoteText.textContent = "Moisture adjustment factor (0.5%) will be applied to this product.";
            } else {
                if (orderNoteContainer) orderNoteContainer.style.display = 'none';
            }
        };
    }

    if (orderEstimatedMass) {
        orderEstimatedMass.oninput = updateOrderMass;
        orderEstimatedMass.onchange = updateOrderMass;
    }

    // Receipt / Dispatch Toggles
    document.querySelectorAll('input[name="IsReceipt"]').forEach(radio => {
        radio.onchange = (e) => {
            const isReceipt = e.target.value === '1';
            const customerCombo = document.getElementById('comboCustomerId');
            const supplierCombo = document.getElementById('comboSupplierId');
            if (customerCombo) customerCombo.disabled = isReceipt;
            if (supplierCombo) supplierCombo.disabled = !isReceipt;
            
            if (isReceipt) {
                if (customerCombo) customerCombo.value = userInfo.organisationId;
            } else {
                if (supplierCombo) supplierCombo.value = userInfo.organisationId;
            }
        };
    });

    // --- HAULIER LOGIC IN ORDER MODAL ---
    const haulierGrid = document.querySelector('#gridHaulierList tbody');

    const renderHaulierGrid = () => {
        if (!haulierGrid) return;
        haulierGrid.innerHTML = '';
        appState.hauliers.forEach((h, index) => {
            const vehicleCount = (appState.assignedVehicles[index] || []).length;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${h.name}</strong></td>
                <td>${parseFloat(h.mass).toFixed(2)} t</td>
                <td><button class="btn-text btn-manage-vehicles" data-index="${index}">${vehicleCount} Assigned</button></td>
                <td><button class="btn-text btn-delete-haulier" data-index="${index}"><i class="fa-solid fa-trash"></i></button></td>
            `;
            haulierGrid.appendChild(row);
        });

        document.querySelectorAll('.btn-manage-vehicles').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                openVehicleModal(Number(e.currentTarget.dataset.index));
            };
        });

        document.querySelectorAll('.btn-delete-haulier').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                removeHaulier(Number(e.currentTarget.dataset.index));
            };
        });
    };

    const removeHaulier = (index) => {
        appState.hauliers.splice(index, 1);
        const newAssigned = {};
        Object.entries(appState.assignedVehicles).forEach(([key, ids]) => {
            const keyNum = Number(key);
            if (keyNum === index) return;
            newAssigned[keyNum > index ? keyNum - 1 : keyNum] = ids;
        });
        appState.assignedVehicles = newAssigned;
        renderHaulierGrid();
        updateMassDisplays();
    };

    const saveHaulierBtn = document.getElementById('btn-save-haulier');
    if (saveHaulierBtn) {
        saveHaulierBtn.onclick = (e) => {
            e.preventDefault();
            const hSelect = document.getElementById('comboHaulierId');
            const massInput = document.getElementById('haulierEstimatedMass');
            const mass = parseFloat(massInput.value || 0);
            const allocated = appState.hauliers.reduce((sum, h) => sum + parseFloat(h.mass || 0), 0);
            const remaining = appState.totalOrderMass - allocated;

            if (mass <= 0) {
                showHaulierError('Please enter a valid estimated mass');
                return;
            }

            if (mass > remaining + 0.01) {
                showHaulierError('Allocated mass exceeds remaining order mass. Please reduce the allocation.');
                return;
            }

            showHaulierError('');

            const haulier = {
                id: hSelect.value,
                name: hSelect.selectedOptions[0].text,
                mass: mass,
                vehicles: 0
            };

            appState.hauliers.push(haulier);
            renderHaulierGrid();
            updateMassDisplays();
            document.getElementById('haulier-modal').style.display = 'none';
            massInput.value = '';
        };
    }

    // --- VEHICLE PICKER IN MODAL ---
    let activeHaulierIndex = -1;
    const openVehicleModal = (index) => {
        activeHaulierIndex = index;
        const vehicleModalTitle = document.getElementById('vehicle-modal-title');
        if (vehicleModalTitle) vehicleModalTitle.textContent = `Authorised Vehicles: ${appState.hauliers[index].name}`;
        document.getElementById('vehicle-modal').style.display = 'block';
        renderVehiclePickers();
    };

    const renderVehiclePickers = () => {
        const availList = document.getElementById('list-available');
        const assignedList = document.getElementById('list-assigned');
        const checkboxShowNonInducted = document.getElementById('checkboxShowNonInducted');
        if (!availList || !assignedList) return;
        
        const showOnlyInducted = checkboxShowNonInducted ? checkboxShowNonInducted.checked : true;
        const assignedIds = appState.assignedVehicles[activeHaulierIndex] || [];

        availList.innerHTML = '';
        assignedList.innerHTML = '';

        appState.availableVehicles.forEach(v => {
            if (showOnlyInducted && !v.inducted) return;
            const item = document.createElement('div');
            item.className = 'vehicle-item';
            item.innerHTML = `<span>${v.reg}</span> ${v.inducted ? '<span class="inducted-tag">Inducted</span>' : ''}`;
            item.onclick = () => toggleVehicle(v.id);

            if (assignedIds.includes(v.id)) {
                assignedList.appendChild(item);
            } else {
                availList.appendChild(item);
            }
        });

        const displayAvailable = document.getElementById('displayAvailableVehicles');
        const displayAssigned = document.getElementById('displayAssignedVehicles');
        if (displayAvailable) displayAvailable.textContent = availList.children.length;
        if (displayAssigned) displayAssigned.textContent = assignedList.children.length;
        renderHaulierGrid();
    };

    const toggleVehicle = (id) => {
        if (!appState.assignedVehicles[activeHaulierIndex]) appState.assignedVehicles[activeHaulierIndex] = [];
        const ids = appState.assignedVehicles[activeHaulierIndex];
        const idx = ids.indexOf(id);
        if (idx > -1) ids.splice(idx, 1); else ids.push(id);
        renderVehiclePickers();
    };

    const chkShowNonInducted = document.getElementById('checkboxShowNonInducted');
    if (chkShowNonInducted) {
        chkShowNonInducted.onchange = renderVehiclePickers;
    }

    const btnAssignAll = document.getElementById('btn-assign-all');
    if (btnAssignAll) {
        btnAssignAll.onclick = () => {
            if (activeHaulierIndex < 0) return;
            const includeNonInducted = chkShowNonInducted ? !chkShowNonInducted.checked : false;
            appState.assignedVehicles[activeHaulierIndex] = appState.availableVehicles
                .filter(v => includeNonInducted || v.inducted)
                .map(v => v.id);
            renderVehiclePickers();
        };
    }

    const btnRemoveAll = document.getElementById('btn-remove-all');
    if (btnRemoveAll) {
        btnRemoveAll.onclick = () => {
            if (activeHaulierIndex < 0) return;
            appState.assignedVehicles[activeHaulierIndex] = [];
            renderVehiclePickers();
        };
    }

    // --- SAVE ENTIRE CONTRACT ORDER ---
    const btnSaveOrder = document.getElementById('btn-save-order');
    if (btnSaveOrder) {
        btnSaveOrder.onclick = (e) => {
            e.preventDefault();
            const orderForm = document.getElementById('order-form');
            const formData = new FormData(orderForm);
            
            const isReceipt = formData.get('IsReceipt') === '1';
            const productId = formData.get('ProductId');
            const customerId = formData.get('CustomerId');
            const estimatedMass = parseFloat(orderEstimatedMass.value || 34.00);
            
            if (estimatedMass <= 0) {
                showToast('Please enter a valid estimated mass for the order.', 'error');
                return;
            }

            const product = products.find(p => p.id == productId) || { name: 'Unknown Product' };
            const clientName = isReceipt ? 'Sasol Mining' : (customerId == '101' ? 'Glencore Operations' : 'Exxaro Resources');
            
            const newOrder = {
                id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
                type: isReceipt ? 'Receipt' : 'Dispatch',
                product: product.name,
                target: estimatedMass,
                allocated: appState.hauliers.reduce((sum, h) => sum + parseFloat(h.mass || 0), 0),
                client: clientName,
                status: 'Approved'
            };

            appState.orders.unshift(newOrder);
            
            // Add notification alert
            appState.warnings.unshift({
                id: Date.now(),
                type: 'info',
                title: 'New Cargo Order Created',
                desc: `Order contract ${newOrder.id} (${newOrder.product}) approved and synced for customer ${newOrder.client}.`,
                time: 'Just now',
                read: false
            });

            updateNotificationBadge();
            showToast(`Order contract ${newOrder.id} successfully created!`);
            
            // Reset order inputs
            if (orderForm) {
                orderForm.reset();
                if (comboStockpile) comboStockpile.innerHTML = '<option value="0">Select Stockpile...</option>';
                if (orderNoteContainer) orderNoteContainer.style.display = 'none';
            }
            
            document.getElementById('order-modal').style.display = 'none';
            
            // Reset modal hauliers allocs
            appState.hauliers = [];
            appState.assignedVehicles = {};
            renderHaulierGrid();
            updateMassDisplays();

            // Refresh dashboards
            const activeOrdersEl = document.getElementById('kpi-active-orders');
            if (activeOrdersEl) activeOrdersEl.textContent = appState.orders.length;
            
            if (document.querySelector('.view-section.active').id === 'orders-view') {
                renderOrdersTable();
            }

            saveStateToLocalStorage();
        };
    }

    // --- INITIAL RUN ---
    renderFeed(mockFeed);
    renderGateEvents();
    updateAnalytics(1);
    updateNotificationBadge();
    
    // Set current date
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Launch simulation paths
    animateTelemetry();

    // Live simulator interval for data stream
    setInterval(() => {
        if (appState.simulationActive) {
            // Randomly push a static ticket to feed if simulation is active (separate from path movements)
            if (Math.random() > 0.65) {
                triggerSimulationEvent();
            }
        }
    }, appState.simulationInterval * 1000);
});
