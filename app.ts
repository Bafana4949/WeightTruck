// --- TYPE INTERFACES ---
interface Vehicle {
    id: number;
    reg: string;
    fleet: string;
    inducted: boolean;
    driver: string;
}

interface Order {
    id?: string;
    orderId?: string;
    type: string;
    product: string;
    target: number;
    allocated: number;
    client: string;
    status: string;
}

interface TicketDetail {
    no: string;
    src?: string;
    dest?: string;
    weight: number;
    time: string;
}

interface TicketPair {
    id: string;
    dispatch: TicketDetail;
    receipt: TicketDetail;
    variance: number;
    reg: string;
    prod: string;
    status: string;
}

interface Stockpile {
    id?: string;
    name: string;
    product: string;
    tons: number;
    capacity: number;
    color: string;
}

interface Warning {
    id: number;
    type: string;
    title: string;
    desc: string;
    time: string;
    read: boolean;
}

interface Product {
    id: number;
    name: string;
    stockpiles: string[];
}

interface Haulier {
    id: string;
    name: string;
    mass: number;
    vehicles: number;
}

interface GateEvent {
    reg: string;
    time: string;
    status: 'granted' | 'denied';
    msg: string;
    error?: boolean;
}

interface InventoryLog {
    time: string;
    target: string;
    product: string;
    mass: string;
    haulier: string;
    reg: string;
    verification: string;
}

interface AppState {
    allocatedMass: number;
    totalOrderMass: number;
    hauliers: Haulier[];
    availableVehicles: Vehicle[];
    assignedVehicles: { [key: number]: number[] };
    orders: Order[];
    dualTickets: { [key: number]: TicketPair };
    stockpiles: Stockpile[];
    warnings: Warning[];
    simulationActive: boolean;
    simulationInterval: number;
    varianceThreshold: number;
    ratePerTon: number;
    dailyTarget: number;
}

