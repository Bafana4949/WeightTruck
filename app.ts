// --- TYPE INTERFACES ---
interface Vehicle {
    id: number;
    reg: string;
    fleet: string;
    inducted: boolean;
    driver: string;
    haulier?: string;
    type?: string;
    maxLegalWeight?: number;
    complianceStatus?: string;
    gpsDeviceId?: string;
    active?: boolean;
}

interface Site {
    id?: number;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    operatingHours: string;
    accessRules: string;
}

interface Driver {
    id?: number;
    name: string;
    idNumber: string;
    licenseNumber: string;
    inductionStatus: string;
    assignedHaulier: string;
    active: boolean;
    medicalExpiryDate: string;
    trainingExpiryDate: string;
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
    mass?: number;
    vehicles?: number;
    email?: string;
    phone?: string;
    complianceStatus?: string;
    active?: boolean;
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
    sites: Site[];
    drivers: Driver[];
    vehicles: Vehicle[];
    masterHauliers: Haulier[];
    activeRole: string;
}

document.addEventListener('DOMContentLoaded', async () => {
    // --- API CONFIGURATION ---
    const BACKEND_URL = 'http://localhost:8080/api';
    let useBackend = false;

    // --- LOCAL STORAGE MOCK DATA ---
    let localSites = [
        { id: 1, name: 'Goedehoop Colliery', type: 'MINE', latitude: -26.2483, longitude: 29.3512, operatingHours: '06:00 - 22:00', accessRules: 'PPE & Safety Induction Required' },
        { id: 2, name: 'Main Weighbridge 01', type: 'WEIGHBRIDGE', latitude: -26.2512, longitude: 29.3540, operatingHours: '24 Hours', accessRules: 'Speed limit 10km/h' },
        { id: 3, name: 'Stockpile B Yard', type: 'STOCKPILE', latitude: -26.2580, longitude: 29.3620, operatingHours: '06:00 - 18:00', accessRules: 'High-visibility vest required' },
        { id: 4, name: 'Sasolburg Depot', type: 'CUSTOMER_SITE', latitude: -26.8167, longitude: 27.8333, operatingHours: '08:00 - 17:00', accessRules: 'Delivery note required' }
    ];

    let localDrivers = [
        { id: 1, name: 'Musa Ndiaye', idNumber: '9208125555081', licenseNumber: 'DR-ML12345', inductionStatus: 'Active', assignedHaulier: 'Unitrans Supply Chain', active: true, medicalExpiryDate: '2027-05-15', trainingExpiryDate: '2027-05-15' },
        { id: 2, name: 'Jaco Pretorius', idNumber: '8801125555082', licenseNumber: 'DR-ML12346', inductionStatus: 'Active', assignedHaulier: 'Barloworld Logistics', active: true, medicalExpiryDate: '2026-12-15', trainingExpiryDate: '2026-12-15' },
        { id: 3, name: 'Themba Khumalo', idNumber: '9504125555083', licenseNumber: 'DR-ML12347', inductionStatus: 'Expired', assignedHaulier: 'Imperial Logistics', active: true, medicalExpiryDate: '2025-05-15', trainingExpiryDate: '2025-05-15' },
        { id: 4, name: 'Sarah Jenkins', idNumber: '9111125555084', licenseNumber: 'DR-ML12348', inductionStatus: 'Active', assignedHaulier: 'Unitrans Supply Chain', active: true, medicalExpiryDate: '2026-08-15', trainingExpiryDate: '2026-08-15' },
        { id: 5, name: 'Piet de Wet', idNumber: '8507125555085', licenseNumber: 'DR-ML12349', inductionStatus: 'Active', assignedHaulier: 'Exxaro Haul', active: true, medicalExpiryDate: '2027-02-15', trainingExpiryDate: '2027-02-15' }
    ];

    let localHauliers = [
        { id: '501', name: 'Unitrans Supply Chain', email: 'info@unitrans.co.za', phone: '+27 11 780 2000', complianceStatus: 'Compliant', active: true },
        { id: '502', name: 'Barloworld Logistics', email: 'info@barloworld.co.za', phone: '+27 11 445 1000', complianceStatus: 'Compliant', active: true },
        { id: '503', name: 'Imperial Logistics', email: 'info@imperial.co.za', phone: '+27 11 372 9000', complianceStatus: 'Review Required', active: true }
    ];

    // --- APP STATE (Initialize defaults) ---
    let appState: AppState = {
        allocatedMass: 0,
        totalOrderMass: 34.00,
        hauliers: [],
        availableVehicles: [
            { id: 1, reg: 'GP-142-TR', fleet: 'V01', inducted: true, driver: 'Musa Ndiaye', haulier: 'Unitrans Supply Chain', type: 'TRUCK', maxLegalWeight: 50, complianceStatus: 'Compliant', gpsDeviceId: 'GPS-V-101', active: true },
            { id: 2, reg: 'MP-990-CL', fleet: 'V02', inducted: true, driver: 'Jaco Pretorius', haulier: 'Barloworld Logistics', type: 'TRUCK', maxLegalWeight: 50, complianceStatus: 'Compliant', gpsDeviceId: 'GPS-V-102', active: true },
            { id: 3, reg: 'NW-441-RT', fleet: 'V03', inducted: false, driver: 'Themba Khumalo', haulier: 'Imperial Logistics', type: 'TRUCK', maxLegalWeight: 50, complianceStatus: 'Non-Compliant', gpsDeviceId: 'GPS-V-103', active: true },
            { id: 4, reg: 'L-008-MN', fleet: 'V04', inducted: true, driver: 'Sarah Jenkins', haulier: 'Unitrans Supply Chain', type: 'TRUCK', maxLegalWeight: 50, complianceStatus: 'Compliant', gpsDeviceId: 'GPS-V-104', active: true },
            { id: 5, reg: 'GP-772-XL', fleet: 'V05', inducted: true, driver: 'Piet de Wet', haulier: 'Exxaro Haul', type: 'TRUCK', maxLegalWeight: 50, complianceStatus: 'Compliant', gpsDeviceId: 'GPS-V-105', active: true }
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
        dailyTarget: 1300,
        sites: localSites,
        drivers: localDrivers,
        vehicles: [
            { id: 1, reg: 'GP-142-TR', fleet: 'V01', inducted: true, driver: 'Musa Ndiaye', haulier: 'Unitrans Supply Chain', type: 'TRUCK', maxLegalWeight: 50, complianceStatus: 'Compliant', gpsDeviceId: 'GPS-V-101', active: true },
            { id: 2, reg: 'MP-990-CL', fleet: 'V02', inducted: true, driver: 'Jaco Pretorius', haulier: 'Barloworld Logistics', type: 'TRUCK', maxLegalWeight: 50, complianceStatus: 'Compliant', gpsDeviceId: 'GPS-V-102', active: true },
            { id: 3, reg: 'NW-441-RT', fleet: 'V03', inducted: false, driver: 'Themba Khumalo', haulier: 'Imperial Logistics', type: 'TRUCK', maxLegalWeight: 50, complianceStatus: 'Non-Compliant', gpsDeviceId: 'GPS-V-103', active: true },
            { id: 4, reg: 'L-008-MN', fleet: 'V04', inducted: true, driver: 'Sarah Jenkins', haulier: 'Unitrans Supply Chain', type: 'TRUCK', maxLegalWeight: 50, complianceStatus: 'Compliant', gpsDeviceId: 'GPS-V-104', active: true },
            { id: 5, reg: 'GP-772-XL', fleet: 'V05', inducted: true, driver: 'Piet de Wet', haulier: 'Exxaro Haul', type: 'TRUCK', maxLegalWeight: 50, complianceStatus: 'Compliant', gpsDeviceId: 'GPS-V-105', active: true }
        ],
        masterHauliers: localHauliers,
        activeRole: 'Mine Manager'
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
    const savedStateStr = localStorage.getItem('weightruck_state') || localStorage.getItem('wieghtruck_state');
    if (savedStateStr) {
        try {
            const savedState = JSON.parse(savedStateStr);
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
        localStorage.setItem('weightruck_state', JSON.stringify({
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

    // --- THEME TOGGLE LOGIC ---
    const themeBtn = document.getElementById('theme-toggle-btn');
    const updateThemeIcon = () => {
        if (!themeBtn) return;
        const icon = themeBtn.querySelector('i');
        if (!icon) return;
        if (document.body.classList.contains('light-theme')) {
            icon.className = 'fa-solid fa-sun';
            themeBtn.setAttribute('title', 'Switch to Dark Theme');
        } else {
            icon.className = 'fa-solid fa-moon';
            themeBtn.setAttribute('title', 'Switch to Light Theme');
        }
    };

    if (themeBtn) {
        updateThemeIcon();
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('weightruck_theme', isLight ? 'light' : 'dark');
            updateThemeIcon();
            showToast(`Switched to ${isLight ? 'Light' : 'Dark'} Theme`, 'success');
        });
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
        if (viewName === 'sites') renderSitesTab();
        if (viewName === 'fleets') renderFleetsTab();
        if (viewName === 'weighbridge-sim') initWeighbridgeSim();
        if (viewName === 'reconciliation') renderReconciliationTab();
        if (viewName === 'alerts-center') renderAlertsCenterTab();
        if (viewName === 'billing') renderBillingTab();
        if (viewName === 'driver-portal') initDriverPortal();
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
        const allocated = appState.hauliers.reduce((sum, h) => sum + (h.mass ?? 0), 0);
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
    setupModal('site-crud-modal', null);
    setupModal('haulier-crud-modal', null);
    setupModal('vehicle-crud-modal', null);
    setupModal('driver-crud-modal', null);

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
                <td>${(h.mass ?? 0).toFixed(2)} t</td>
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
            const allocated = appState.hauliers.reduce((sum, h) => sum + (h.mass ?? 0), 0);
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
                allocated: appState.hauliers.reduce((sum, h) => sum + (h.mass ?? 0), 0),
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

    // --- EXIT DRIVER VIEW FLOATING BUTTON ---
    let btnExitDriverView = document.getElementById('btn-exit-driver-view') as HTMLButtonElement | null;
    if (!btnExitDriverView) {
        btnExitDriverView = document.createElement('button');
        btnExitDriverView.id = 'btn-exit-driver-view';
        btnExitDriverView.className = 'btn-exit-driver-view';
        btnExitDriverView.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Exit Driver View';
        btnExitDriverView.style.position = 'fixed';
        btnExitDriverView.style.bottom = '20px';
        btnExitDriverView.style.right = '20px';
        btnExitDriverView.style.zIndex = '9999';
        btnExitDriverView.style.backgroundColor = 'var(--primary-amber, #f97316)';
        btnExitDriverView.style.color = '#ffffff';
        btnExitDriverView.style.border = 'none';
        btnExitDriverView.style.padding = '12px 20px';
        btnExitDriverView.style.borderRadius = '50px';
        btnExitDriverView.style.boxShadow = '0 4px 20px rgba(249, 115, 22, 0.4)';
        btnExitDriverView.style.cursor = 'pointer';
        btnExitDriverView.style.fontWeight = '600';
        btnExitDriverView.style.display = 'none';
        document.body.appendChild(btnExitDriverView);

        btnExitDriverView.onclick = (e) => {
            e.preventDefault();
            const switcher = document.getElementById('role-switcher-select') as HTMLSelectElement | null;
            if (switcher) {
                switcher.value = 'Mine Manager';
                appState.activeRole = 'Mine Manager';
                applyRolePermissions('Mine Manager');
                switchView('dashboard');
                showToast("Returned to Mine Manager workspace");
            }
        };
    }

    // --- ROLE-BASED ACCESS CONTROL (RBAC) ---
    const applyRolePermissions = (role: string) => {
        const sidebar = document.querySelector('.sidebar') as HTMLElement | null;
        const topBar = document.querySelector('.top-bar') as HTMLElement | null;
        const mainContent = document.querySelector('.main-content') as HTMLElement | null;
        const roleSelect = document.getElementById('role-switcher-select') as HTMLSelectElement | null;
        const profileRole = document.getElementById('profile-user-role');
        
        if (roleSelect) roleSelect.value = role;
        if (profileRole) profileRole.textContent = role;

        if (role === 'Driver') {
            if (sidebar) sidebar.style.display = 'none';
            if (topBar) topBar.style.display = 'none';
            if (mainContent) {
                mainContent.style.marginLeft = '0';
                mainContent.style.padding = '0';
                mainContent.style.width = '100vw';
                mainContent.style.maxWidth = '100vw';
            }
            switchView('driver-portal');
            if (btnExitDriverView) btnExitDriverView.style.display = 'block';
        } else {
            if (sidebar) sidebar.style.display = '';
            if (topBar) topBar.style.display = '';
            if (mainContent) {
                mainContent.style.marginLeft = '';
                mainContent.style.padding = '';
                mainContent.style.width = '';
                mainContent.style.maxWidth = '';
            }
            if (btnExitDriverView) btnExitDriverView.style.display = 'none';
            
            const activeView = document.querySelector('.view-section.active');
            if (activeView && activeView.id === 'driver-portal-view') {
                switchView('dashboard');
            }
        }

        const roleViews: { [key: string]: string[] } = {
            'Super Admin': ['dashboard', 'orders', 'logistics', 'inventory', 'reports', 'sites', 'fleets', 'weighbridge-sim', 'reconciliation', 'alerts-center', 'billing', 'settings'],
            'Mine Manager': ['dashboard', 'orders', 'logistics', 'inventory', 'reports', 'sites', 'fleets', 'weighbridge-sim', 'reconciliation', 'alerts-center', 'billing', 'settings'],
            'Weighbridge Operator': ['dashboard', 'orders', 'logistics', 'inventory', 'weighbridge-sim', 'alerts-center', 'settings'],
            'Transport Manager': ['dashboard', 'logistics', 'fleets', 'reconciliation', 'billing', 'settings'],
            'Compliance Officer': ['dashboard', 'fleets', 'alerts-center', 'settings'],
            'Customer': ['dashboard', 'billing', 'settings'],
            'Driver': ['driver-portal']
        };

        const allowed = roleViews[role] || [];
        const navItemsList = document.querySelectorAll('.sidebar .nav-item');
        navItemsList.forEach(item => {
            const htmlItem = item as HTMLElement;
            const view = htmlItem.dataset.view;
            if (htmlItem.classList.contains('logout')) return;
            if (view && allowed.includes(view)) {
                htmlItem.style.display = '';
            } else {
                htmlItem.style.display = 'none';
            }
        });

        const dividers = document.querySelectorAll('.sidebar .nav-divider');
        dividers.forEach(div => {
            const htmlDiv = div as HTMLElement;
            const group = htmlDiv.dataset.group;
            if (group === 'master-data') {
                const hasMaster = allowed.includes('sites') || allowed.includes('fleets');
                htmlDiv.style.display = hasMaster ? '' : 'none';
            } else if (group === 'control') {
                const hasControl = allowed.includes('weighbridge-sim') || allowed.includes('reconciliation') || allowed.includes('alerts-center') || allowed.includes('billing');
                htmlDiv.style.display = hasControl ? '' : 'none';
            }
        });

        toggleWriteControls(role !== 'Customer');
    };

    const toggleWriteControls = (enable: boolean) => {
        const writeButtons = [
            'btn-create-order',
            'btn-create-order-tab',
            'btn-create-site',
            'btn-create-fleet-item',
            'btn-add-haulier',
            'btn-save-settings',
            'btn-sim-submit-ticket'
        ];
        writeButtons.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = enable ? '' : 'none';
        });

        const listActionButtons = document.querySelectorAll('.btn-delete-order, .btn-delete-haulier, .btn-manage-vehicles, .btn-save-site-crud, .btn-save-haulier-crud, .btn-save-vehicle-crud, .btn-save-driver-crud');
        listActionButtons.forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.style.display = enable ? '' : 'none';
        });
    };

    // --- SITES CRUD CONTROLLER ---
    const renderSitesTab = async () => {
        const listBody = document.getElementById('sites-list-body');
        if (!listBody) return;
        listBody.innerHTML = '';

        let sites = appState.sites;
        if (useBackend) {
            try {
                const res = await fetch(`${BACKEND_URL}/sites`);
                if (res.ok) {
                    sites = await res.json();
                    appState.sites = sites;
                }
            } catch (e) {
                console.error("Failed to fetch sites from backend:", e);
            }
        }

        const searchInput = document.getElementById('sites-search') as HTMLInputElement | null;
        const filterVal = (searchInput?.value || '').trim().toLowerCase();
        const filtered = sites.filter(s => 
            (s.name || '').toLowerCase().includes(filterVal) ||
            (s.type || '').toLowerCase().includes(filterVal)
        );

        if (filtered.length === 0) {
            listBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No sites found.</td></tr>';
            return;
        }

        const isCustomer = appState.activeRole === 'Customer';

        filtered.forEach(s => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${s.name}</strong></td>
                <td><span class="status-badge complete" style="background:var(--primary-blue-glow); color:var(--primary-blue); font-size:0.75rem;">${s.type}</span></td>
                <td><span style="font-family:var(--font-mono); font-size:0.85rem;">${s.latitude.toFixed(4)}, ${s.longitude.toFixed(4)}</span></td>
                <td>${s.operatingHours}</td>
                <td>${s.accessRules}</td>
                <td>
                    ${isCustomer ? '' : `
                    <button class="btn-text btn-edit-site" data-id="${s.id}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button class="btn-text btn-delete-site" style="color:var(--status-danger);" data-id="${s.id}"><i class="fa-solid fa-trash"></i> Delete</button>
                    `}
                </td>
            `;
            listBody.appendChild(row);
        });

        document.querySelectorAll('.btn-edit-site').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = () => {
                const siteId = Number(htmlBtn.dataset.id);
                const site = appState.sites.find(s => s.id === siteId);
                if (site) {
                    openSiteCrudModal(site);
                }
            };
        });

        document.querySelectorAll('.btn-delete-site').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = async () => {
                const siteId = Number(htmlBtn.dataset.id);
                if (confirm("Are you sure you want to delete this site?")) {
                    if (useBackend) {
                        try {
                            const res = await fetch(`${BACKEND_URL}/sites/${siteId}`, { method: 'DELETE' });
                            if (res.ok) {
                                showToast("Site deleted successfully!");
                                await renderSitesTab();
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    } else {
                        appState.sites = appState.sites.filter(s => s.id !== siteId);
                        showToast("Site deleted successfully!");
                        await renderSitesTab();
                    }
                }
            };
        });
    };

    const openSiteCrudModal = (site?: Site) => {
        const modal = document.getElementById('site-crud-modal');
        if (!modal) return;
        const title = document.getElementById('site-modal-title');
        const form = document.getElementById('site-crud-form') as HTMLFormElement;
        if (form) form.reset();

        if (site) {
            if (title) title.textContent = "Edit Site Details";
            (document.getElementById('site-crud-id') as HTMLInputElement).value = (site.id || '').toString();
            (document.getElementById('site-crud-name') as HTMLInputElement).value = site.name;
            (document.getElementById('site-crud-type') as HTMLSelectElement).value = site.type;
            (document.getElementById('site-crud-lat') as HTMLInputElement).value = site.latitude.toString();
            (document.getElementById('site-crud-lng') as HTMLInputElement).value = site.longitude.toString();
            (document.getElementById('site-crud-hours') as HTMLInputElement).value = site.operatingHours;
            (document.getElementById('site-crud-rules') as HTMLInputElement).value = site.accessRules;
        } else {
            if (title) title.textContent = "Register New Site";
            (document.getElementById('site-crud-id') as HTMLInputElement).value = "";
        }
        modal.style.display = 'block';
    };

    const btnCreateSite = document.getElementById('btn-create-site');
    if (btnCreateSite) {
        btnCreateSite.onclick = (e) => {
            e.preventDefault();
            openSiteCrudModal();
        };
    }

    const btnSaveSiteCrud = document.getElementById('btn-save-site-crud');
    if (btnSaveSiteCrud) {
        btnSaveSiteCrud.onclick = async (e) => {
            e.preventDefault();
            const idVal = (document.getElementById('site-crud-id') as HTMLInputElement).value;
            const nameVal = (document.getElementById('site-crud-name') as HTMLInputElement).value;
            const typeVal = (document.getElementById('site-crud-type') as HTMLSelectElement).value;
            const latVal = parseFloat((document.getElementById('site-crud-lat') as HTMLInputElement).value || '0');
            const lngVal = parseFloat((document.getElementById('site-crud-lng') as HTMLInputElement).value || '0');
            const hoursVal = (document.getElementById('site-crud-hours') as HTMLInputElement).value;
            const rulesVal = (document.getElementById('site-crud-rules') as HTMLInputElement).value;

            if (!nameVal) {
                showToast("Please enter a site name", "error");
                return;
            }

            const siteData: Site = {
                name: nameVal,
                type: typeVal,
                latitude: latVal,
                longitude: lngVal,
                operatingHours: hoursVal,
                accessRules: rulesVal
            };

            if (idVal) {
                siteData.id = Number(idVal);
            }

            if (useBackend) {
                try {
                    const url = idVal ? `${BACKEND_URL}/sites/${idVal}` : `${BACKEND_URL}/sites`;
                    const method = idVal ? 'PUT' : 'POST';
                    const res = await fetch(url, {
                        method: method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(siteData)
                    });
                    if (res.ok) {
                        showToast(idVal ? "Site updated successfully!" : "Site registered successfully!");
                        document.getElementById('site-crud-modal')!.style.display = 'none';
                        await renderSitesTab();
                    }
                } catch (e) {
                    console.error(e);
                }
            } else {
                if (idVal) {
                    const idx = appState.sites.findIndex(s => s.id === Number(idVal));
                    if (idx > -1) {
                        appState.sites[idx] = { ...siteData, id: Number(idVal) };
                    }
                } else {
                    siteData.id = appState.sites.length > 0 ? Math.max(...appState.sites.map(s => s.id || 0)) + 1 : 1;
                    appState.sites.push(siteData);
                }
                showToast(idVal ? "Site updated successfully!" : "Site registered successfully!");
                document.getElementById('site-crud-modal')!.style.display = 'none';
                await renderSitesTab();
            }
        };
    }

    const sitesSearch = document.getElementById('sites-search') as HTMLInputElement | null;
    if (sitesSearch) {
        sitesSearch.oninput = () => renderSitesTab();
    }

    // --- FLEETS & DRIVERS CRUD CONTROLLERS ---
    let activeFleetTab = 'hauliers';
    const setupFleetTabs = () => {
        const fleetTabs = document.querySelectorAll('[data-fleet-tab]');
        const fleetPanes = document.querySelectorAll('.fleet-tab-content');

        fleetTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                fleetTabs.forEach(t => t.classList.remove('active'));
                fleetPanes.forEach(p => {
                    const htmlPane = p as HTMLElement;
                    htmlPane.classList.remove('active');
                    htmlPane.style.display = 'none';
                });

                const htmlTab = tab as HTMLElement;
                htmlTab.classList.add('active');
                activeFleetTab = htmlTab.dataset.fleetTab || 'hauliers';

                const activePane = document.getElementById(`fleet-tab-${activeFleetTab}`);
                if (activePane) {
                    activePane.classList.add('active');
                    activePane.style.display = 'block';
                }

                renderFleetActiveTab();
            });
        });
    };

    const renderFleetActiveTab = () => {
        if (activeFleetTab === 'hauliers') renderHauliersFleetTab();
        if (activeFleetTab === 'vehicles') renderVehiclesFleetTab();
        if (activeFleetTab === 'drivers') renderDriversFleetTab();
    };

    const renderFleetsTab = () => {
        renderFleetActiveTab();
    };

    const btnCreateFleetItem = document.getElementById('btn-create-fleet-item');
    if (btnCreateFleetItem) {
        btnCreateFleetItem.onclick = (e) => {
            e.preventDefault();
            if (activeFleetTab === 'hauliers') {
                openHaulierCrudModal();
            } else if (activeFleetTab === 'vehicles') {
                openVehicleCrudModal();
            } else if (activeFleetTab === 'drivers') {
                openDriverCrudModal();
            }
        };
    }

    // A. Haulier Tab
    const renderHauliersFleetTab = async () => {
        const listBody = document.getElementById('hauliers-list-body');
        if (!listBody) return;
        listBody.innerHTML = '';

        let hauliers = appState.masterHauliers;
        if (useBackend) {
            try {
                const res = await fetch(`${BACKEND_URL}/hauliers`);
                if (res.ok) {
                    hauliers = await res.json();
                    appState.masterHauliers = hauliers;
                    populateHaulierDropdowns();
                }
            } catch (e) {
                console.error(e);
            }
        }

        const searchInput = document.getElementById('hauliers-search') as HTMLInputElement | null;
        const filterVal = (searchInput?.value || '').trim().toLowerCase();
        const filtered = hauliers.filter(h => 
            (h.name || '').toLowerCase().includes(filterVal) ||
            (h.email || '').toLowerCase().includes(filterVal)
        );

        if (filtered.length === 0) {
            listBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No hauliers found.</td></tr>';
            return;
        }

        const isCustomer = appState.activeRole === 'Customer';

        filtered.forEach(h => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${h.name}</strong></td>
                <td>${h.email || ''}</td>
                <td>${h.phone || ''}</td>
                <td><span class="status-badge ${h.complianceStatus === 'Compliant' ? 'complete' : 'variance-flagged'}">${h.complianceStatus || 'Compliant'}</span></td>
                <td><span class="status-badge ${h.active ? 'complete' : 'pending'}">${h.active ? 'Yes' : 'No'}</span></td>
                <td>
                    ${isCustomer ? '' : `
                    <button class="btn-text btn-edit-haulier-row" data-id="${h.id}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button class="btn-text btn-delete-haulier-row" style="color:var(--status-danger);" data-id="${h.id}"><i class="fa-solid fa-trash"></i> Delete</button>
                    `}
                </td>
            `;
            listBody.appendChild(row);
        });

        document.querySelectorAll('.btn-edit-haulier-row').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = () => {
                const hId = htmlBtn.dataset.id;
                const haulier = appState.masterHauliers.find(h => h.id === hId);
                if (haulier) openHaulierCrudModal(haulier);
            };
        });

        document.querySelectorAll('.btn-delete-haulier-row').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = async () => {
                const hId = htmlBtn.dataset.id;
                if (confirm("Are you sure you want to delete this haulier?")) {
                    if (useBackend) {
                        try {
                            const res = await fetch(`${BACKEND_URL}/hauliers/${hId}`, { method: 'DELETE' });
                            if (res.ok) {
                                showToast("Haulier deleted successfully!");
                                await renderHauliersFleetTab();
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    } else {
                        appState.masterHauliers = appState.masterHauliers.filter(h => h.id !== hId);
                        populateHaulierDropdowns();
                        showToast("Haulier deleted successfully!");
                        await renderHauliersFleetTab();
                    }
                }
            };
        });
    };

    const openHaulierCrudModal = (h?: Haulier) => {
        const modal = document.getElementById('haulier-crud-modal');
        if (!modal) return;
        const title = document.getElementById('haulier-crud-modal-title');
        const form = document.getElementById('haulier-crud-form') as HTMLFormElement;
        if (form) form.reset();

        if (h) {
            if (title) title.textContent = "Edit Haulier Details";
            (document.getElementById('haulier-crud-id') as HTMLInputElement).value = h.id;
            (document.getElementById('haulier-crud-name') as HTMLInputElement).value = h.name;
            (document.getElementById('haulier-crud-email') as HTMLInputElement).value = h.email || '';
            (document.getElementById('haulier-crud-phone') as HTMLInputElement).value = h.phone || '';
            (document.getElementById('haulier-crud-compliance') as HTMLSelectElement).value = h.complianceStatus || 'Compliant';
        } else {
            if (title) title.textContent = "Register New Haulier";
            (document.getElementById('haulier-crud-id') as HTMLInputElement).value = "";
        }
        modal.style.display = 'block';
    };

    const btnSaveHaulierCrud = document.getElementById('btn-save-haulier-crud');
    if (btnSaveHaulierCrud) {
        btnSaveHaulierCrud.onclick = async (e) => {
            e.preventDefault();
            const idVal = (document.getElementById('haulier-crud-id') as HTMLInputElement).value;
            const nameVal = (document.getElementById('haulier-crud-name') as HTMLInputElement).value;
            const emailVal = (document.getElementById('haulier-crud-email') as HTMLInputElement).value;
            const phoneVal = (document.getElementById('haulier-crud-phone') as HTMLInputElement).value;
            const complianceVal = (document.getElementById('haulier-crud-compliance') as HTMLSelectElement).value;

            if (!nameVal) {
                showToast("Please enter a company name", "error");
                return;
            }

            const hData: Haulier = {
                id: idVal || 'H-' + Math.floor(100 + Math.random() * 900),
                name: nameVal,
                mass: 0,
                vehicles: 0,
                email: emailVal,
                phone: phoneVal,
                complianceStatus: complianceVal,
                active: true
            };

            if (useBackend) {
                try {
                    const url = idVal ? `${BACKEND_URL}/hauliers/${idVal}` : `${BACKEND_URL}/hauliers`;
                    const method = idVal ? 'PUT' : 'POST';
                    const res = await fetch(url, {
                        method: method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(hData)
                    });
                    if (res.ok) {
                        showToast(idVal ? "Haulier updated successfully!" : "Haulier registered successfully!");
                        document.getElementById('haulier-crud-modal')!.style.display = 'none';
                        await renderHauliersFleetTab();
                    }
                } catch (e) {
                    console.error(e);
                }
            } else {
                if (idVal) {
                    const idx = appState.masterHauliers.findIndex(h => h.id === idVal);
                    if (idx > -1) {
                        appState.masterHauliers[idx] = hData;
                    }
                } else {
                    appState.masterHauliers.push(hData);
                }
                populateHaulierDropdowns();
                showToast(idVal ? "Haulier updated successfully!" : "Haulier registered successfully!");
                document.getElementById('haulier-crud-modal')!.style.display = 'none';
                await renderHauliersFleetTab();
            }
        };
    }

    const hauliersSearch = document.getElementById('hauliers-search') as HTMLInputElement | null;
    if (hauliersSearch) {
        hauliersSearch.oninput = () => renderHauliersFleetTab();
    }

    // B. Vehicle Tab
    const renderVehiclesFleetTab = async () => {
        const listBody = document.getElementById('vehicles-list-body');
        if (!listBody) return;
        listBody.innerHTML = '';

        let vehicles = appState.availableVehicles;
        if (useBackend) {
            try {
                const res = await fetch(`${BACKEND_URL}/vehicles`);
                if (res.ok) {
                    vehicles = await res.json();
                    appState.availableVehicles = vehicles;
                }
            } catch (e) {
                console.error(e);
            }
        }

        const searchInput = document.getElementById('vehicles-search') as HTMLInputElement | null;
        const filterVal = (searchInput?.value || '').trim().toLowerCase();
        const filtered = vehicles.filter(v => 
            (v.reg || '').toLowerCase().includes(filterVal) ||
            (v.haulier || '').toLowerCase().includes(filterVal)
        );

        if (filtered.length === 0) {
            listBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No vehicles found.</td></tr>';
            return;
        }

        const isCustomer = appState.activeRole === 'Customer';

        filtered.forEach(v => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${v.reg}</strong></td>
                <td>${v.fleet || ''}</td>
                <td>${v.haulier || ''}</td>
                <td>${v.type || 'TRUCK'}</td>
                <td>${(v.maxLegalWeight || 50.0).toFixed(1)} t</td>
                <td><span class="status-badge ${v.complianceStatus === 'Compliant' ? 'complete' : 'variance-flagged'}">${v.complianceStatus || 'Compliant'}</span></td>
                <td><span style="font-family:var(--font-mono); font-size:0.85rem;">${v.gpsDeviceId || ''}</span></td>
                <td>
                    ${isCustomer ? '' : `
                    <button class="btn-text btn-edit-vehicle-row" data-id="${v.id}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button class="btn-text btn-delete-vehicle-row" style="color:var(--status-danger);" data-id="${v.id}"><i class="fa-solid fa-trash"></i> Delete</button>
                    `}
                </td>
            `;
            listBody.appendChild(row);
        });

        document.querySelectorAll('.btn-edit-vehicle-row').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = () => {
                const vId = Number(htmlBtn.dataset.id);
                const vehicle = appState.availableVehicles.find(v => v.id === vId);
                if (vehicle) openVehicleCrudModal(vehicle);
            };
        });

        document.querySelectorAll('.btn-delete-vehicle-row').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = async () => {
                const vId = Number(htmlBtn.dataset.id);
                if (confirm("Are you sure you want to delete this vehicle?")) {
                    if (useBackend) {
                        try {
                            const res = await fetch(`${BACKEND_URL}/vehicles/${vId}`, { method: 'DELETE' });
                            if (res.ok) {
                                showToast("Vehicle deleted successfully!");
                                await renderVehiclesFleetTab();
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    } else {
                        appState.availableVehicles = appState.availableVehicles.filter(v => v.id !== vId);
                        showToast("Vehicle deleted successfully!");
                        await renderVehiclesFleetTab();
                    }
                }
            };
        });
    };

    const openVehicleCrudModal = (v?: Vehicle) => {
        const modal = document.getElementById('vehicle-crud-modal');
        if (!modal) return;
        const title = document.getElementById('vehicle-crud-modal-title');
        const form = document.getElementById('vehicle-crud-form') as HTMLFormElement;
        if (form) form.reset();

        populateHaulierDropdowns();

        if (v) {
            if (title) title.textContent = "Edit Vehicle Details";
            (document.getElementById('vehicle-crud-id') as HTMLInputElement).value = v.id.toString();
            (document.getElementById('vehicle-crud-reg') as HTMLInputElement).value = v.reg;
            (document.getElementById('vehicle-crud-fleet') as HTMLInputElement).value = v.fleet || '';
            (document.getElementById('vehicle-crud-haulier') as HTMLSelectElement).value = appState.masterHauliers.find(h => h.name === v.haulier)?.id || "";
            (document.getElementById('vehicle-crud-type') as HTMLSelectElement).value = v.type || 'TRUCK';
            (document.getElementById('vehicle-crud-weight') as HTMLInputElement).value = (v.maxLegalWeight || 50.0).toString();
            (document.getElementById('vehicle-crud-compliance') as HTMLSelectElement).value = v.complianceStatus || 'Compliant';
            (document.getElementById('vehicle-crud-gps') as HTMLInputElement).value = v.gpsDeviceId || '';
        } else {
            if (title) title.textContent = "Register New Vehicle";
            (document.getElementById('vehicle-crud-id') as HTMLInputElement).value = "";
        }
        modal.style.display = 'block';
    };

    const btnSaveVehicleCrud = document.getElementById('btn-save-vehicle-crud');
    if (btnSaveVehicleCrud) {
        btnSaveVehicleCrud.onclick = async (e) => {
            e.preventDefault();
            const idVal = (document.getElementById('vehicle-crud-id') as HTMLInputElement).value;
            const regVal = (document.getElementById('vehicle-crud-reg') as HTMLInputElement).value;
            const fleetVal = (document.getElementById('vehicle-crud-fleet') as HTMLInputElement).value;
            const hSelect = document.getElementById('vehicle-crud-haulier') as HTMLSelectElement;
            const haulierVal = hSelect.selectedOptions[0]?.text || '';
            const typeVal = (document.getElementById('vehicle-crud-type') as HTMLSelectElement).value;
            const weightVal = parseFloat((document.getElementById('vehicle-crud-weight') as HTMLInputElement).value || '50.0');
            const complianceVal = (document.getElementById('vehicle-crud-compliance') as HTMLSelectElement).value;
            const gpsVal = (document.getElementById('vehicle-crud-gps') as HTMLInputElement).value;

            if (!regVal) {
                showToast("Please enter a registration number", "error");
                return;
            }

            const vData: Vehicle = {
                id: idVal ? Number(idVal) : Date.now(),
                reg: regVal,
                fleet: fleetVal,
                inducted: complianceVal === 'Compliant',
                driver: 'Unassigned',
                haulier: haulierVal,
                type: typeVal,
                maxLegalWeight: weightVal,
                complianceStatus: complianceVal,
                gpsDeviceId: gpsVal,
                active: true
            };

            if (useBackend) {
                try {
                    const url = idVal ? `${BACKEND_URL}/vehicles/${idVal}` : `${BACKEND_URL}/vehicles`;
                    const method = idVal ? 'PUT' : 'POST';
                    const res = await fetch(url, {
                        method: method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(vData)
                    });
                    if (res.ok) {
                        showToast(idVal ? "Vehicle updated successfully!" : "Vehicle registered successfully!");
                        document.getElementById('vehicle-crud-modal')!.style.display = 'none';
                        await renderVehiclesFleetTab();
                    }
                } catch (e) {
                    console.error(e);
                }
            } else {
                if (idVal) {
                    const idx = appState.availableVehicles.findIndex(v => v.id === Number(idVal));
                    if (idx > -1) {
                        appState.availableVehicles[idx] = vData;
                    }
                } else {
                    appState.availableVehicles.push(vData);
                }
                showToast(idVal ? "Vehicle updated successfully!" : "Vehicle registered successfully!");
                document.getElementById('vehicle-crud-modal')!.style.display = 'none';
                await renderVehiclesFleetTab();
            }
        };
    }

    const vehiclesSearch = document.getElementById('vehicles-search') as HTMLInputElement | null;
    if (vehiclesSearch) {
        vehiclesSearch.oninput = () => renderVehiclesFleetTab();
    }

    // C. Driver Tab
    const renderDriversFleetTab = async () => {
        const listBody = document.getElementById('drivers-list-body');
        if (!listBody) return;
        listBody.innerHTML = '';

        let drivers = appState.drivers;
        if (useBackend) {
            try {
                const res = await fetch(`${BACKEND_URL}/drivers`);
                if (res.ok) {
                    drivers = await res.json();
                    appState.drivers = drivers;
                }
            } catch (e) {
                console.error(e);
            }
        }

        const searchInput = document.getElementById('drivers-search') as HTMLInputElement | null;
        const filterVal = (searchInput?.value || '').trim().toLowerCase();
        const filtered = drivers.filter(d => 
            (d.name || '').toLowerCase().includes(filterVal) ||
            (d.idNumber || '').toLowerCase().includes(filterVal) ||
            (d.assignedHaulier || '').toLowerCase().includes(filterVal)
        );

        if (filtered.length === 0) {
            listBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No drivers found.</td></tr>';
            return;
        }

        const isCustomer = appState.activeRole === 'Customer';

        filtered.forEach(d => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${d.name}</strong></td>
                <td>${d.idNumber}</td>
                <td>${d.licenseNumber}</td>
                <td>${d.assignedHaulier}</td>
                <td><span class="status-badge ${d.inductionStatus === 'Active' ? 'complete' : 'variance-flagged'}">${d.inductionStatus}</span></td>
                <td>${d.medicalExpiryDate || '--'}</td>
                <td>${d.trainingExpiryDate || '--'}</td>
                <td>
                    ${isCustomer ? '' : `
                    <button class="btn-text btn-edit-driver-row" data-id="${d.id}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button class="btn-text btn-delete-driver-row" style="color:var(--status-danger);" data-id="${d.id}"><i class="fa-solid fa-trash"></i> Delete</button>
                    `}
                </td>
            `;
            listBody.appendChild(row);
        });

        document.querySelectorAll('.btn-edit-driver-row').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = () => {
                const dId = Number(htmlBtn.dataset.id);
                const driver = appState.drivers.find(d => d.id === dId);
                if (driver) openDriverCrudModal(driver);
            };
        });

        document.querySelectorAll('.btn-delete-driver-row').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = async () => {
                const dId = Number(htmlBtn.dataset.id);
                if (confirm("Are you sure you want to delete this driver?")) {
                    if (useBackend) {
                        try {
                            const res = await fetch(`${BACKEND_URL}/drivers/${dId}`, { method: 'DELETE' });
                            if (res.ok) {
                                showToast("Driver deleted successfully!");
                                await renderDriversFleetTab();
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    } else {
                        appState.drivers = appState.drivers.filter(d => d.id !== dId);
                        showToast("Driver deleted successfully!");
                        await renderDriversFleetTab();
                    }
                }
            };
        });
    };

    const openDriverCrudModal = (d?: Driver) => {
        const modal = document.getElementById('driver-crud-modal');
        if (!modal) return;
        const title = document.getElementById('driver-crud-modal-title');
        const form = document.getElementById('driver-crud-form') as HTMLFormElement;
        if (form) form.reset();

        populateHaulierDropdowns();

        if (d) {
            if (title) title.textContent = "Edit Driver Details";
            (document.getElementById('driver-crud-id') as HTMLInputElement).value = (d.id || '').toString();
            (document.getElementById('driver-crud-name') as HTMLInputElement).value = d.name;
            (document.getElementById('driver-crud-idnum') as HTMLInputElement).value = d.idNumber;
            (document.getElementById('driver-crud-licensenum') as HTMLInputElement).value = d.licenseNumber;
            (document.getElementById('driver-crud-haulier') as HTMLSelectElement).value = appState.masterHauliers.find(h => h.name === d.assignedHaulier)?.id || "";
            (document.getElementById('driver-crud-induction') as HTMLSelectElement).value = d.inductionStatus;
            (document.getElementById('driver-crud-medical') as HTMLInputElement).value = d.medicalExpiryDate || '';
            (document.getElementById('driver-crud-training') as HTMLInputElement).value = d.trainingExpiryDate || '';
        } else {
            if (title) title.textContent = "Register New Driver";
            (document.getElementById('driver-crud-id') as HTMLInputElement).value = "";
        }
        modal.style.display = 'block';
    };

    const btnSaveDriverCrud = document.getElementById('btn-save-driver-crud');
    if (btnSaveDriverCrud) {
        btnSaveDriverCrud.onclick = async (e) => {
            e.preventDefault();
            const idVal = (document.getElementById('driver-crud-id') as HTMLInputElement).value;
            const nameVal = (document.getElementById('driver-crud-name') as HTMLInputElement).value;
            const idnumVal = (document.getElementById('driver-crud-idnum') as HTMLInputElement).value;
            const licensenumVal = (document.getElementById('driver-crud-licensenum') as HTMLInputElement).value;
            const hSelect = document.getElementById('driver-crud-haulier') as HTMLSelectElement;
            const haulierVal = hSelect.selectedOptions[0]?.text || '';
            const inductionVal = (document.getElementById('driver-crud-induction') as HTMLSelectElement).value;
            const medicalVal = (document.getElementById('driver-crud-medical') as HTMLInputElement).value;
            const trainingVal = (document.getElementById('driver-crud-training') as HTMLInputElement).value;

            if (!nameVal || !idnumVal || !licensenumVal) {
                showToast("Please fill in name, ID and License fields", "error");
                return;
            }

            const dData: Driver = {
                name: nameVal,
                idNumber: idnumVal,
                licenseNumber: licensenumVal,
                assignedHaulier: haulierVal,
                inductionStatus: inductionVal,
                active: true,
                medicalExpiryDate: medicalVal,
                trainingExpiryDate: trainingVal
            };

            if (idVal) {
                dData.id = Number(idVal);
            }

            if (useBackend) {
                try {
                    const url = idVal ? `${BACKEND_URL}/drivers/${idVal}` : `${BACKEND_URL}/drivers`;
                    const method = idVal ? 'PUT' : 'POST';
                    const res = await fetch(url, {
                        method: method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dData)
                    });
                    if (res.ok) {
                        showToast(idVal ? "Driver updated successfully!" : "Driver registered successfully!");
                        document.getElementById('driver-crud-modal')!.style.display = 'none';
                        await renderDriversFleetTab();
                    }
                } catch (e) {
                    console.error(e);
                }
            } else {
                if (idVal) {
                    const idx = appState.drivers.findIndex(d => d.id === Number(idVal));
                    if (idx > -1) {
                        appState.drivers[idx] = { ...dData, id: Number(idVal) };
                    }
                } else {
                    dData.id = appState.drivers.length > 0 ? Math.max(...appState.drivers.map(d => d.id || 0)) + 1 : 1;
                    appState.drivers.push(dData);
                }
                showToast(idVal ? "Driver updated successfully!" : "Driver registered successfully!");
                document.getElementById('driver-crud-modal')!.style.display = 'none';
                await renderDriversFleetTab();
            }
        };
    }

    const driversSearch = document.getElementById('drivers-search') as HTMLInputElement | null;
    if (driversSearch) {
        driversSearch.oninput = () => renderDriversFleetTab();
    }

    const populateHaulierDropdowns = () => {
        const orderHaulierSelect = document.getElementById('comboHaulierId') as HTMLSelectElement | null;
        const simHaulierSelect = document.getElementById('sim-haulier-select') as HTMLSelectElement | null;
        const vehicleCrudHaulier = document.getElementById('vehicle-crud-haulier') as HTMLSelectElement | null;
        const driverCrudHaulier = document.getElementById('driver-crud-haulier') as HTMLSelectElement | null;

        const list = appState.masterHauliers;

        [orderHaulierSelect, simHaulierSelect, vehicleCrudHaulier, driverCrudHaulier].forEach(sel => {
            if (!sel) return;
            const currentVal = sel.value;
            sel.innerHTML = '';
            if (sel === simHaulierSelect) {
                const opt = document.createElement('option');
                opt.value = "";
                opt.textContent = "Select Haulier...";
                sel.appendChild(opt);
            }
            list.forEach(h => {
                const opt = document.createElement('option');
                opt.value = h.id;
                opt.textContent = h.name;
                sel.appendChild(opt);
            });
            if (currentVal) sel.value = currentVal;
        });
    };

    // --- WEIGHBRIDGE SIMULATOR LOGIC ---
    let simStep = 1;
    let simTicket: any = {
        orderId: '',
        haulier: '',
        reg: '',
        trailerReg: '',
        driver: '',
        product: '',
        origin: '',
        tareWeight: 0,
        grossWeight: 0,
        netWeight: 0,
        destWeight: 0,
        variance: 0,
        status: 'Draft'
    };

    const initWeighbridgeSim = () => {
        simStep = 1;
        updateSimTimelineUI();

        const orderSelect = document.getElementById('sim-order-select') as HTMLSelectElement | null;
        if (orderSelect) {
            orderSelect.innerHTML = '<option value="">Select Order...</option>';
            appState.orders.forEach(o => {
                const opt = document.createElement('option');
                opt.value = o.orderId || o.id || '';
                opt.textContent = `${o.orderId || o.id} - ${o.product} (${o.client})`;
                orderSelect.appendChild(opt);
            });

            orderSelect.onchange = () => {
                const orderId = orderSelect.value;
                const order = appState.orders.find(o => (o.orderId === orderId || o.id === orderId));
                const haulierSelect = document.getElementById('sim-haulier-select') as HTMLSelectElement | null;
                const vehicleSelect = document.getElementById('sim-vehicle-select') as HTMLSelectElement | null;
                const driverInput = document.getElementById('sim-driver-input') as HTMLInputElement | null;

                if (order) {
                    if (haulierSelect) {
                        haulierSelect.disabled = false;
                        haulierSelect.innerHTML = '<option value="">Select Haulier...</option>';
                        appState.masterHauliers.forEach(h => {
                            const opt = document.createElement('option');
                            opt.value = h.name;
                            opt.textContent = h.name;
                            haulierSelect.appendChild(opt);
                        });
                    }
                } else {
                    if (haulierSelect) {
                        haulierSelect.disabled = true;
                        haulierSelect.value = "";
                    }
                    if (vehicleSelect) {
                        vehicleSelect.disabled = true;
                        vehicleSelect.value = "";
                    }
                    if (driverInput) driverInput.value = "";
                }
            };
        }

        const haulierSelect = document.getElementById('sim-haulier-select') as HTMLSelectElement | null;
        if (haulierSelect) {
            haulierSelect.onchange = () => {
                const haulierName = haulierSelect.value;
                const vehicleSelect = document.getElementById('sim-vehicle-select') as HTMLSelectElement | null;
                if (haulierName) {
                    if (vehicleSelect) {
                        vehicleSelect.disabled = false;
                        vehicleSelect.innerHTML = '<option value="">Select Vehicle...</option>';
                        appState.availableVehicles.forEach(v => {
                            if (v.haulier === haulierName) {
                                const opt = document.createElement('option');
                                opt.value = v.reg;
                                opt.textContent = v.reg;
                                vehicleSelect.appendChild(opt);
                            }
                        });
                    }
                } else {
                    if (vehicleSelect) {
                        vehicleSelect.disabled = true;
                        vehicleSelect.value = "";
                    }
                }
            };
        }

        const vehicleSelect = document.getElementById('sim-vehicle-select') as HTMLSelectElement | null;
        if (vehicleSelect) {
            vehicleSelect.onchange = () => {
                const reg = vehicleSelect.value;
                const driverInput = document.getElementById('sim-driver-input') as HTMLInputElement | null;
                if (reg) {
                    const veh = appState.availableVehicles.find(v => v.reg === reg);
                    if (driverInput) {
                        driverInput.value = veh ? veh.driver : '';
                    }
                } else {
                    if (driverInput) driverInput.value = '';
                }
            };
        }
    };

    const updateSimTimelineUI = () => {
        for (let i = 1; i <= 5; i++) {
            const pane = document.getElementById(`sim-step-pane-${i}`);
            if (pane) pane.style.display = i === simStep ? 'block' : 'none';
            
            const ind = document.getElementById(`sim-step-${i}-indicator`);
            if (ind) {
                ind.className = 'sim-step';
                if (i === simStep) ind.classList.add('active');
                else if (i < simStep) ind.classList.add('completed');
            }
        }
    };

    const runComplianceClearanceCheck = () => {
        const banner = document.getElementById('sim-compliance-banner');
        const details = document.getElementById('sim-compliance-details');
        const nextBtn = document.getElementById('btn-sim-next-2') as HTMLButtonElement | null;
        if (!banner || !details) return;

        const driver = appState.drivers.find(d => d.name === simTicket.driver);
        const vehicle = appState.availableVehicles.find(v => v.reg === simTicket.reg);
        const haulier = appState.masterHauliers.find(h => h.name === simTicket.haulier);

        let logs: string[] = [];
        let isInductionValid = false;
        let isMedicalValid = false;
        let isTrainingValid = false;
        let isVehicleValid = false;
        let isHaulierValid = false;

        const todayStr = new Date().toISOString().split('T')[0];

        if (driver) {
            isInductionValid = driver.inductionStatus === 'Active';
            logs.push(isInductionValid ? `Driver Induction: Active (Clear)` : `Driver Induction: ${driver.inductionStatus} (Failed)`);

            isMedicalValid = driver.medicalExpiryDate ? driver.medicalExpiryDate >= todayStr : false;
            logs.push(isMedicalValid ? `Medical Certificate: Valid until ${driver.medicalExpiryDate}` : `Medical Certificate: Expired on ${driver.medicalExpiryDate}`);

            isTrainingValid = driver.trainingExpiryDate ? driver.trainingExpiryDate >= todayStr : false;
            logs.push(isTrainingValid ? `Safety Training: Valid until ${driver.trainingExpiryDate}` : `Safety Training: Expired on ${driver.trainingExpiryDate}`);
        } else {
            logs.push("Driver records not found");
        }

        if (vehicle) {
            isVehicleValid = vehicle.complianceStatus === 'Compliant';
            logs.push(isVehicleValid ? `Vehicle Status: Compliant` : `Vehicle Status: ${vehicle.complianceStatus}`);
        }

        if (haulier) {
            isHaulierValid = haulier.complianceStatus === 'Compliant';
            logs.push(isHaulierValid ? `Haulier Compliance: Compliant` : `Haulier Compliance: ${haulier.complianceStatus}`);
        }

        const allClear = isInductionValid && isMedicalValid && isTrainingValid && isVehicleValid && isHaulierValid;

        details.innerHTML = logs.map(l => `<div class="compliance-check-row"><i class="fa-solid ${l.includes('(Failed)') || l.includes('Expired') || l.includes('Non-Compliant') || l.includes('Suspended') || l.includes('Review Required') ? 'fa-circle-xmark text-danger' : 'fa-circle-check text-success'}"></i> <span>${l}</span></div>`).join('');

        if (allClear) {
            banner.className = 'compliance-status-banner complete';
            banner.innerHTML = `<i class="fa-solid fa-circle-check"></i> Security Gate Clearance Granted. Access Approved.`;
            if (nextBtn) nextBtn.disabled = false;
        } else {
            banner.className = 'compliance-status-banner variance-flagged';
            banner.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Security Gate Clearance Denied. Access Blocked!`;
            if (nextBtn) nextBtn.disabled = true;

            const newWarning: Warning = {
                id: Date.now(),
                type: 'alert',
                title: 'Critical Security Gate Denial',
                desc: `Access blocked for ${simTicket.reg} (Driver: ${simTicket.driver}) due to safety induction or compliance violation.`,
                time: 'Just now',
                read: false
            };
            appState.warnings.unshift(newWarning);
            updateNotificationBadge();
            showToast("Access Blocked: Compliance check failed!", "error");
        }
    };

    const updateSimPrintPreview = () => {
        const pNo = document.getElementById('t-preview-no');
        const pDate = document.getElementById('t-preview-date');
        const pReg = document.getElementById('t-preview-reg');
        const pTrailer = document.getElementById('t-preview-trailer');
        const pDriver = document.getElementById('t-preview-driver');
        const pHaulier = document.getElementById('t-preview-haulier');
        const pOrigin = document.getElementById('t-preview-origin');
        const pProduct = document.getElementById('t-preview-product');
        const pGross = document.getElementById('t-preview-gross');
        const pTare = document.getElementById('t-preview-tare');
        const pNet = document.getElementById('t-preview-net');
        const pStatus = document.getElementById('t-preview-status');
        const printBtn = document.getElementById('btn-sim-print-ticket') as HTMLButtonElement | null;

        if (pNo) pNo.textContent = simStep === 5 ? 'T-' + Math.floor(80000 + Math.random() * 10000) : 'T-XXXXX';
        if (pDate) pDate.textContent = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        if (pReg) pReg.textContent = simTicket.reg || '------';
        if (pTrailer) pTrailer.textContent = simTicket.trailerReg || '------';
        if (pDriver) pDriver.textContent = simTicket.driver || '------';
        if (pHaulier) pHaulier.textContent = simTicket.haulier || '------';
        if (pOrigin) pOrigin.textContent = simTicket.origin || '------';
        if (pProduct) pProduct.textContent = simTicket.product || '------';
        if (pGross) pGross.textContent = simTicket.grossWeight ? `${simTicket.grossWeight.toFixed(2)} t` : '0.00 t';
        if (pTare) pTare.textContent = simTicket.tareWeight ? `${simTicket.tareWeight.toFixed(2)} t` : '0.00 t';
        if (pNet) pNet.textContent = simTicket.netWeight ? `${simTicket.netWeight.toFixed(2)} t` : '0.00 t';
        
        if (pStatus) {
            if (simStep < 5) {
                pStatus.textContent = 'DRAFT';
                pStatus.className = 'print-val';
            } else {
                pStatus.textContent = simTicket.variance < appState.varianceThreshold ? 'COMPLETED (ACCEPTED)' : 'FLAGGED VARIANCE (REVIEW)';
                pStatus.className = simTicket.variance < appState.varianceThreshold ? 'print-val text-success' : 'print-val text-danger';
            }
        }

        if (printBtn) {
            printBtn.disabled = simStep < 5;
            printBtn.onclick = () => {
                window.print();
            };
        }
    };

    const btnSimNext1 = document.getElementById('btn-sim-next-1');
    if (btnSimNext1) {
        btnSimNext1.onclick = (e) => {
            e.preventDefault();
            const orderVal = (document.getElementById('sim-order-select') as HTMLSelectElement).value;
            const haulierVal = (document.getElementById('sim-haulier-select') as HTMLSelectElement).value;
            const vehicleVal = (document.getElementById('sim-vehicle-select') as HTMLSelectElement).value;
            const driverVal = (document.getElementById('sim-driver-input') as HTMLInputElement).value;
            const trailerVal = (document.getElementById('sim-trailer-input') as HTMLInputElement).value;

            if (!orderVal || !haulierVal || !vehicleVal || !driverVal) {
                showToast("Please fill in order, haulier, vehicle and driver fields", "error");
                return;
            }

            const order = appState.orders.find(o => (o.orderId === orderVal || o.id === orderVal))!;
            simTicket.orderId = orderVal;
            simTicket.haulier = haulierVal;
            simTicket.reg = vehicleVal;
            simTicket.driver = driverVal;
            simTicket.trailerReg = trailerVal;
            simTicket.product = order.product;
            simTicket.origin = order.type === 'Dispatch' ? 'Main Stockpile' : 'Client Loading Pit';

            simStep = 2;
            updateSimTimelineUI();
            runComplianceClearanceCheck();
        };
    }

    const btnSimPrev2 = document.getElementById('btn-sim-prev-2');
    if (btnSimPrev2) {
        btnSimPrev2.onclick = (e) => {
            e.preventDefault();
            simStep = 1;
            updateSimTimelineUI();
        };
    }

    const btnSimNext2 = document.getElementById('btn-sim-next-2');
    if (btnSimNext2) {
        btnSimNext2.onclick = (e) => {
            e.preventDefault();
            simStep = 3;
            updateSimTimelineUI();
            updateSimPrintPreview();
        };
    }

    const btnSimPrev3 = document.getElementById('btn-sim-prev-3');
    if (btnSimPrev3) {
        btnSimPrev3.onclick = (e) => {
            e.preventDefault();
            simStep = 2;
            updateSimTimelineUI();
        };
    }

    const btnSimCaptureTare = document.getElementById('btn-sim-capture-tare');
    if (btnSimCaptureTare) {
        btnSimCaptureTare.onclick = (e) => {
            e.preventDefault();
            const tareVal = parseFloat((document.getElementById('sim-tare-weight-input') as HTMLInputElement).value || '14.5');
            const display = document.getElementById('sim-tare-display');
            if (display) display.innerHTML = `${tareVal.toFixed(2)} <small>t</small>`;
            simTicket.tareWeight = tareVal;
            
            const nextBtn = document.getElementById('btn-sim-next-3') as HTMLButtonElement | null;
            if (nextBtn) nextBtn.disabled = false;
            
            showToast(`Captured tare weight: ${tareVal.toFixed(2)} t`);
            updateSimPrintPreview();
        };
    }

    const btnSimNext3 = document.getElementById('btn-sim-next-3');
    if (btnSimNext3) {
        btnSimNext3.onclick = (e) => {
            e.preventDefault();
            simStep = 4;
            updateSimTimelineUI();
        };
    }

    const btnSimPrev4 = document.getElementById('btn-sim-prev-4');
    if (btnSimPrev4) {
        btnSimPrev4.onclick = (e) => {
            e.preventDefault();
            simStep = 3;
            updateSimTimelineUI();
        };
    }

    const btnSimCaptureGross = document.getElementById('btn-sim-capture-gross');
    if (btnSimCaptureGross) {
        btnSimCaptureGross.onclick = (e) => {
            e.preventDefault();
            const grossVal = parseFloat((document.getElementById('sim-gross-weight-input') as HTMLInputElement).value || '48.5');
            const display = document.getElementById('sim-gross-display');
            if (display) display.innerHTML = `${grossVal.toFixed(2)} <small>t</small>`;
            simTicket.grossWeight = grossVal;
            simTicket.netWeight = grossVal - simTicket.tareWeight;

            const destVal = parseFloat((document.getElementById('sim-dest-weight-input') as HTMLInputElement).value || '33.8');
            simTicket.destWeight = destVal;

            const varianceVal = Math.abs(simTicket.netWeight - destVal) / simTicket.netWeight * 100;
            simTicket.variance = varianceVal;

            const nextBtn = document.getElementById('btn-sim-next-4') as HTMLButtonElement | null;
            if (nextBtn) nextBtn.disabled = false;

            showToast(`Captured gross weight: ${grossVal.toFixed(2)} t (Net: ${simTicket.netWeight.toFixed(2)} t)`);
            updateSimPrintPreview();
        };
    }

    const btnSimNext4 = document.getElementById('btn-sim-next-4');
    if (btnSimNext4) {
        btnSimNext4.onclick = (e) => {
            e.preventDefault();
            simStep = 5;
            updateSimTimelineUI();
            updateSimPrintPreview();
        };
    }

    const btnSimReset = document.getElementById('btn-sim-reset');
    if (btnSimReset) {
        btnSimReset.onclick = (e) => {
            e.preventDefault();
            initWeighbridgeSim();
            const tareDisp = document.getElementById('sim-tare-display');
            if (tareDisp) tareDisp.innerHTML = `0.00 <small>t</small>`;
            const grossDisp = document.getElementById('sim-gross-display');
            if (grossDisp) grossDisp.innerHTML = `0.00 <small>t</small>`;
            
            const nextBtn3 = document.getElementById('btn-sim-next-3') as HTMLButtonElement | null;
            if (nextBtn3) nextBtn3.disabled = true;
            const nextBtn4 = document.getElementById('btn-sim-next-4') as HTMLButtonElement | null;
            if (nextBtn4) nextBtn4.disabled = true;

            simTicket = {
                orderId: '',
                haulier: '',
                reg: '',
                trailerReg: '',
                driver: '',
                product: '',
                origin: '',
                tareWeight: 0,
                grossWeight: 0,
                netWeight: 0,
                destWeight: 0,
                variance: 0,
                status: 'Draft'
            };
            updateSimPrintPreview();
        };
    }

    const btnSimSubmitTicket = document.getElementById('btn-sim-submit-ticket');
    if (btnSimSubmitTicket) {
        btnSimSubmitTicket.onclick = async (e) => {
            e.preventDefault();

            const ticketId = 'T-' + Math.floor(80000 + Math.random() * 10000);
            const dispNo = 'D-' + Math.floor(10000 + Math.random() * 90000);
            const rectNo = 'R-' + Math.floor(10000 + Math.random() * 90000);

            const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
            const dateStr = new Date().toISOString().split('T')[0] + ' ' + timeStr;

            const newPair: TicketPair = {
                id: ticketId,
                dispatch: {
                    no: dispNo,
                    src: simTicket.origin,
                    weight: simTicket.netWeight,
                    time: dateStr
                },
                receipt: {
                    no: rectNo,
                    dest: 'Sasolburg Depot',
                    weight: simTicket.destWeight,
                    time: dateStr
                },
                variance: simTicket.variance,
                reg: simTicket.reg,
                prod: simTicket.product,
                status: simTicket.variance < appState.varianceThreshold ? 'Accepted' : 'Review Req'
            };

            if (useBackend) {
                try {
                    const res = await fetch(`${BACKEND_URL}/telemetry/tickets`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ticketId: ticketId,
                            reg: simTicket.reg,
                            prod: simTicket.product,
                            gross: simTicket.grossWeight,
                            net: simTicket.netWeight,
                            time: timeStr,
                            status: newPair.status
                        })
                    });
                    if (res.ok) {
                        showToast(`Ticket ${ticketId} posted to Spring Boot ERP!`);
                    }
                } catch (e) {
                    console.error(e);
                }
            } else {
                appState.dualTickets[Date.now()] = newPair;
                mockFeed.unshift({
                    id: ticketId,
                    reg: simTicket.reg,
                    prod: simTicket.product,
                    gross: simTicket.grossWeight.toFixed(2) + ' t',
                    net: simTicket.netWeight.toFixed(2) + ' t',
                    time: timeStr,
                    status: newPair.status
                });
                showToast(`Ticket ${ticketId} posted to local ERP simulation!`);
            }

            if (simTicket.variance > appState.varianceThreshold) {
                const newWarning: Warning = {
                    id: Date.now(),
                    type: 'alert',
                    title: 'Weight Variance Discrepancy',
                    desc: `Ticket ${ticketId} loaded: ${simTicket.variance.toFixed(1)}% variance exceeds ${appState.varianceThreshold}% threshold.`,
                    time: 'Just now',
                    read: false
                };
                appState.warnings.unshift(newWarning);
                updateNotificationBadge();
            } else {
                const targetSP = appState.stockpiles.find(sp => sp.product === simTicket.product);
                if (targetSP) {
                    targetSP.tons = Math.min(targetSP.capacity, targetSP.tons + simTicket.netWeight);
                }
                recentInventoryLogs.unshift({
                    time: timeStr,
                    target: targetSP ? targetSP.name : 'Stockpile A',
                    product: simTicket.product,
                    mass: simTicket.netWeight.toFixed(2) + ' t',
                    haulier: simTicket.haulier,
                    reg: simTicket.reg,
                    verification: 'Accepted'
                });
            }

            btnSimReset.click();
        };
    }

    // --- INTERSITE RECONCILIATION CONTROLLER ---
    const renderReconciliationTab = () => {
        const listBody = document.getElementById('reconciliation-list-body');
        if (!listBody) return;
        listBody.innerHTML = '';

        const list = Object.values(appState.dualTickets);
        
        let matchedCount = 0;
        let minorCount = 0;
        let majorCount = 0;

        list.forEach(t => {
            const v = t.variance;
            if (v < 1.0) matchedCount++;
            else if (v <= appState.varianceThreshold) minorCount++;
            else majorCount++;
        });

        const matchedKPI = document.getElementById('kpi-recon-matched');
        const minorKPI = document.getElementById('kpi-recon-minor');
        const majorKPI = document.getElementById('kpi-recon-major');

        if (matchedKPI) matchedKPI.textContent = matchedCount.toString();
        if (minorKPI) minorKPI.textContent = minorCount.toString();
        if (majorKPI) majorKPI.textContent = majorCount.toString();

        const searchVal = ((document.getElementById('recon-search') as HTMLInputElement | null)?.value || '').trim().toLowerCase();
        const filterVal = ((document.getElementById('recon-status-filter') as HTMLSelectElement | null)?.value || 'ALL');

        const filtered = list.filter(t => {
            const matchesSearch = (t.reg || '').toLowerCase().includes(searchVal) || (t.id || '').toLowerCase().includes(searchVal);
            let matchesFilter = true;

            if (filterVal === 'Matched') matchesFilter = t.variance < 1.0;
            else if (filterVal === 'Minor Variance') matchesFilter = t.variance >= 1.0 && t.variance <= appState.varianceThreshold;
            else if (filterVal === 'Major Discrepancy') matchesFilter = t.variance > appState.varianceThreshold;
            else if (filterVal === 'Unreconciled') matchesFilter = t.status === 'Review Req';

            return matchesSearch && matchesFilter;
        });

        if (filtered.length === 0) {
            listBody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:var(--text-muted);">No trips found.</td></tr>';
            return;
        }

        filtered.forEach(t => {
            const varianceVal = t.variance;
            let reconStatus = '';
            let badgeClass = '';

            if (varianceVal < 1.0) {
                reconStatus = 'Matched';
                badgeClass = 'complete';
            } else if (varianceVal <= appState.varianceThreshold) {
                reconStatus = 'Minor Variance';
                badgeClass = 'pending';
            } else {
                reconStatus = 'Major Discrepancy';
                badgeClass = 'variance-flagged';
            }

            const massDiff = Math.abs(t.dispatch.weight - t.receipt.weight);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${t.id}</strong></td>
                <td>${t.reg}</td>
                <td>${t.prod}</td>
                <td>${t.dispatch.weight.toFixed(2)} t</td>
                <td>${t.receipt.weight.toFixed(2)} t</td>
                <td>${massDiff.toFixed(2)} t</td>
                <td><span style="font-family:var(--font-mono); font-weight:700;">${varianceVal.toFixed(1)}%</span></td>
                <td><span class="status-badge ${badgeClass}">${reconStatus}</span></td>
                <td>
                    ${t.status === 'Review Req' ? `
                    <button class="btn-text btn-recon-approve" data-id="${t.id}" style="color:var(--status-success);"><i class="fa-solid fa-circle-check"></i> Reconcile</button>
                    <button class="btn-text btn-recon-dispute" data-id="${t.id}" style="color:var(--status-danger);"><i class="fa-solid fa-circle-xmark"></i> Flag Dispute</button>
                    ` : `
                    <span style="font-size:0.85rem; color:var(--text-muted);"><i class="fa-solid fa-lock"></i> Reconciled</span>
                    `}
                </td>
            `;
            listBody.appendChild(row);
        });

        document.querySelectorAll('.btn-recon-approve').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = () => {
                const ticketId = htmlBtn.dataset.id;
                const pair = Object.values(appState.dualTickets).find(p => p.id === ticketId);
                if (pair) {
                    pair.status = 'Accepted';
                    showToast(`Ticket pair ${ticketId} manually reconciled & approved.`);
                    renderReconciliationTab();
                }
            };
        });

        document.querySelectorAll('.btn-recon-dispute').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = () => {
                const ticketId = htmlBtn.dataset.id;
                const pair = Object.values(appState.dualTickets).find(p => p.id === ticketId);
                if (pair) {
                    pair.status = 'Disputed';
                    showToast(`Ticket pair ${ticketId} flagged for audit dispute.`, 'error');
                    
                    appState.warnings.unshift({
                        id: Date.now(),
                        type: 'alert',
                        title: 'Intersite Audit Dispute Flagged',
                        desc: `Reconciliation dispute manually raised on ticket ${ticketId} (${pair.reg}).`,
                        time: 'Just now',
                        read: false
                    });
                    updateNotificationBadge();
                    renderReconciliationTab();
                }
            };
        });
    };

    const reconSearch = document.getElementById('recon-search') as HTMLInputElement | null;
    if (reconSearch) {
        reconSearch.oninput = () => renderReconciliationTab();
    }

    const reconStatusFilter = document.getElementById('recon-status-filter') as HTMLSelectElement | null;
    if (reconStatusFilter) {
        reconStatusFilter.onchange = () => renderReconciliationTab();
    }

    // --- ALERTS & EXCEPTIONS AUDIT LOG CONTROLLER ---
    const renderAlertsCenterTab = () => {
        const listBody = document.getElementById('alerts-center-list-body');
        if (!listBody) return;
        listBody.innerHTML = '';

        const list = appState.warnings;
        const severityFilter = (document.getElementById('alert-severity-filter') as HTMLSelectElement | null)?.value || 'ALL';

        const filtered = list.filter(w => {
            if (severityFilter === 'ALL') return true;
            if (severityFilter === 'CRITICAL') return w.title.toLowerCase().includes('critical') || w.type === 'alert' && w.desc.toLowerCase().includes('access');
            if (severityFilter === 'HIGH') return w.type === 'alert' && !w.title.toLowerCase().includes('critical');
            if (severityFilter === 'MEDIUM') return w.type === 'info';
            if (severityFilter === 'LOW') return w.type === 'success';
            return true;
        });

        if (filtered.length === 0) {
            listBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No alerts logged.</td></tr>';
            return;
        }

        filtered.forEach(w => {
            let badgeClass = 'pending';
            let severity = 'LOW';

            if (w.title.toLowerCase().includes('critical') || w.desc.toLowerCase().includes('blocked') || w.desc.toLowerCase().includes('denied')) {
                badgeClass = 'variance-flagged';
                severity = 'CRITICAL';
            } else if (w.type === 'alert') {
                badgeClass = 'variance-flagged';
                severity = 'HIGH';
            } else if (w.type === 'info') {
                badgeClass = 'in-progress';
                severity = 'MEDIUM';
            } else {
                badgeClass = 'complete';
                severity = 'LOW';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="status-badge ${badgeClass}">${severity}</span></td>
                <td>${w.type.toUpperCase()}</td>
                <td><strong>${w.title}</strong></td>
                <td>${w.desc}</td>
                <td>${w.time}</td>
                <td><span class="status-badge ${w.read ? 'complete' : 'pending'}">${w.read ? 'Acknowledged' : 'Unread'}</span></td>
                <td>
                    ${w.read ? `<span style="font-size:0.85rem; color:var(--text-muted);"><i class="fa-solid fa-lock"></i> Resolved</span>` : `
                    <button class="btn-text btn-alert-resolve" data-id="${w.id}"><i class="fa-solid fa-check"></i> Acknowledge</button>
                    `}
                </td>
            `;
            listBody.appendChild(row);
        });

        document.querySelectorAll('.btn-alert-resolve').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = () => {
                const idVal = Number(htmlBtn.dataset.id);
                const warning = appState.warnings.find(w => w.id === idVal);
                if (warning) {
                    warning.read = true;
                    showToast("Alert marked as resolved.");
                    updateNotificationBadge();
                    renderAlertsCenterTab();
                }
            };
        });
    };

    const alertSeverityFilter = document.getElementById('alert-severity-filter') as HTMLSelectElement | null;
    if (alertSeverityFilter) {
        alertSeverityFilter.onchange = () => renderAlertsCenterTab();
    }

    const btnClearAllAlerts = document.getElementById('btn-clear-all-alerts');
    if (btnClearAllAlerts) {
        btnClearAllAlerts.onclick = (e) => {
            e.preventDefault();
            appState.warnings = appState.warnings.filter(w => !w.read);
            showToast("Cleared acknowledged alerts.");
            updateNotificationBadge();
            renderAlertsCenterTab();
        };
    }

    // --- BILLING READINESS CONTROLLER (ZAR COST) ---
    const renderBillingTab = () => {
        const listBody = document.getElementById('billing-list-body');
        if (!listBody) return;
        listBody.innerHTML = '';

        const list = Object.values(appState.dualTickets);
        
        let totalTons = 0;
        let totalRevenue = 0;
        let billingReadyCount = 0;

        list.forEach(t => {
            const netMass = t.receipt.weight;
            totalTons += netMass;
            totalRevenue += netMass * appState.ratePerTon;
            if (t.status === 'Accepted') billingReadyCount++;
        });

        const tonsKPI = document.getElementById('kpi-billing-tons');
        const revenueKPI = document.getElementById('kpi-billing-revenue');
        const countKPI = document.getElementById('kpi-billing-ready-count');

        if (tonsKPI) tonsKPI.innerHTML = `${totalTons.toFixed(2)} <small>t</small>`;
        if (revenueKPI) revenueKPI.textContent = `R ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (countKPI) countKPI.textContent = billingReadyCount.toString();

        const filterVal = (document.getElementById('billing-status-filter') as HTMLSelectElement | null)?.value || 'ALL';

        const filtered = list.filter(t => {
            const invStatus = t.status === 'Accepted' ? 'Invoiced' : 'Pending';
            if (filterVal === 'ALL') return true;
            return filterVal === invStatus;
        });

        if (filtered.length === 0) {
            listBody.innerHTML = '<tr><td colspan="10" style="text-align:center; color:var(--text-muted);">No billing-ready loads found.</td></tr>';
            return;
        }

        filtered.forEach(t => {
            const netMass = t.receipt.weight;
            const totalCost = netMass * appState.ratePerTon;
            const invStatus = t.status === 'Accepted' ? 'Invoiced' : 'Pending';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${t.id}</strong></td>
                <td>${t.reg}</td>
                <td>Unitrans Supply Chain</td>
                <td>${t.prod}</td>
                <td>${netMass.toFixed(2)} t</td>
                <td>R ${appState.ratePerTon.toFixed(2)}</td>
                <td><strong>R ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                <td><span class="status-badge ${t.status === 'Accepted' ? 'complete' : 'variance-flagged'}">${t.status}</span></td>
                <td><span class="status-badge ${invStatus === 'Invoiced' ? 'complete' : 'pending'}">${invStatus}</span></td>
                <td>
                    ${invStatus === 'Pending' ? `
                    <button class="btn-text btn-billing-invoice" data-id="${t.id}" style="color:var(--status-success);"><i class="fa-solid fa-file-invoice-dollar"></i> Authorize Invoice</button>
                    ` : `
                    <span style="font-size:0.85rem; color:var(--text-muted);"><i class="fa-solid fa-check-double"></i> Synced to Ledger</span>
                    `}
                </td>
            `;
            listBody.appendChild(row);
        });

        document.querySelectorAll('.btn-billing-invoice').forEach(btn => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.onclick = () => {
                const ticketId = htmlBtn.dataset.id;
                const pair = Object.values(appState.dualTickets).find(p => p.id === ticketId);
                if (pair) {
                    pair.status = 'Accepted';
                    showToast(`Invoice for Ticket ${ticketId} authorized and queued.`);
                    renderBillingTab();
                }
            };
        });
    };

    const billingStatusFilter = document.getElementById('billing-status-filter') as HTMLSelectElement | null;
    if (billingStatusFilter) {
        billingStatusFilter.onchange = () => renderBillingTab();
    }

    // --- DRIVER MOBILE PORTAL EMULATOR CONTROLLER ---
    let driverStep = 1;
    let driverProgress = 10;
    let driverProgressInterval: any = null;
    let currentDriverTrip: any = null;

    const initDriverPortal = () => {
        driverStep = 1;
        updateDriverScreenUI();

        const nameDisplay = document.getElementById('driver-portal-name');
        const regDisplay = document.getElementById('driver-portal-reg');
        const qrReg = document.getElementById('qr-text-reg');

        if (nameDisplay) nameDisplay.textContent = 'Musa Ndiaye';
        if (regDisplay) regDisplay.textContent = 'GP-142-TR';
        if (qrReg) qrReg.textContent = 'GP-142-TR';

        const noTrip = document.getElementById('driver-no-trip');
        const tripBox = document.getElementById('driver-trip-box');

        if (appState.orders.length > 0) {
            currentDriverTrip = appState.orders[0];
            if (noTrip) noTrip.style.display = 'none';
            if (tripBox) {
                tripBox.style.display = 'block';
                
                const drvTripId = document.getElementById('drv-trip-id');
                const drvTripType = document.getElementById('drv-trip-type');
                const drvTripProduct = document.getElementById('drv-trip-product');
                const drvTripClient = document.getElementById('drv-trip-client');
                const drvTripMass = document.getElementById('drv-trip-mass');

                if (drvTripId) drvTripId.textContent = currentDriverTrip.orderId || currentDriverTrip.id || '';
                if (drvTripType) drvTripType.textContent = currentDriverTrip.type.toUpperCase();
                if (drvTripProduct) drvTripProduct.textContent = currentDriverTrip.product;
                if (drvTripClient) drvTripClient.textContent = currentDriverTrip.client;
                if (drvTripMass) drvTripMass.textContent = `${currentDriverTrip.target.toFixed(2)} t Target`;
            }
        } else {
            if (noTrip) noTrip.style.display = 'block';
            if (tripBox) tripBox.style.display = 'none';
        }
    };

    const updateDriverScreenUI = () => {
        const screens = ['pickup', 'transit', 'qrcode', 'dropoff', 'success'];
        screens.forEach((sc, idx) => {
            const el = document.getElementById(`driver-screen-${sc}`);
            if (el) el.classList.toggle('active', (idx + 1) === driverStep);
        });
    };

    const btnDriverStartTrip = document.getElementById('btn-driver-start-trip');
    if (btnDriverStartTrip) {
        btnDriverStartTrip.onclick = (e) => {
            e.preventDefault();
            driverStep = 2;
            updateDriverScreenUI();

            driverProgress = 10;
            const progressBar = document.getElementById('driver-transit-progress');
            const statusText = document.getElementById('drv-transit-status-txt');
            const coordsText = document.getElementById('drv-transit-coords');
            const checkinBtn = document.getElementById('btn-driver-gate-checkin') as HTMLButtonElement | null;
            const movingTruckIcon = document.getElementById('phone-moving-truck');

            if (checkinBtn) checkinBtn.disabled = true;

            if (driverProgressInterval) clearInterval(driverProgressInterval);
            
            driverProgressInterval = setInterval(() => {
                if (driverProgress < 100) {
                    driverProgress += 10;
                    if (progressBar) progressBar.style.width = `${driverProgress}%`;
                    
                    const lat = -26.2483 + (driverProgress / 100) * (-0.0029);
                    const lng = 29.3512 + (driverProgress / 100) * (0.0028);
                    if (coordsText) coordsText.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

                    if (movingTruckIcon) {
                        movingTruckIcon.style.left = `${driverProgress - 10}%`;
                    }

                    if (driverProgress >= 100) {
                        clearInterval(driverProgressInterval);
                        if (statusText) statusText.textContent = 'Arrived at Scale Gate';
                        if (checkinBtn) checkinBtn.disabled = false;
                        showToast("GPS: Vehicle arrived at check-in zone!");
                    } else {
                        if (statusText) statusText.textContent = `En Route (${driverProgress}%)`;
                    }
                }
            }, 800);
        };
    }

    const btnDriverUpdateGps = document.getElementById('btn-driver-update-gps');
    if (btnDriverUpdateGps) {
        btnDriverUpdateGps.onclick = (e) => {
            e.preventDefault();
            showToast("GPS Position telemetry ping sent to mine central control");
        };
    }

    const btnDriverGateCheckin = document.getElementById('btn-driver-gate-checkin');
    if (btnDriverGateCheckin) {
        btnDriverGateCheckin.onclick = (e) => {
            e.preventDefault();
            driverStep = 3;
            updateDriverScreenUI();

            const statusMsg = document.getElementById('driver-gate-status-message');
            if (statusMsg) {
                statusMsg.className = 'gate-status-msg pending';
                statusMsg.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Reading RFID tag. Verifying compliance...`;
            }

            setTimeout(() => {
                const driver = appState.drivers.find(d => d.name === 'Musa Ndiaye');
                const vehicle = appState.availableVehicles.find(v => v.reg === 'GP-142-TR');

                const isCompliant = driver && driver.inductionStatus === 'Active' && vehicle && vehicle.complianceStatus === 'Compliant';

                if (isCompliant) {
                    if (statusMsg) {
                        statusMsg.className = 'gate-status-msg success';
                        statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> ACCESS GRANTED. Proceed to Weighbridge scale.`;
                    }
                    const weighBtn = document.getElementById('btn-driver-simulate-weigh') as HTMLButtonElement | null;
                    if (weighBtn) weighBtn.disabled = false;
                } else {
                    if (statusMsg) {
                        statusMsg.className = 'gate-status-msg error';
                        statusMsg.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ACCESS DENIED. Driver induction invalid.`;
                    }
                    const weighBtn = document.getElementById('btn-driver-simulate-weigh') as HTMLButtonElement | null;
                    if (weighBtn) weighBtn.disabled = true;
                }
            }, 1500);
        };
    }

    const btnDriverSimulateWeigh = document.getElementById('btn-driver-simulate-weigh');
    if (btnDriverSimulateWeigh) {
        btnDriverSimulateWeigh.onclick = (e) => {
            e.preventDefault();
            driverStep = 4;
            updateDriverScreenUI();
        };
    }

    const btnDriverCompleteTrip = document.getElementById('btn-driver-complete-trip');
    if (btnDriverCompleteTrip) {
        btnDriverCompleteTrip.onclick = async (e) => {
            e.preventDefault();
            const dropoffSP = (document.getElementById('drv-dropoff-sp-select') as HTMLSelectElement).value;
            const receiptWeight = parseFloat((document.getElementById('drv-receipt-weight-input') as HTMLInputElement).value || '33.8');

            const ticketId = 'T-' + Math.floor(80000 + Math.random() * 10000);
            const dispNo = 'D-' + Math.floor(10000 + Math.random() * 90000);
            const rectNo = 'R-' + Math.floor(10000 + Math.random() * 90000);

            const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
            const dateStr = new Date().toISOString().split('T')[0] + ' ' + timeStr;

            const dispatchWeight = currentDriverTrip ? currentDriverTrip.target : 34.00;
            const varianceVal = Math.abs(dispatchWeight - receiptWeight) / dispatchWeight * 100;

            const newPair: TicketPair = {
                id: ticketId,
                dispatch: {
                    no: dispNo,
                    src: 'Main Pit A',
                    weight: dispatchWeight,
                    time: dateStr
                },
                receipt: {
                    no: rectNo,
                    dest: dropoffSP,
                    weight: receiptWeight,
                    time: dateStr
                },
                variance: varianceVal,
                reg: 'GP-142-TR',
                prod: currentDriverTrip ? currentDriverTrip.product : 'Anthracite Pea',
                status: varianceVal < appState.varianceThreshold ? 'Accepted' : 'Review Req'
            };

            if (useBackend) {
                try {
                    await fetch(`${BACKEND_URL}/telemetry/tickets`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ticketId: ticketId,
                            reg: newPair.reg,
                            prod: newPair.prod,
                            gross: dispatchWeight * 1.45,
                            net: dispatchWeight,
                            time: timeStr,
                            status: newPair.status
                        })
                    });
                } catch (err) {
                    console.error(err);
                }
            } else {
                appState.dualTickets[Date.now()] = newPair;
                mockFeed.unshift({
                    id: ticketId,
                    reg: newPair.reg,
                    prod: newPair.prod,
                    gross: (dispatchWeight * 1.45).toFixed(2) + ' t',
                    net: dispatchWeight.toFixed(2) + ' t',
                    time: timeStr,
                    status: newPair.status
                });
            }

            const targetSP = appState.stockpiles.find(sp => sp.name === dropoffSP);
            if (targetSP) {
                targetSP.tons = Math.min(targetSP.capacity, targetSP.tons + receiptWeight);
            }
            recentInventoryLogs.unshift({
                time: timeStr,
                target: dropoffSP,
                product: newPair.prod,
                mass: receiptWeight.toFixed(2) + ' t',
                haulier: 'Unitrans Supply Chain',
                reg: 'GP-142-TR',
                verification: newPair.status === 'Accepted' ? 'Accepted' : 'Variance Flagged'
            });

            if (varianceVal > appState.varianceThreshold) {
                appState.warnings.unshift({
                    id: Date.now(),
                    type: 'alert',
                    title: 'Driver Intake Discrepancy',
                    desc: `Driver submission for vehicle GP-142-TR triggered: variance of ${varianceVal.toFixed(1)}% exceeds threshold.`,
                    time: 'Just now',
                    read: false
                });
                updateNotificationBadge();
            }

            driverStep = 5;
            updateDriverScreenUI();
            showToast("Drop-off note synced successfully!");
        };
    }

    const btnDriverReturnHome = document.getElementById('btn-driver-return-home');
    if (btnDriverReturnHome) {
        btnDriverReturnHome.onclick = (e) => {
            e.preventDefault();
            initDriverPortal();
        };
    }

    const btnDriverBackTransit = document.getElementById('btn-driver-back-transit');
    if (btnDriverBackTransit) {
        btnDriverBackTransit.onclick = (e) => {
            e.preventDefault();
            driverStep = 1;
            updateDriverScreenUI();
        };
    }

    const btnDriverBackQr = document.getElementById('btn-driver-back-qr');
    if (btnDriverBackQr) {
        btnDriverBackQr.onclick = (e) => {
            e.preventDefault();
            driverStep = 2;
            updateDriverScreenUI();
        };
    }

    // --- INITIAL RUN ---
    setupFleetTabs();
    populateHaulierDropdowns();
    applyRolePermissions(appState.activeRole);

    const roleSelect = document.getElementById('role-switcher-select') as HTMLSelectElement | null;
    if (roleSelect) {
        roleSelect.addEventListener('change', () => {
            const role = roleSelect.value;
            appState.activeRole = role;
            applyRolePermissions(role);
            showToast(`Switched workspace simulation to: ${role}`);
        });
    }

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