document.addEventListener('DOMContentLoaded', async () => {
    // --- API CONFIGURATION ---
    const BACKEND_URL = 'http://localhost:8080/api';
    let useBackend = false;

    // --- APP STATE (Initialize defaults) ---
    let appState: AppState = {
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
        assignedVehicles: {},
        
        orders: [
            { id: 'ORD-4029', type: 'Dispatch', product: 'Anthracite Pea', target: 34.00, allocated: 34.00, client: 'Glencore Operations', status: 'Approved' },
            { id: 'ORD-4030', type: 'Dispatch', product: 'RB1 Export', target: 120.00, allocated: 60.00, client: 'Exxaro Resources', status: 'Approved' },
            { id: 'ORD-4031', type: 'Receipt', product: 'Duff', target: 200.00, allocated: 150.00, client: 'Sasol Mining', status: 'Approved' },
            { id: 'ORD-4032', type: 'Receipt', product: 'Anthracite Pea', target: 50.00, allocated: 0.00, client: 'Sasol Mining', status: 'Pending' }
        ],

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

        stockpiles: [
            { id: 'sp1', name: 'Stockpile A', product: 'Anthracite Pea', tons: 5420, capacity: 10000, color: 'blue-fill' },
            { id: 'sp2', name: 'Stockpile B', product: 'RB1 Export', tons: 7850, capacity: 12000, color: 'amber-fill' },
            { id: 'sp3', name: 'Stockpile C', product: 'Duff', tons: 1950, capacity: 8000, color: 'cyan-fill' }
        ],

        warnings: [
            { id: 1, type: 'alert', title: 'Route Deviation Detected', desc: 'Vehicle NW-441-RT carrying RB1 Export departed from path corridor at 12:30.', time: '12 mins ago', read: false },
            { id: 2, type: 'info', title: 'Access Request Denied', desc: 'NW-441-RT denied gate access: Driver Themba Khumalo has an expired safety induction.', time: '25 mins ago', read: false },
            { id: 3, type: 'success', title: 'Intake Reconciled', desc: 'Ticket T-84210 fully reconciled with GLENCORE. Mass variance 1.2% within threshold.', time: '40 mins ago', read: true }
        ],

        simulationActive: true,
        simulationInterval: 15,
        varianceThreshold: 2.0,
        ratePerTon: 450.00,
        dailyTarget: 1300
    };

    const userInfo = {
        organisationId: 201,
        username: 'Irfan Zad'
    };

    const products: Product[] = [
        { id: 10, name: 'Anthracite Pea', stockpiles: ['Stockpile A', 'Stockpile B'] },
        { id: 11, name: 'RB1 Export', stockpiles: ['Export Bin 1', 'Export Bin 2'] },
        { id: 12, name: 'Duff', stockpiles: ['Duff Pile 1'] }
    ];

    // --- CHECK BACKEND CONNECTIVITY ---
    try {
        const testRes = await fetch(`${BACKEND_URL}/orders`);
        if (testRes.ok) {
            useBackend = true;
            console.log("TonTrac: Connected to Spring Boot backend!");
        }
    } catch (e) {
        console.warn("TonTrac: Backend unreachable. Falling back to local browser storage/simulation.");
    }

    // Load configurations from LocalStorage
    if (localStorage.getItem('wieghtruck_state')) {
        try {
            const savedState = JSON.parse(localStorage.getItem('wieghtruck_state') || '{}');
            appState.simulationActive = savedState.simulationActive ?? appState.simulationActive;
            appState.simulationInterval = savedState.simulationInterval ?? appState.simulationInterval;
            appState.varianceThreshold = savedState.varianceThreshold ?? appState.varianceThreshold;
            appState.ratePerTon = savedState.ratePerTon ?? appState.ratePerTon;
            appState.dailyTarget = savedState.dailyTarget ?? appState.dailyTarget;
        } catch (e) {
            console.error("Failed to load local config state:", e);
        }
    }

    const saveStateToLocalStorage = () => {
        localStorage.setItem('wieghtruck_state', JSON.stringify({
            simulationActive: appState.simulationActive,
            simulationInterval: appState.simulationInterval,
            varianceThreshold: appState.varianceThreshold,
            ratePerTon: appState.ratePerTon,
            dailyTarget: appState.dailyTarget
        }));
    };

    // --- TOAST SYSTEM ---
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
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

    if (useBackend) {
        showToast("Connected to Spring Boot backend API successfully!", "success");
    } else {
        showToast("Running in local demo mode (Spring Boot offline)", "success");
    }

    // --- VIEW ROUTER ---
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    const switchView = (viewName: string) => {
        navItems.forEach(item => {
            const htmlItem = item as HTMLElement;
            if (htmlItem.dataset.view === viewName) {
                htmlItem.classList.add('active');
            } else {
                htmlItem.classList.remove('active');
            }
        });

        viewSections.forEach(section => {
            if (section.id === `${viewName}-view`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        if (viewName === 'orders') renderOrdersTable();
        if (viewName === 'logistics') renderTransitVehicles();
        if (viewName === 'inventory') renderInventoryTab();
        if (viewName === 'reports') renderReportsCharts();
        if (viewName === 'settings') renderSettingsTab();
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const htmlItem = item as HTMLElement;
            const view = htmlItem.dataset.view;
            if (!view) return;
            e.preventDefault();
            switchView(view);
        });
    });

    // --- UTILS & CORE DISPLAYS ---
    const updateMassDisplays = () => {
        const allocated = appState.hauliers.reduce((sum, h) => sum + parseFloat((h.mass || 0).toString()), 0);
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
    const setupModal = (modalId: string, triggerBtnId: string | null) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        if (triggerBtnId) {
            const trigger = document.getElementById(triggerBtnId);
            if (trigger) {
                trigger.onclick = (e) => {
                    e.preventDefault();
                    modal.style.display = 'block';
                };
            }
        }
        
        const closers = modal.querySelectorAll('.close-modal');
        closers.forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = (e) => {
                e.preventDefault();
                modal.style.display = 'none';
            };
        });
        
        window.addEventListener('click', (e) => {
            if (e.target == modal) modal.style.display = 'none';
        });
    };

    setupModal('order-modal', 'btn-create-order');
    setupModal('order-modal', 'btn-create-order-tab');
    setupModal('haulier-modal', 'btn-add-haulier');
    setupModal('vehicle-modal', null);

    const tabGeneralBtn = document.querySelector('[data-tab="general"]') as HTMLElement | null;
    const tabHauliersBtn = document.querySelector('[data-tab="hauliers"]') as HTMLElement | null;
    
    if (tabGeneralBtn && tabHauliersBtn) {
        tabGeneralBtn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tabGeneralBtn.classList.add('active');
            document.getElementById('tab-general')?.classList.add('active');
        };
        tabHauliersBtn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tabHauliersBtn.classList.add('active');
            document.getElementById('tab-hauliers')?.classList.add('active');
        };
    }

    // --- MOCK TRANSIT & SIMULATED GPS CORRIDOR ---
    let mockFeed = [
        { id: 'T-84210', reg: 'GP-142-TR', prod: 'Anthracite Pea', gross: '54.20 t', net: '34.10 t', time: '12:15', status: 'Complete' },
        { id: 'T-84211', reg: 'MP-990-CL', prod: 'RB1 Export', gross: '48.15 t', net: '28.05 t', time: '12:28', status: 'In Progress' },
        { id: 'T-84212', reg: 'NW-441-RT', prod: 'RB1 Export', gross: '62.40 t', net: '43.12 t', time: '12:35', status: 'Variance Flagged' }
    ];

    let mockGateEvents: GateEvent[] = [
        { reg: 'L-008-MN', time: '12:12', status: 'granted', msg: 'Induction valid. Order active.' },
        { reg: 'NW-441-RT', time: '12:25', status: 'denied', msg: 'Missing driver induction.', error: true },
        { reg: 'GP-772-XL', time: '12:31', status: 'granted', msg: 'License valid. Access granted.' }
    ];

    let recentInventoryLogs: InventoryLog[] = [
        { time: '12:15', target: 'Stockpile A', product: 'Anthracite Pea', mass: '34.10 t', haulier: 'Unitrans Supply Chain', reg: 'GP-142-TR', verification: 'Accepted' },
        { time: '11:42', target: 'Stockpile B', product: 'RB1 Export', mass: '28.05 t', haulier: 'Barloworld Logistics', reg: 'MP-990-CL', verification: 'Accepted' },
        { time: '10:15', target: 'Stockpile C', product: 'Duff', mass: '33.69 t', haulier: 'Imperial Logistics', reg: 'L-008-MN', verification: 'Accepted' },
        { time: '09:30', target: 'Stockpile B', product: 'RB1 Export', mass: '43.12 t', haulier: 'Unitrans Supply Chain', reg: 'NW-441-RT', verification: 'Variance Flagged' }
    ];

    const weeklyTonnages = [1180, 1420, 940, 1280, 1240, 480, 220]; // Mon-Sun
    const productTonnages = {
        'Anthracite Pea': 540,
        'RB1 Export': 480,
        'Duff': 220
    };

    // --- GATE ACCESS SIMULATION RENDERING ---
    const renderGateEvents = async () => {
        const gateFeed = document.getElementById('gate-feed');
        if (!gateFeed) return;
        gateFeed.innerHTML = '';
        
        let logs: GateEvent[] = mockGateEvents;
        if (useBackend) {
            try {
                const res = await fetch(`${BACKEND_URL}/telemetry/gate-logs`);
                if (res.ok) logs = await res.json();
            } catch (e) {
                console.error("Failed to load gate logs from backend:", e);
            }
        }

        logs.forEach(e => {
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
    const renderFeed = async (overrideItems: any[] | null = null) => {
        const feed = document.getElementById('weighbridge-feed');
        if (!feed) return;
        feed.innerHTML = '';
        
        let items = overrideItems;
        if (!items) {
            if (useBackend) {
                try {
                    const res = await fetch(`${BACKEND_URL}/telemetry/tickets`);
                    if (res.ok) {
                        const tickets = await res.json();
                        items = tickets.map((t: any) => ({
                            id: t.ticketId,
                            reg: t.reg,
                            prod: t.prod,
                            gross: t.gross.toFixed(2) + ' t',
                            net: t.net.toFixed(2) + ' t',
                            time: t.time,
                            status: t.status
                        }));
                    }
                } catch (e) {
                    console.error("Failed to fetch tickets from backend:", e);
                }
            }
            if (!items) items = mockFeed;
        }

        items.forEach((t) => {
            const row = document.createElement('tr');
            let badgeClass = 'pending';
            if (t.status === 'Complete' || t.status === 'Accepted') badgeClass = 'complete';
            if (t.status === 'In Progress') badgeClass = 'in-progress';
            if (t.status === 'Variance Flagged' || t.status === 'Review Req') badgeClass = 'variance-flagged';
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
    const notificationDrawer = document.getElementById('notification-drawer') as HTMLElement;
    const notificationBellBtn = document.getElementById('notification-bell-btn');
    const closeNotificationDrawerBtn = document.getElementById('close-notification-drawer-btn');
    const notificationDrawerContent = document.getElementById('notification-drawer-content');
    const notificationBadge = document.getElementById('notification-badge');

    const updateNotificationBadge = () => {
        const unreadCount = appState.warnings.filter(w => !w.read).length;
        if (notificationBadge) {
            notificationBadge.textContent = unreadCount.toString();
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
            
            item.onclick = () => {
                w.read = true;
                item.classList.add('read');
                const badge = item.querySelector('.inducted-tag');
                if (badge) badge.remove();
                updateNotificationBadge();
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
    const movingTruck = document.getElementById('moving-truck') as HTMLElement | null;
    const movingTruckReg = document.getElementById('moving-truck-reg');
    const movingTruckStatus = document.getElementById('moving-truck-status');
    const movingTruckDeviation = document.getElementById('moving-truck-deviation');
    const svgRouteLine = document.getElementById('svg-route-line') as any;
    
    let pathProgress = 0;
    let telemetrySpeed = 0.15;
    let isTransitioning = false;

    const animateTelemetry = () => {
        if (!movingTruck || !svgRouteLine || !appState.simulationActive) return;
        
        const pathLength = svgRouteLine.getTotalLength();
        
        if (pathProgress < 100) {
            pathProgress += telemetrySpeed;
            const distance = (pathProgress / 100) * pathLength;
            const pt = svgRouteLine.getPointAtLength(distance);
            
            movingTruck.style.left = pt.x + '%';
            movingTruck.style.top = pt.y + '%';
            
            if (pathProgress > 15 && pathProgress < 80) {
                if (movingTruckStatus) movingTruckStatus.textContent = 'En Route';
                if (movingTruckDeviation) {
                    movingTruckDeviation.textContent = 'No Deviations';
                    movingTruckDeviation.className = 'status-ok';
                }
            }
        } else if (!isTransitioning) {
            isTransitioning = true;
            if (movingTruckStatus) movingTruckStatus.textContent = 'At Weighbridge';
            
            setTimeout(() => {
                triggerSimulationEvent();
                pathProgress = 0;
                isTransitioning = false;
            }, 3000);
        }
        
        requestAnimationFrame(animateTelemetry);
    };

    // --- SIMULATION DATABASE TRIGGER ---
    const triggerSimulationEvent = async () => {
        const vehicle = appState.availableVehicles[Math.floor(Math.random() * appState.availableVehicles.length)];
        const product = products[Math.floor(Math.random() * products.length)];
        
        const targetWeight = 34.00 + (Math.random() * 8 - 4);
        const varianceVal = parseFloat((Math.random() * 3).toFixed(1));
        const receiptWeight = targetWeight * (1 - (varianceVal / 100));
        
        const newTicketId = 'T-' + Math.floor(80000 + Math.random() * 10000);
        let ticketStatus = 'Complete';
        
        if (varianceVal > appState.varianceThreshold) {
            ticketStatus = 'Variance Flagged';
            const newWarning: Warning = {
                id: Date.now(),
                type: 'alert',
                title: 'Mass Variance Triggered',
                desc: `Vehicle ${vehicle.reg} carrying ${product.name} flagged: variance of ${varianceVal}% exceeds ${appState.varianceThreshold}%.`,
                time: 'Just now',
                read: false
            };
            appState.warnings.unshift(newWarning);
            updateNotificationBadge();
            showToast(`Variance Alarm! Vehicle ${vehicle.reg} exceeded threshold!`, 'error');
            
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
            
            const targetSP = appState.stockpiles.find(sp => sp.product === product.name);
            if (targetSP) {
                targetSP.tons = Math.min(targetSP.capacity, targetSP.tons + receiptWeight);
            }
            
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

        const ticketData = {
            ticketId: newTicketId,
            reg: vehicle.reg,
            prod: product.name,
            gross: parseFloat((receiptWeight * 1.45).toFixed(2)),
            net: parseFloat(receiptWeight.toFixed(2)),
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            status: ticketStatus
        };

        if (useBackend) {
            try {
                await fetch(`${BACKEND_URL}/telemetry/tickets`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ticketData)
                });
            } catch (e) {
                console.error("Failed to post ticket to backend:", e);
            }
        } else {
            mockFeed.unshift({
                id: ticketData.ticketId,
                reg: ticketData.reg,
                prod: ticketData.prod,
                gross: ticketData.gross + ' t',
                net: ticketData.net + ' t',
                time: ticketData.time,
                status: ticketData.status
            });
            if (mockFeed.length > 8) mockFeed.pop();
        }
        
        // Gate control log simulation
        const isGranted = Math.random() > 0.15;
        const gateLog: GateEvent = {
            reg: appState.availableVehicles[Math.floor(Math.random() * appState.availableVehicles.length)].reg,
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            status: isGranted ? 'granted' : 'denied',
            msg: isGranted ? 'Access cleared. Induction and Order verified.' : 'Access denied: Missing valid site induction.',
            error: !isGranted
        };

        if (useBackend) {
            try {
                await fetch(`${BACKEND_URL}/telemetry/gate-logs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(gateLog)
                });
            } catch (e) {
                console.error("Failed to save gate log to backend:", e);
            }
        } else {
            mockGateEvents.unshift(gateLog);
            if (mockGateEvents.length > 5) mockGateEvents.pop();
        }

        renderFeed();
        renderGateEvents();
        
        const activeView = document.querySelector('.view-section.active');
        if (activeView && activeView.id === 'inventory-view') renderInventoryTab();
    };

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
    
    const renderOrdersTable = async () => {
        if (!ordersListBody) return;
        ordersListBody.innerHTML = '';
        
        let orders = appState.orders;
        if (useBackend) {
            try {
                const res = await fetch(`${BACKEND_URL}/orders`);
                if (res.ok) {
                    orders = await res.json();
                    appState.orders = orders;
                }
            } catch (e) {
                console.error("Failed to fetch orders from backend:", e);
            }
        }

        const searchInput = document.getElementById('orders-search') as HTMLInputElement;
        const filterVal = (searchInput?.value || '').trim().toLowerCase();
        const filtered = orders.filter(o => 
            (o.orderId || o.id || '').toLowerCase().includes(filterVal) ||
            (o.product || '').toLowerCase().includes(filterVal) ||
            (o.client || '').toLowerCase().includes(filterVal)
        );

        if (filtered.length === 0) {
            ordersListBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No orders found.</td></tr>';
            return;
        }

        filtered.forEach(o => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${o.orderId || o.id}</strong></td>
                <td>${o.type}</td>
                <td>${o.product}</td>
                <td>${o.client}</td>
                <td>${o.target.toFixed(2)} t</td>
                <td>${o.allocated.toFixed(2)} t</td>
                <td><span class="status-badge ${o.status === 'Approved' ? 'complete' : 'pending'}">${o.status}</span></td>
                <td>
                    <button class="btn-text btn-delete-order" data-id="${o.orderId || o.id}"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>
            `;
            ordersListBody.appendChild(row);
        });

        document.querySelectorAll('.btn-delete-order').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = async (e) => {
                const id = htmlBtn.dataset.id;
                if (useBackend) {
                    try {
                        await fetch(`${BACKEND_URL}/orders/${id}`, { method: 'DELETE' });
                        showToast(`Order ${id} removed successfully`);
                        renderOrdersTable();
                    } catch (e) {
                        console.error("Failed to delete order from backend:", e);
                    }
                } else {
                    appState.orders = appState.orders.filter(o => (o.id !== id && o.orderId !== id));
                    renderOrdersTable();
                    showToast(`Order ${id} removed successfully`);
                }
            };
        });
    };

    const ordersSearchInput = document.getElementById('orders-search') as HTMLInputElement | null;
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
            const location = v.inducted ? `Route Point ${String.fromCharCode(65 + index)}` : 'Terminal Gate A';
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
                    <button class="btn-text btn-ping" data-reg="${v.reg}"><i class="fa-solid fa-satellite-dish"></i> Ping</button>
                </td>
            `;
            transitVehiclesList.appendChild(row);
        });

        document.querySelectorAll('.btn-ping').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = () => {
                alert(`Pinged telemetry box on vehicle ${htmlBtn.dataset.reg}. Latency 12ms. GPS locked.`);
            };
        });
    };

    // --- VIEW 4: INVENTORY LEVELS RENDERING ---
    const stockpilesGridContainer = document.getElementById('stockpiles-grid-container');
    const inventoryLogsBody = document.getElementById('inventory-logs-body');

    const renderInventoryTab = async () => {
        if (!stockpilesGridContainer || !inventoryLogsBody) return;
        
        let stockpiles = appState.stockpiles;
        if (useBackend) {
            try {
                const res = await fetch(`${BACKEND_URL}/stockpiles`);
                if (res.ok) {
                    stockpiles = await res.json();
                    appState.stockpiles = stockpiles;
                }
            } catch (e) {
                console.error("Failed to fetch stockpiles from backend:", e);
            }
        }

        // Draw cards
        stockpilesGridContainer.innerHTML = '';
        stockpiles.forEach(sp => {
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

        // Logs
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
                <td><span class="status-badge ${log.verification === 'Accepted' || log.verification === 'Complete' ? 'complete' : 'variance-flagged'}">${log.verification}</span></td>
            `;
            inventoryLogsBody.appendChild(row);
        });
    };

    // --- VIEW 5: REPORTS & CHART RENDER ---
    const renderReportsCharts = () => {
        const linePath = document.getElementById('chart-line-path');
        const areaPath = document.getElementById('chart-area-path');
        const pointsGroup = document.getElementById('chart-points-group');
        const labelsGroup = document.getElementById('chart-labels-group');

        if (linePath && pointsGroup) {
            pointsGroup.innerHTML = '';
            if (labelsGroup) labelsGroup.innerHTML = '';
            
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const xOffset = 50;
            const width = 520;
            const height = 150;
            const maxVal = Math.max(...weeklyTonnages) * 1.1;

            let pathCoords: string[] = [];
            
            days.forEach((day, index) => {
                const x = xOffset + (width / (days.length - 1)) * index;
                const tonnage = weeklyTonnages[index];
                const y = 180 - (tonnage / maxVal) * height;

                pathCoords.push(`${x},${y}`);

                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x.toString());
                circle.setAttribute('cy', y.toString());
                circle.setAttribute('class', 'chart-point');
                
                circle.addEventListener('mouseover', (e: any) => {
                    const tooltip = document.getElementById('chart-tooltip');
                    if (tooltip) {
                        tooltip.style.display = 'block';
                        tooltip.innerHTML = `<strong>${day}</strong>: ${tonnage} t`;
                        
                        const rect = e.target.getBoundingClientRect();
                        const wrapper = document.querySelector('.chart-wrapper');
                        if (wrapper) {
                            const containerRect = wrapper.getBoundingClientRect();
                            tooltip.style.left = (rect.left - containerRect.left - 20) + 'px';
                            tooltip.style.top = (rect.top - containerRect.top - 35) + 'px';
                        }
                    }
                });

                circle.addEventListener('mouseout', () => {
                    const tooltip = document.getElementById('chart-tooltip');
                    if (tooltip) tooltip.style.display = 'none';
                });

                pointsGroup.appendChild(circle);

                if (labelsGroup) {
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', x.toString());
                    text.setAttribute('y', '205');
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('class', 'chart-axis-text');
                    text.textContent = day;
                    labelsGroup.appendChild(text);
                }
            });

            linePath.setAttribute('d', `M${pathCoords.join(' L')}`);
            if (areaPath) {
                areaPath.setAttribute('d', `M50,180 L${pathCoords.join(' L')} L${xOffset + width},180 Z`);
            }
        }

        const barChartContent = document.getElementById('bar-chart-content');
        if (barChartContent) {
            barChartContent.innerHTML = '';
            
            const prodKeys = Object.keys(productTonnages) as ('Anthracite Pea' | 'RB1 Export' | 'Duff')[];
            const xOffset = 50;
            const barWidth = 35;
            const chartHeight = 130;
            const maxVal = Math.max(...Object.values(productTonnages)) * 1.1;

            prodKeys.forEach((key, index) => {
                const x = xOffset + 60 * index;
                const value = productTonnages[key];
                const barHeight = (value / maxVal) * chartHeight;
                const y = 180 - barHeight;

                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x.toString());
                rect.setAttribute('y', y.toString());
                rect.setAttribute('width', barWidth.toString());
                rect.setAttribute('height', barHeight.toString());
                rect.setAttribute('class', 'chart-bar');
                
                if (key === 'Anthracite Pea') rect.style.fill = 'var(--primary-blue)';
                if (key === 'RB1 Export') rect.style.fill = 'var(--primary-amber)';
                if (key === 'Duff') rect.style.fill = 'var(--primary-cyan)';

                const textVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                textVal.setAttribute('x', (x + barWidth/2).toString());
                textVal.setAttribute('y', (y - 8).toString());
                textVal.setAttribute('text-anchor', 'middle');
                textVal.setAttribute('class', 'chart-axis-text');
                textVal.style.fill = '#ffffff';
                textVal.style.fontWeight = '700';
                textVal.textContent = value + 't';

                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', (x + barWidth/2).toString());
                label.setAttribute('y', '205');
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('class', 'chart-axis-text');
                label.textContent = key.split(' ')[0];

                barChartContent.appendChild(rect);
                barChartContent.appendChild(textVal);
                barChartContent.appendChild(label);
            });
        }
    };

    // --- VIEW 6: SETTINGS VIEW CONTROLLERS ---
    const toggleSimSwitch = document.getElementById('settings-toggle-simulation') as HTMLInputElement | null;
    const simSpeedRange = document.getElementById('settings-simulation-speed') as HTMLInputElement | null;
    const varThresholdInput = document.getElementById('settings-variance-threshold') as HTMLInputElement | null;
    const ratePerTonInput = document.getElementById('settings-rate-per-ton') as HTMLInputElement | null;
    const dailyTargetInput = document.getElementById('settings-daily-target') as HTMLInputElement | null;
    const saveSettingsBtn = document.getElementById('btn-save-settings');

    const renderSettingsTab = () => {
        if (toggleSimSwitch) toggleSimSwitch.checked = appState.simulationActive;
        if (simSpeedRange) simSpeedRange.value = appState.simulationInterval.toString();
        if (varThresholdInput) varThresholdInput.value = appState.varianceThreshold.toString();
        if (ratePerTonInput) ratePerTonInput.value = appState.ratePerTon.toString();
        if (dailyTargetInput) dailyTargetInput.value = appState.dailyTarget.toString();
    };

    if (saveSettingsBtn) {
        saveSettingsBtn.onclick = (e) => {
            e.preventDefault();
            
            if (toggleSimSwitch) appState.simulationActive = toggleSimSwitch.checked;
            if (simSpeedRange) appState.simulationInterval = parseInt(simSpeedRange.value);
            if (varThresholdInput) appState.varianceThreshold = parseFloat(varThresholdInput.value);
            if (ratePerTonInput) appState.ratePerTon = parseFloat(ratePerTonInput.value);
            if (dailyTargetInput) appState.dailyTarget = parseFloat(dailyTargetInput.value);
            
            saveStateToLocalStorage();
            showToast("Configurations saved successfully!");
            
            const telemetryToggleBtn = document.getElementById('telemetry-toggle-btn');
            if (telemetryToggleBtn) {
                telemetryToggleBtn.classList.toggle('active', appState.simulationActive);
            }
        };
    }

    // --- DUAL TICKET COMPARE CONTROLLER ---
    const updateAnalytics = (id: number) => {
        const data = appState.dualTickets[id];
        if (!data) return;

        const dNo = document.getElementById('disp-no');
        const dSrc = document.getElementById('disp-src');
        const dWt = document.getElementById('disp-weight');
        const dTm = document.getElementById('disp-time');
        
        const rNo = document.getElementById('rect-no');
        const rDest = document.getElementById('rect-dest');
        const rWt = document.getElementById('rect-weight');
        const rTm = document.getElementById('rect-time');

        const vVal = document.getElementById('variance-val');
        const statusEl = document.getElementById('variance-status');

        if (dNo) dNo.textContent = data.dispatch.no;
        if (dSrc) dSrc.textContent = data.dispatch.src || '';
        if (dWt) dWt.textContent = data.dispatch.weight.toFixed(2) + ' t';
        if (dTm) dTm.textContent = data.dispatch.time;
        
        if (rNo) rNo.textContent = data.receipt.no;
        if (rDest) rDest.textContent = data.receipt.dest || '';
        if (rWt) rWt.textContent = data.receipt.weight.toFixed(2) + ' t';
        if (rTm) rTm.textContent = data.receipt.time;

        if (vVal) vVal.textContent = data.variance.toFixed(1) + '%';
        
        if (statusEl) {
            if (data.variance < appState.varianceThreshold) {
                statusEl.textContent = 'ACCEPTED';
                statusEl.className = 'variance-status ok';
            } else {
                statusEl.textContent = 'REVIEW REQ';
                statusEl.className = 'variance-status warning';
            }
        }
    };

    const ticketComparisonSelect = document.getElementById('ticket-comparison-select') as HTMLSelectElement | null;
    if (ticketComparisonSelect) {
        ticketComparisonSelect.innerHTML = '';
        Object.entries(appState.dualTickets).forEach(([key, ticket]) => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = `Ticket Pair ${ticket.id} (${ticket.reg})`;
            ticketComparisonSelect.appendChild(opt);
        });

        ticketComparisonSelect.onchange = (e: any) => {
            updateAnalytics(Number(e.target.value));
        };
    }

    // --- SEARCH / FILTER GLOBALS ---
    const feedSearchInput = document.getElementById('feed-search') as HTMLInputElement | null;
    const mainSearchInput = document.getElementById('main-search') as HTMLInputElement | null;
    const btnViewAllFeed = document.getElementById('btn-view-all-feed');

    const filterFeed = () => {
        const query = (feedSearchInput?.value || mainSearchInput?.value || '').trim().toLowerCase();
        if (!query) {
            renderFeed();
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
            renderFeed();
            showToast('Showing all feed entries');
        };
    }

    // --- CREATE ORDER SUBMIT & TABS LOGIC ---
    const comboProduct = document.getElementById('comboProductId') as HTMLSelectElement | null;
    const comboStockpile = document.getElementById('comboStockPileId') as HTMLSelectElement | null;
    const orderEstimatedMass = document.getElementById('orderEstimatedMass') as HTMLInputElement | null;
    const orderNoteContainer = document.getElementById('order-note-container') as HTMLElement | null;
    const orderNoteText = document.getElementById('order-note-text');
    const haulierError = document.getElementById('haulier-error');

    const showHaulierError = (message: string) => {
        if (!haulierError) return;
        haulierError.textContent = message;
        haulierError.hidden = !message;
    };

    const updateOrderMass = () => {
        if (!orderEstimatedMass) return;
        const mass = parseFloat(orderEstimatedMass.value || '0');
        appState.totalOrderMass = mass;
        const totalMassEl = document.getElementById('displayTotalOrderMass');
        if (totalMassEl) totalMassEl.textContent = mass.toFixed(2) + ' t';
        updateMassDisplays();
    };

    if (comboProduct) {
        comboProduct.onchange = (e: any) => {
            const product = products.find(p => p.id == e.target.value);
            if (comboStockpile) {
                comboStockpile.innerHTML = '<option value="0">Select Stockpile...</option>';
                if (product) {
                    product.stockpiles.forEach((s, i) => {
                        const opt = document.createElement('option');
                        opt.value = (i + 1).toString();
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

    document.querySelectorAll('input[name="IsReceipt"]').forEach(radio => {
        const htmlRadio = radio as HTMLInputElement;
        htmlRadio.onchange = (e: any) => {
            const isReceipt = e.target.value === '1';
            const customerCombo = document.getElementById('comboCustomerId') as HTMLSelectElement | null;
            const supplierCombo = document.getElementById('comboSupplierId') as HTMLSelectElement | null;
            if (customerCombo) customerCombo.disabled = isReceipt;
            if (supplierCombo) supplierCombo.disabled = !isReceipt;
            
            if (isReceipt) {
                if (customerCombo) customerCombo.value = userInfo.organisationId.toString();
            } else {
                if (supplierCombo) supplierCombo.value = userInfo.organisationId.toString();
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
                <td>${parseFloat(h.mass.toString()).toFixed(2)} t</td>
                <td><button class="btn-text btn-manage-vehicles" data-index="${index}">${vehicleCount} Assigned</button></td>
                <td><button class="btn-text btn-delete-haulier" data-index="${index}"><i class="fa-solid fa-trash"></i></button></td>
            `;
            haulierGrid.appendChild(row);
        });

        document.querySelectorAll('.btn-manage-vehicles').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = (e) => {
                e.preventDefault();
                openVehicleModal(Number(htmlBtn.dataset.index));
            };
        });

        document.querySelectorAll('.btn-delete-haulier').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = (e) => {
                e.preventDefault();
                removeHaulier(Number(htmlBtn.dataset.index));
            };
        });
    };

    const removeHaulier = (index: number) => {
        appState.hauliers.splice(index, 1);
        const newAssigned: { [key: number]: number[] } = {};
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
            const hSelect = document.getElementById('comboHaulierId') as HTMLSelectElement;
            const massInput = document.getElementById('haulierEstimatedMass') as HTMLInputElement;
            const mass = parseFloat(massInput.value || '0');
            const allocated = appState.hauliers.reduce((sum, h) => sum + parseFloat(h.mass.toString()), 0);
            const remaining = appState.totalOrderMass - allocated;

            if (mass <= 0) {
                showHaulierError('Please enter a valid estimated mass');
                return;
            }

            if (mass > remaining + 0.01) {
                showHaulierError('Allocated mass exceeds remaining order mass.');
                return;
            }

            showHaulierError('');

            const haulier: Haulier = {
                id: hSelect.value,
                name: hSelect.selectedOptions[0].text,
                mass: mass,
                vehicles: 0
            };

            appState.hauliers.push(haulier);
            renderHaulierGrid();
            updateMassDisplays();
            const modal = document.getElementById('haulier-modal');
            if (modal) modal.style.display = 'none';
            massInput.value = '';
        };
    }

    // --- VEHICLE PICKER IN MODAL ---
    let activeHaulierIndex = -1;
    const openVehicleModal = (index: number) => {
        activeHaulierIndex = index;
        const vehicleModalTitle = document.getElementById('vehicle-modal-title');
        if (vehicleModalTitle) vehicleModalTitle.textContent = `Authorised Vehicles: ${appState.hauliers[index].name}`;
        const modal = document.getElementById('vehicle-modal');
        if (modal) modal.style.display = 'block';
        renderVehiclePickers();
    };

    const renderVehiclePickers = () => {
        const availList = document.getElementById('list-available');
        const assignedList = document.getElementById('list-assigned');
        const checkboxShowNonInducted = document.getElementById('checkboxShowNonInducted') as HTMLInputElement | null;
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
        if (displayAvailable) displayAvailable.textContent = availList.children.length.toString();
        if (displayAssigned) displayAssigned.textContent = assignedList.children.length.toString();
        renderHaulierGrid();
    };

    const toggleVehicle = (id: number) => {
        if (!appState.assignedVehicles[activeHaulierIndex]) appState.assignedVehicles[activeHaulierIndex] = [];
        const ids = appState.assignedVehicles[activeHaulierIndex];
        const idx = ids.indexOf(id);
        if (idx > -1) ids.splice(idx, 1); else ids.push(id);
        renderVehiclePickers();
    };

    const chkShowNonInducted = document.getElementById('checkboxShowNonInducted') as HTMLInputElement | null;
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
        btnSaveOrder.onclick = async (e) => {
            e.preventDefault();
            const orderForm = document.getElementById('order-form') as HTMLFormElement;
            const formData = new FormData(orderForm);
            
            const isReceipt = formData.get('IsReceipt') === '1';
            const productId = formData.get('ProductId');
            const customerId = formData.get('CustomerId');
            const estimatedMass = orderEstimatedMass ? parseFloat(orderEstimatedMass.value || '34.00') : 34.00;
            
            if (estimatedMass <= 0) {
                showToast('Please enter a valid estimated mass for the order.', 'error');
                return;
            }

            const product = products.find(p => p.id == Number(productId)) || { name: 'Unknown Product' };
            const clientName = isReceipt ? 'Sasol Mining' : (customerId == '101' ? 'Glencore Operations' : 'Exxaro Resources');
            
            const orderData: Order = {
                orderId: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
                type: isReceipt ? 'Receipt' : 'Dispatch',
                product: product.name,
                target: estimatedMass,
                allocated: appState.hauliers.reduce((sum, h) => sum + parseFloat(h.mass.toString()), 0),
                client: clientName,
                status: 'Approved'
            };

            if (useBackend) {
                try {
                    await fetch(`${BACKEND_URL}/orders`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData)
                    });
                    showToast(`Order contract ${orderData.orderId} created on Spring Boot!`);
                } catch (e) {
                    console.error("Failed to post order to backend:", e);
                }
            } else {
                appState.orders.unshift({
                    id: orderData.orderId,
                    type: orderData.type,
                    product: orderData.product,
                    target: orderData.target,
                    allocated: orderData.allocated,
                    client: orderData.client,
                    status: orderData.status
                });
                showToast(`Order contract ${orderData.orderId} successfully created!`);
            }
            
            appState.warnings.unshift({
                id: Date.now(),
                type: 'info',
                title: 'New Cargo Order Created',
                desc: `Order contract ${orderData.orderId} (${orderData.product}) approved and synced.`,
                time: 'Just now',
                read: false
            });

            updateNotificationBadge();
            
            if (orderForm) {
                orderForm.reset();
                if (comboStockpile) comboStockpile.innerHTML = '<option value="0">Select Stockpile...</option>';
                if (orderNoteContainer) orderNoteContainer.style.display = 'none';
            }
            
            const orderModal = document.getElementById('order-modal');
            if (orderModal) orderModal.style.display = 'none';
            
            appState.hauliers = [];
            appState.assignedVehicles = {};
            renderHaulierGrid();
            updateMassDisplays();

            const activeSection = document.querySelector('.view-section.active');
            if (activeSection && activeSection.id === 'orders-view') {
                renderOrdersTable();
            } else {
                const activeOrdersEl = document.getElementById('kpi-active-orders');
                if (activeOrdersEl) {
                    if (useBackend) {
                        const res = await fetch(`${BACKEND_URL}/orders`);
                        if (res.ok) activeOrdersEl.textContent = (await res.json()).length.toString();
                    } else {
                        activeOrdersEl.textContent = appState.orders.length.toString();
                    }
                }
            }

            saveStateToLocalStorage();
        };
    }

    // --- INITIAL RUN ---
    await renderFeed();
    await renderGateEvents();
    updateAnalytics(1);
    updateNotificationBadge();
    
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    animateTelemetry();

    setInterval(() => {
        if (appState.simulationActive) {
            if (Math.random() > 0.65) {
                triggerSimulationEvent();
            }
        }
    }, appState.simulationInterval * 1000);
});
