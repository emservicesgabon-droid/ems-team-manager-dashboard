/**
 * EMS-Team Manager Dashboard v2.0
 * Complete Frontend Application
 * All data persisted in localStorage
 */

// ============================================================
// SECTION 0: CONSTANTS & CONFIG
// ============================================================
const CONFIG = {
    STORAGE_KEY: 'ems_gabon_data_v2',
    SESSION_KEY: 'ems_gabon_session_v2',
    CURRENCY: 'XAF',
    DEFAULT_PASSWORD: 'password123',
    ADMIN_USER: 'admin',
    ADMIN_PASS: 'admin',
    TABLES: ['departments','teams','members','customers','equipment','tasks','workerPayments','expenses','customerPayments','products','sales']
};

const PasswordUtil = {
    validate(pw) {
        const checks = {
            length: pw.length >= 8,
            upper: /[A-Z]/.test(pw),
            lower: /[a-z]/.test(pw),
            number: /[0-9]/.test(pw),
            special: /[^A-Za-z0-9]/.test(pw)
        };
        const passed = Object.values(checks).filter(Boolean).length;
        return { checks, passed, strong: passed === 5, valid: passed >= 4 };
    },
    strengthLabel(passed) {
        if (passed <= 2) return { text: 'Weak', color: '#ef4444' };
        if (passed === 3) return { text: 'Fair', color: '#f59e0b' };
        if (passed === 4) return { text: 'Good', color: '#00d4ff' };
        return { text: 'Strong', color: '#22c55e' };
    }
};

// ============================================================
// SECTION 1: i18n (INTERNATIONALIZATION)
// ============================================================
const I18n = {
    currentLang: 'en',
    translations: {
        en: {
            'nav.main':'MAIN MENU','nav.dashboard':'Dashboard','nav.tasks':'Manage Tasks',
            'nav.departments':'Departments','nav.teams':'Teams','nav.customers':'Customers',
            'nav.equipment':'Equipment','nav.members':'Members','nav.stats':'Reports & Stats',
            'nav.finance':'Finance & Payroll','nav.password':'Change Password','nav.logout':'Logout',
            'header.welcome':'Welcome back. Here\'s your EMS-Team Manager overview.',
            'login.username':'Username (or Member Name)','login.password':'Password',
            'login.submit':'Login Securely','login.footer':'EMS-Team Manager Operations Dashboard v2.0',
            'search.placeholder':'Search...',
            'stat.departments':'Departments','stat.teams':'Active Teams','stat.customers':'Total Customers',
            'stat.tasks':'Total Tasks','stat.equipment':'Total Equipment','stat.equipAvail':'Equip. Available',
            'stat.completed':'Completed Tasks','stat.members':'Total Members','stat.availWorkers':'Available Workers',
            'dash.recentTasks':'Recent Tasks','dash.viewAll':'View All','dash.quickActions':'Quick Actions',
            'qa.createTask':'Create Task','qa.createTaskDesc':'Assign a new task to a team',
            'qa.addDept':'Add Department','qa.addDeptDesc':'Create a new department',
            'qa.formTeam':'Form Team','qa.formTeamDesc':'Assemble a new team',
            'qa.addMember':'Add Member','qa.addMemberDesc':'Add a leader or worker',
            'tasks.title':'All Tasks','tasks.newTask':'New Task',
            'depts.title':'Departments','depts.add':'Add Department',
            'teams.title':'Teams','teams.add':'Form Team',
            'cust.title':'Customers','cust.add':'Add Customer',
            'equip.title':'Company Equipment','equip.add':'Add Equipment',
            'members.title':'Team Members','members.add':'Add Member',
            'stats.title':'Reports & Statistics','stats.totalTimeframe':'Total in Timeframe',
            'stats.completed':'Completed','stats.teamPerf':'Team Performance','stats.workerPerf':'Worker Performance',
            'fin.title':'Finance & Payroll','fin.revenue':'Revenue','fin.payroll':'Payroll',
            'fin.expenses':'Expenses','fin.net':'Net','fin.billing':'Customer Billing (Completed Tasks)',
            'fin.payrollLedger':'Worker Payroll Ledger','fin.payWorker':'Pay Worker',
            'fin.paymentsLog':'Recent Payments Log','fin.allowances':'Company Allowances & Expenses',
            'fin.logExpense':'Log Expense','fin.expensesByDept':'Expenses by Department',
            'fin.expensesLog':'Recent Allowances Log',
            'col.task':'TASK','col.taskTitle':'TASK TITLE','col.department':'DEPARTMENT','col.team':'TEAM',
            'col.assignees':'ASSIGNEES','col.customer':'CUSTOMER','col.deadline':'DEADLINE',
            'col.priority':'PRIORITY','col.status':'STATUS','col.actions':'ACTIONS',
            'col.deptName':'DEPARTMENT NAME','col.teamName':'TEAM NAME','col.parentDept':'PARENT DEPARTMENT',
            'col.fields':'TEAM FIELDS','col.custName':'CUSTOMER NAME','col.location':'LOCATION / SITE',
            'col.assetName':'ASSET NAME','col.type':'TYPE','col.name':'NAME','col.role':'ROLE',
            'col.contractType':'CONTRACT','col.hiringDate':'HIRING DATE','col.availability':'AVAILABILITY',
            'col.completed':'COMPLETED','col.pending':'PENDING','col.total':'TOTAL',
            'col.worker':'WORKER','col.paymentStatus':'PAYMENT STATUS','col.amount':'AMOUNT',
            'col.method':'METHOD','col.date':'DATE','col.totalPaid':'TOTAL PAID',
            'col.totalExpenses':'TOTAL EXPENSES','col.description':'DESCRIPTION',
            'modal.createTask':'Create New Task','modal.addDept':'Add Department',
            'modal.formTeam':'Form Team','modal.addCustomer':'Add Customer',
            'modal.addEquip':'Add Equipment','modal.addMember':'Add Team Member',
            'modal.instructions':'Task Instructions','modal.recordPayment':'Record Customer Payment',
            'modal.recordWorkerPay':'Record Worker Payment','modal.logExpense':'Log Worker Expense',
            'modal.changePassword':'Change Password','modal.confirm':'Confirm Action',
            'form.taskTitle':'Task Title','form.customer':'Customer (Site)','form.startDate':'Start Date',
            'form.deadline':'Deadline Date','form.department':'Department','form.team':'Team',
            'form.assignees':'Assignees (Workers)','form.selectTeam':'Select a team to view available workers.',
            'form.equipment':'Assigned Equipment','form.selectEquip':'Available equipment will appear here.',
            'form.instructions':'Instructions','form.priority':'Priority','form.status':'Status',
            'form.deptName':'Department Name','form.teamName':'Team Name','form.parentDept':'Parent Department',
            'form.teamFields':'Team Fields (specializations)','form.custName':'Customer Name',
            'form.custLocation':'Location / Site','form.assetName':'Asset Name','form.assetType':'Asset Type',
            'form.memberName':'Member Name','form.role':'Role','form.contractType':'Contract Type',
            'form.hiringDate':'Hiring Date','form.deptFilter':'Department (Filters Teams)',
            'form.instructionDetails':'Instructions Details','form.amountXAF':'Amount (XAF)',
            'form.paymentMethod':'Payment Method','form.worker':'Worker','form.date':'Date',
            'form.expenseType':'Type','form.description':'Description',
            'form.currentPw':'Current Password','form.newPw':'New Password','form.confirmPw':'Confirm New Password',
            'btn.cancel':'Cancel','btn.complete':'Complete','btn.saveTask':'Save Task',
            'btn.addAsset':'Add Asset','btn.saveInstructions':'Save Instructions',
            'btn.savePayment':'Save Payment','btn.logExpense':'Log Expense',
            'btn.updatePassword':'Update Password','btn.confirm':'Confirm',
            'filter.status':'Status','filter.priority':'Priority','filter.search':'Search',
            'filter.team':'Team','filter.role':'Role','filter.availability':'Availability',
            'msg.noTasks':'No tasks visible','msg.noDepts':'No departments defined.',
            'msg.noTeams':'No teams formed yet.','msg.noCustomers':'No customers added yet.',
            'msg.noEquipment':'No equipment added yet.','msg.noMembers':'No members visible.',
            'msg.noPayments':'No payments found in this timeframe.',
            'msg.noExpenses':'No expenses logged in this timeframe.',
            'msg.restricted':'Restricted to Admin.','msg.settled':'Settled',
            'msg.deleteConfirm':'Are you sure you want to delete this item?',
            'msg.cannotDeleteEquip':'Cannot delete equipment currently in use.',
            'msg.pwMismatch':'New passwords do not match.','msg.pwWrong':'Incorrect current password.',
            'msg.pwLocked':'Admin password is system locked.','msg.pwUpdated':'Password updated successfully.',
            'msg.created':'Created successfully.','msg.deleted':'Deleted successfully.',
            'msg.saved':'Saved successfully.','msg.loginError':'Invalid credentials.',
            'avail.available':'Available','avail.notAvailable':'Not Available',
            'form.password':'Password','form.confirmPw':'Confirm Password',
            'msg.pwWeak':'Password must have min 8 chars, uppercase, lowercase, number, and special character.',
            'msg.pwNoMatch':'Passwords do not match.',
            'msg.accountDeactivated':'Account deactivated. Contact administrator.',
            'nav.sales':'Sales Department',
            'sales.title':'Sales Department','sales.products':'Products Catalog','sales.pos':'Point of Sale',
            'sales.history':'Sales History','sales.alerts':'Inventory Alerts',
            'sales.addProduct':'Add Product','sales.totalProducts':'Total Products',
            'sales.inventoryValue':'Inventory Value','sales.totalSales':'Total Sales',
            'sales.salesRevenue':'Sales Revenue','sales.lowStock':'Low Stock Items',
            'sales.barcode':'BARCODE','sales.product':'PRODUCT','sales.category':'CATEGORY',
            'sales.unitPrice':'UNIT PRICE','sales.inStock':'IN STOCK','sales.stockStatus':'STATUS',
            'sales.saleNum':'SALE #','sales.items':'ITEMS','sales.total':'TOTAL',
            'sales.payment':'PAYMENT','sales.completeSale':'Complete Sale',
            'sales.scanBarcode':'Scan or type barcode...','sales.searchProduct':'Search product...',
            'sales.scanCamera':'Scan Camera','sales.cart':'Cart','sales.qty':'QTY',
            'sales.lineTotal':'LINE TOTAL','sales.cartEmpty':'Cart is empty',
            'sales.paymentMethod':'Payment Method','sales.cartTotal':'Cart Total',
            'sales.noProducts':'No products added yet.','sales.noSales':'No sales recorded yet.',
            'sales.noAlerts':'All products are well stocked.',
            'sales.productNotFound':'Product not found for this barcode.',
            'sales.outOfStock':'This product is out of stock.',
            'sales.emptyCart':'Add items to cart before completing sale.',
            'sales.saleComplete':'Sale completed successfully!',
            'sales.restock':'Restock','sales.addQty':'Quantity to Add',
            'sales.currentStock':'Current Stock','sales.restocked':'Product restocked successfully.',
            'modal.addProduct':'Add Product','modal.editProduct':'Edit Product',
            'modal.saleDetail':'Sale Details','modal.restock':'Restock Product',
            'form.barcode':'Barcode','form.productName':'Product Name','form.category':'Category',
            'form.unitPrice':'Unit Price (XAF)','form.quantity':'Quantity','form.minStock':'Min Stock Level',
            'sales.exportProducts':'Export Products','sales.exportSales':'Export Sales'
        },
        fr: {
            'nav.main':'MENU PRINCIPAL','nav.dashboard':'Tableau de Bord','nav.tasks':'Gestion des Tâches',
            'nav.departments':'Départements','nav.teams':'Équipes','nav.customers':'Clients',
            'nav.equipment':'Équipements','nav.members':'Membres','nav.stats':'Rapports & Stats',
            'nav.finance':'Finance & Paie','nav.password':'Changer Mot de Passe','nav.logout':'Déconnexion',
            'header.welcome':'Bienvenue. Voici votre aperçu EMS-Team Manager.',
            'login.username':'Nom d\'utilisateur (ou Nom du Membre)','login.password':'Mot de passe',
            'login.submit':'Connexion Sécurisée','login.footer':'EMS-Team Manager Tableau de Bord Opérations v2.0',
            'search.placeholder':'Rechercher...',
            'stat.departments':'Départements','stat.teams':'Équipes Actives','stat.customers':'Total Clients',
            'stat.tasks':'Total Tâches','stat.equipment':'Total Équipements','stat.equipAvail':'Équip. Disponibles',
            'stat.completed':'Tâches Terminées','stat.members':'Total Membres','stat.availWorkers':'Ouvriers Disponibles',
            'dash.recentTasks':'Tâches Récentes','dash.viewAll':'Voir Tout','dash.quickActions':'Actions Rapides',
            'qa.createTask':'Créer Tâche','qa.createTaskDesc':'Assigner une nouvelle tâche',
            'qa.addDept':'Ajouter Département','qa.addDeptDesc':'Créer un nouveau département',
            'qa.formTeam':'Former Équipe','qa.formTeamDesc':'Assembler une nouvelle équipe',
            'qa.addMember':'Ajouter Membre','qa.addMemberDesc':'Ajouter un chef ou ouvrier',
            'tasks.title':'Toutes les Tâches','tasks.newTask':'Nouvelle Tâche',
            'depts.title':'Départements','depts.add':'Ajouter Département',
            'teams.title':'Équipes','teams.add':'Former Équipe',
            'cust.title':'Clients','cust.add':'Ajouter Client',
            'equip.title':'Équipements de l\'Entreprise','equip.add':'Ajouter Équipement',
            'members.title':'Membres de l\'Équipe','members.add':'Ajouter Membre',
            'stats.title':'Rapports & Statistiques','stats.totalTimeframe':'Total dans la Période',
            'stats.completed':'Terminées','stats.teamPerf':'Performance Équipe','stats.workerPerf':'Performance Ouvrier',
            'fin.title':'Finance & Paie','fin.revenue':'Revenus','fin.payroll':'Paie',
            'fin.expenses':'Dépenses','fin.net':'Net','fin.billing':'Facturation Client (Tâches Terminées)',
            'fin.payrollLedger':'Registre de Paie','fin.payWorker':'Payer Ouvrier',
            'fin.paymentsLog':'Journal des Paiements','fin.allowances':'Allocations & Dépenses',
            'fin.logExpense':'Enregistrer Dépense','fin.expensesByDept':'Dépenses par Département',
            'fin.expensesLog':'Journal des Allocations',
            'col.task':'TÂCHE','col.taskTitle':'TITRE TÂCHE','col.department':'DÉPARTEMENT','col.team':'ÉQUIPE',
            'col.assignees':'ASSIGNÉS','col.customer':'CLIENT','col.deadline':'ÉCHÉANCE',
            'col.priority':'PRIORITÉ','col.status':'STATUT','col.actions':'ACTIONS',
            'col.deptName':'NOM DU DÉPARTEMENT','col.teamName':'NOM ÉQUIPE','col.parentDept':'DÉPARTEMENT PARENT',
            'col.fields':'DOMAINES','col.custName':'NOM CLIENT','col.location':'EMPLACEMENT / SITE',
            'col.assetName':'NOM ACTIF','col.type':'TYPE','col.name':'NOM','col.role':'RÔLE',
            'col.contractType':'CONTRAT','col.hiringDate':'DATE D\'EMBAUCHE','col.availability':'DISPONIBILITÉ',
            'col.completed':'TERMINÉES','col.pending':'EN ATTENTE','col.total':'TOTAL',
            'col.worker':'OUVRIER','col.paymentStatus':'STATUT PAIEMENT','col.amount':'MONTANT',
            'col.method':'MÉTHODE','col.date':'DATE','col.totalPaid':'TOTAL PAYÉ',
            'col.totalExpenses':'TOTAL DÉPENSES','col.description':'DESCRIPTION',
            'modal.createTask':'Créer Nouvelle Tâche','modal.addDept':'Ajouter Département',
            'modal.formTeam':'Former Équipe','modal.addCustomer':'Ajouter Client',
            'modal.addEquip':'Ajouter Équipement','modal.addMember':'Ajouter Membre',
            'modal.instructions':'Instructions de Tâche','modal.recordPayment':'Enregistrer Paiement Client',
            'modal.recordWorkerPay':'Enregistrer Paiement Ouvrier','modal.logExpense':'Enregistrer Dépense',
            'modal.changePassword':'Changer Mot de Passe','modal.confirm':'Confirmer l\'Action',
            'form.taskTitle':'Titre de la Tâche','form.customer':'Client (Site)','form.startDate':'Date de Début',
            'form.deadline':'Date Limite','form.department':'Département','form.team':'Équipe',
            'form.assignees':'Assignés (Ouvriers)','form.selectTeam':'Sélectionnez une équipe pour voir les ouvriers.',
            'form.equipment':'Équipements Assignés','form.selectEquip':'Les équipements disponibles apparaîtront ici.',
            'form.instructions':'Instructions','form.priority':'Priorité','form.status':'Statut',
            'form.deptName':'Nom du Département','form.teamName':'Nom de l\'Équipe','form.parentDept':'Département Parent',
            'form.teamFields':'Domaines de l\'Équipe','form.custName':'Nom du Client',
            'form.custLocation':'Emplacement / Site','form.assetName':'Nom de l\'Actif','form.assetType':'Type d\'Actif',
            'form.memberName':'Nom du Membre','form.role':'Rôle','form.contractType':'Type de Contrat',
            'form.hiringDate':'Date d\'Embauche','form.deptFilter':'Département (Filtre Équipes)',
            'form.instructionDetails':'Détails des Instructions','form.amountXAF':'Montant (XAF)',
            'form.paymentMethod':'Méthode de Paiement','form.worker':'Ouvrier','form.date':'Date',
            'form.expenseType':'Type','form.description':'Description',
            'form.currentPw':'Mot de Passe Actuel','form.newPw':'Nouveau Mot de Passe','form.confirmPw':'Confirmer le Mot de Passe',
            'btn.cancel':'Annuler','btn.complete':'Terminer','btn.saveTask':'Enregistrer Tâche',
            'btn.addAsset':'Ajouter Actif','btn.saveInstructions':'Enregistrer Instructions',
            'btn.savePayment':'Enregistrer Paiement','btn.logExpense':'Enregistrer Dépense',
            'btn.updatePassword':'Mettre à Jour','btn.confirm':'Confirmer',
            'filter.status':'Statut','filter.priority':'Priorité','filter.search':'Rechercher',
            'filter.team':'Équipe','filter.role':'Rôle','filter.availability':'Disponibilité',
            'msg.noTasks':'Aucune tâche visible','msg.noDepts':'Aucun département défini.',
            'msg.noTeams':'Aucune équipe formée.','msg.noCustomers':'Aucun client ajouté.',
            'msg.noEquipment':'Aucun équipement ajouté.','msg.noMembers':'Aucun membre visible.',
            'msg.noPayments':'Aucun paiement trouvé dans cette période.',
            'msg.noExpenses':'Aucune dépense enregistrée dans cette période.',
            'msg.restricted':'Réservé à l\'Admin.','msg.settled':'Réglé',
            'msg.deleteConfirm':'Êtes-vous sûr de vouloir supprimer cet élément ?',
            'msg.cannotDeleteEquip':'Impossible de supprimer un équipement en cours d\'utilisation.',
            'msg.pwMismatch':'Les mots de passe ne correspondent pas.','msg.pwWrong':'Mot de passe actuel incorrect.',
            'msg.pwLocked':'Mot de passe admin verrouillé.','msg.pwUpdated':'Mot de passe mis à jour.',
            'msg.created':'Créé avec succès.','msg.deleted':'Supprimé avec succès.',
            'msg.saved':'Enregistré avec succès.','msg.loginError':'Identifiants invalides.',
            'avail.available':'Disponible','avail.notAvailable':'Non Disponible',
            'form.password':'Mot de passe','form.confirmPw':'Confirmer le mot de passe',
            'msg.pwWeak':'Le mot de passe doit contenir min 8 caractères, majuscule, minuscule, chiffre et caractère spécial.',
            'msg.pwNoMatch':'Les mots de passe ne correspondent pas.',
            'msg.accountDeactivated':'Compte désactivé. Contactez l\'administrateur.',
            'nav.sales':'Département Ventes',
            'sales.title':'Département Ventes','sales.products':'Catalogue Produits','sales.pos':'Point de Vente',
            'sales.history':'Historique des Ventes','sales.alerts':'Alertes Inventaire',
            'sales.addProduct':'Ajouter Produit','sales.totalProducts':'Total Produits',
            'sales.inventoryValue':'Valeur Inventaire','sales.totalSales':'Total Ventes',
            'sales.salesRevenue':'Chiffre d\'Affaires','sales.lowStock':'Stock Faible',
            'sales.barcode':'CODE-BARRES','sales.product':'PRODUIT','sales.category':'CATÉGORIE',
            'sales.unitPrice':'PRIX UNITAIRE','sales.inStock':'EN STOCK','sales.stockStatus':'STATUT',
            'sales.saleNum':'VENTE #','sales.items':'ARTICLES','sales.total':'TOTAL',
            'sales.payment':'PAIEMENT','sales.completeSale':'Finaliser la Vente',
            'sales.scanBarcode':'Scanner ou saisir le code-barres...','sales.searchProduct':'Rechercher produit...',
            'sales.scanCamera':'Scanner Caméra','sales.cart':'Panier','sales.qty':'QTÉ',
            'sales.lineTotal':'TOTAL LIGNE','sales.cartEmpty':'Le panier est vide',
            'sales.paymentMethod':'Méthode de Paiement','sales.cartTotal':'Total Panier',
            'sales.noProducts':'Aucun produit ajouté.','sales.noSales':'Aucune vente enregistrée.',
            'sales.noAlerts':'Tous les produits sont bien approvisionnés.',
            'sales.productNotFound':'Produit introuvable pour ce code-barres.',
            'sales.outOfStock':'Ce produit est en rupture de stock.',
            'sales.emptyCart':'Ajoutez des articles au panier avant de finaliser.',
            'sales.saleComplete':'Vente finalisée avec succès !',
            'sales.restock':'Réapprovisionner','sales.addQty':'Quantité à Ajouter',
            'sales.currentStock':'Stock Actuel','sales.restocked':'Produit réapprovisionné avec succès.',
            'modal.addProduct':'Ajouter Produit','modal.editProduct':'Modifier Produit',
            'modal.saleDetail':'Détails de la Vente','modal.restock':'Réapprovisionner',
            'form.barcode':'Code-barres','form.productName':'Nom du Produit','form.category':'Catégorie',
            'form.unitPrice':'Prix Unitaire (XAF)','form.quantity':'Quantité','form.minStock':'Niveau Min de Stock',
            'sales.exportProducts':'Exporter Produits','sales.exportSales':'Exporter Ventes'
        }
    },
    t(key) { return this.translations[this.currentLang][key] || key; },
    setLang(lang) {
        this.currentLang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.dataset.i18n;
            if (this.translations[this.currentLang][k]) el.textContent = this.t(k);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const k = el.dataset.i18nPlaceholder;
            if (this.translations[this.currentLang][k]) el.placeholder = this.t(k);
        });
    }
};

// ============================================================
// SECTION 2: DATA STORE
// ============================================================
const DataStore = {
    _data: null,

    load() {
        try {
            const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (raw) {
                this._data = JSON.parse(raw);
                // Ensure all tables exist
                CONFIG.TABLES.forEach(t => { if (!this._data[t]) this._data[t] = []; });
                if (!this._data._nextIds) this._data._nextIds = {};
                // Migration: ensure all members have accountStatus
                (this._data.members || []).forEach(m => { if (!m.accountStatus) m.accountStatus = 'Active'; });
            } else {
                this.seedDemo();
            }
        } catch(e) {
            console.error('DataStore load error:', e);
            this.seedDemo();
        }
    },

    save() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this._data));
        } catch(e) { console.error('DataStore save error:', e); }
    },

    getAll(table) { return this._data[table] || []; },
    getById(table, id) { return (this._data[table] || []).find(r => r.id === id); },
    query(table, fn) { return (this._data[table] || []).filter(fn); },

    create(table, record) {
        if (!this._data._nextIds[table]) {
            const existing = this._data[table] || [];
            this._data._nextIds[table] = existing.length > 0 ? Math.max(...existing.map(r => r.id)) + 1 : 1;
        }
        record.id = this._data._nextIds[table]++;
        record.createdAt = new Date().toISOString();
        record.updatedAt = record.createdAt;
        this._data[table].push(record);
        this.save();
        return record;
    },

    update(table, id, partial) {
        const arr = this._data[table] || [];
        const idx = arr.findIndex(r => r.id === id);
        if (idx === -1) return null;
        Object.assign(arr[idx], partial, { updatedAt: new Date().toISOString() });
        this.save();
        return arr[idx];
    },

    delete(table, id) {
        const arr = this._data[table] || [];
        const idx = arr.findIndex(r => r.id === id);
        if (idx === -1) return false;
        arr.splice(idx, 1);
        this.save();
        return true;
    },

    getSession() {
        try {
            const raw = localStorage.getItem(CONFIG.SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch(e) { return null; }
    },

    setSession(obj) {
        localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(obj));
    },

    clearSession() {
        localStorage.removeItem(CONFIG.SESSION_KEY);
    },

    seedDemo() {
        const now = new Date().toISOString();
        const today = new Date();
        const daysAgo = (n) => new Date(today.getTime() - n * 86400000).toISOString().split('T')[0];
        const daysFrom = (n) => new Date(today.getTime() + n * 86400000).toISOString().split('T')[0];

        this._data = {
            _nextIds: { departments:4, teams:7, members:13, customers:5, equipment:9, tasks:7, workerPayments:4, expenses:4, customerPayments:3, products:7, sales:4 },
            departments: [
                { id:1, name:'Electrical', createdAt:now, updatedAt:now },
                { id:2, name:'Plumbing', createdAt:now, updatedAt:now },
                { id:3, name:'IT / Networking', createdAt:now, updatedAt:now }
            ],
            teams: [
                { id:1, name:'Electrical Alpha', departmentId:1, fields:'Wiring, Panels', createdAt:now, updatedAt:now },
                { id:2, name:'Electrical Bravo', departmentId:1, fields:'Generators, Lighting', createdAt:now, updatedAt:now },
                { id:3, name:'Plumbing Alpha', departmentId:2, fields:'Pipes, Valves', createdAt:now, updatedAt:now },
                { id:4, name:'Plumbing Bravo', departmentId:2, fields:'HVAC, Drainage', createdAt:now, updatedAt:now },
                { id:5, name:'IT Alpha', departmentId:3, fields:'Servers, Networks', createdAt:now, updatedAt:now },
                { id:6, name:'IT Bravo', departmentId:3, fields:'Helpdesk, Security', createdAt:now, updatedAt:now }
            ],
            members: [
                { id:1, name:'Jean Moussavou', role:'Team Leader', type:'Full-Time', hiringDate:'2024-01-15', teamId:1, password:'password123', availability:'Available', accountStatus:'Active', createdAt:now, updatedAt:now },
                { id:2, name:'Pierre Ndong', role:'Team Worker', type:'Full-Time', hiringDate:'2024-03-01', teamId:1, password:'password123', availability:'Available', accountStatus:'Active', createdAt:now, updatedAt:now },
                { id:3, name:'Marie Obame', role:'Team Leader', type:'Full-Time', hiringDate:'2024-02-10', teamId:2, password:'password123', availability:'Available', accountStatus:'Active', createdAt:now, updatedAt:now },
                { id:4, name:'Yves Ondo', role:'Team Worker', type:'Part-Time', hiringDate:'2024-05-20', teamId:2, password:'password123', availability:'Not Available', accountStatus:'Active', createdAt:now, updatedAt:now },
                { id:5, name:'Sophie Nzé', role:'Team Leader', type:'Full-Time', hiringDate:'2024-01-20', teamId:3, password:'password123', availability:'Available', accountStatus:'Active', createdAt:now, updatedAt:now },
                { id:6, name:'Paul Mba', role:'Team Worker', type:'Full-Time', hiringDate:'2024-04-15', teamId:3, password:'password123', availability:'Available', accountStatus:'Active', createdAt:now, updatedAt:now },
                { id:7, name:'Claire Essono', role:'Team Leader', type:'Full-Time', hiringDate:'2024-02-01', teamId:4, password:'password123', availability:'Available', accountStatus:'Active', createdAt:now, updatedAt:now },
                { id:8, name:'David Nzue', role:'Team Worker', type:'Contractor', hiringDate:'2024-06-01', teamId:4, password:'password123', availability:'Available', accountStatus:'Active', createdAt:now, updatedAt:now },
                { id:9, name:'Alain Biyoghe', role:'Team Leader', type:'Full-Time', hiringDate:'2024-01-10', teamId:5, password:'password123', availability:'Available', accountStatus:'Active', createdAt:now, updatedAt:now },
                { id:10, name:'Léa Mintsa', role:'Team Worker', type:'Full-Time', hiringDate:'2024-03-20', teamId:5, password:'password123', availability:'Available', accountStatus:'Active', createdAt:now, updatedAt:now },
                { id:11, name:'Eric Nguema', role:'Team Leader', type:'Full-Time', hiringDate:'2024-02-15', teamId:6, password:'password123', availability:'Available', accountStatus:'Active', createdAt:now, updatedAt:now },
                { id:12, name:'Diane Mboumba', role:'Team Worker', type:'Part-Time', hiringDate:'2024-07-01', teamId:6, password:'password123', availability:'Not Available', accountStatus:'Active', createdAt:now, updatedAt:now }
            ],
            customers: [
                { id:1, name:'Total Gabon', location:'Port-Gentil Terminal', createdAt:now, updatedAt:now },
                { id:2, name:'Comilog Mining', location:'Moanda Site', createdAt:now, updatedAt:now },
                { id:3, name:'SEEG Libreville', location:'Libreville HQ', createdAt:now, updatedAt:now },
                { id:4, name:'Olam Palm', location:'Mouila Plantation', createdAt:now, updatedAt:now }
            ],
            equipment: [
                { id:1, name:'Ford Transit #1', type:'Vehicle', status:'Available', createdAt:now, updatedAt:now },
                { id:2, name:'Toyota Hilux #2', type:'Vehicle', status:'In Use', createdAt:now, updatedAt:now },
                { id:3, name:'Makita Drill Set', type:'Tool', status:'Available', createdAt:now, updatedAt:now },
                { id:4, name:'DeWalt Saw Kit', type:'Tool', status:'Available', createdAt:now, updatedAt:now },
                { id:5, name:'Peugeot Partner #3', type:'Vehicle', status:'Available', createdAt:now, updatedAt:now },
                { id:6, name:'Bosch Multitool', type:'Tool', status:'In Use', createdAt:now, updatedAt:now },
                { id:7, name:'Fluke Multimeter', type:'Tool', status:'Available', createdAt:now, updatedAt:now },
                { id:8, name:'Isuzu Truck #4', type:'Vehicle', status:'Available', createdAt:now, updatedAt:now }
            ],
            tasks: [
                { id:1, title:'Install Generator Panel', customerId:1, startDate:daysAgo(10), deadlineDate:daysFrom(5), departmentId:1, teamId:1, assigneeIds:[1,2], equipmentIds:[2], instructions:'Install 250kW generator panel at terminal building. Follow NEC codes.', status:'Active', priority:'High', createdAt:now, updatedAt:now, completedAt:null, paymentStatus:'Unpaid', paymentAmount:null, paymentMethod:null },
                { id:2, title:'Fix Water Main Leak', customerId:3, startDate:daysAgo(5), deadlineDate:daysFrom(2), departmentId:2, teamId:3, assigneeIds:[5,6], equipmentIds:[6], instructions:'Repair main water line breach at Libreville HQ. Isolate section B first.', status:'Active', priority:'High', createdAt:now, updatedAt:now, completedAt:null, paymentStatus:'Unpaid', paymentAmount:null, paymentMethod:null },
                { id:3, title:'Network Cabling Office B', customerId:3, startDate:daysAgo(15), deadlineDate:daysAgo(2), departmentId:3, teamId:5, assigneeIds:[9,10], equipmentIds:[], instructions:'Run Cat6 cabling to 20 new workstations in Building B.', status:'Completed', priority:'Medium', createdAt:now, updatedAt:now, completedAt:daysAgo(3), paymentStatus:'Paid', paymentAmount:750000, paymentMethod:'Bank Transfer' },
                { id:4, title:'HVAC Maintenance', customerId:2, startDate:daysAgo(3), deadlineDate:daysFrom(10), departmentId:2, teamId:4, assigneeIds:[7,8], equipmentIds:[], instructions:'Quarterly HVAC check and filter replacement.', status:'Pending', priority:'Low', createdAt:now, updatedAt:now, completedAt:null, paymentStatus:'Unpaid', paymentAmount:null, paymentMethod:null },
                { id:5, title:'Security Camera Setup', customerId:4, startDate:daysAgo(20), deadlineDate:daysAgo(5), departmentId:3, teamId:6, assigneeIds:[11,12], equipmentIds:[], instructions:'Install 16 IP cameras around plantation perimeter.', status:'Completed', priority:'Medium', createdAt:now, updatedAt:now, completedAt:daysAgo(6), paymentStatus:'Unpaid', paymentAmount:null, paymentMethod:null },
                { id:6, title:'Emergency Lighting Retrofit', customerId:1, startDate:daysAgo(1), deadlineDate:daysFrom(14), departmentId:1, teamId:2, assigneeIds:[3,4], equipmentIds:[], instructions:'Replace all emergency exit lighting with LED units.', status:'Pending', priority:'Medium', createdAt:now, updatedAt:now, completedAt:null, paymentStatus:'Unpaid', paymentAmount:null, paymentMethod:null }
            ],
            workerPayments: [
                { id:1, workerId:9, amount:350000, method:'Bank Transfer', date:daysAgo(5), createdAt:now },
                { id:2, workerId:10, amount:250000, method:'Mobile Money', date:daysAgo(5), createdAt:now },
                { id:3, workerId:11, amount:300000, method:'Cash', date:daysAgo(10), createdAt:now }
            ],
            expenses: [
                { id:1, workerId:1, departmentId:1, type:'Taxi / Transport', desc:'Site transport Port-Gentil', amount:45000, date:daysAgo(7), createdAt:now },
                { id:2, workerId:5, departmentId:2, type:'Materials', desc:'Emergency pipe fittings', amount:120000, date:daysAgo(4), createdAt:now },
                { id:3, workerId:9, departmentId:3, type:'Food / Meals', desc:'Team lunch during network install', amount:35000, date:daysAgo(12), createdAt:now }
            ],
            customerPayments: [
                { id:1, taskId:3, amount:750000, method:'Bank Transfer', date:daysAgo(2), createdAt:now },
                { id:2, taskId:5, amount:0, method:null, date:null, createdAt:now }
            ],
            products: [
                { id:1, barcode:'5901234123457', name:'Electrical Cable 2.5mm (100m)', category:'Materials', description:'Standard copper electrical cable', unitPrice:45000, quantity:25, minStock:5, createdAt:now, updatedAt:now },
                { id:2, barcode:'4006381333931', name:'Makita Cordless Drill', category:'Tools', description:'18V LXT cordless drill driver', unitPrice:185000, quantity:8, minStock:3, createdAt:now, updatedAt:now },
                { id:3, barcode:'7501031311309', name:'Safety Helmet (White)', category:'Safety', description:'Construction safety helmet EN 397', unitPrice:12000, quantity:40, minStock:10, createdAt:now, updatedAt:now },
                { id:4, barcode:'8710103900108', name:'LED Panel Light 60x60', category:'Electronics', description:'40W LED panel for office/industrial use', unitPrice:35000, quantity:3, minStock:5, createdAt:now, updatedAt:now },
                { id:5, barcode:'3045140105502', name:'PVC Pipe 110mm (3m)', category:'Materials', description:'Pressure rated PVC pipe for plumbing', unitPrice:8500, quantity:50, minStock:15, createdAt:now, updatedAt:now },
                { id:6, barcode:'4015867716294', name:'Multimeter Fluke 117', category:'Tools', description:'True RMS digital multimeter', unitPrice:275000, quantity:0, minStock:2, createdAt:now, updatedAt:now }
            ],
            sales: [
                { id:1, saleNumber:'SL-001', date:daysAgo(8), items:[{productId:1,productName:'Electrical Cable 2.5mm (100m)',barcode:'5901234123457',qty:3,unitPrice:45000,lineTotal:135000},{productId:3,productName:'Safety Helmet (White)',barcode:'7501031311309',qty:5,unitPrice:12000,lineTotal:60000}], totalAmount:195000, paymentMethod:'Cash', notes:'', createdAt:now },
                { id:2, saleNumber:'SL-002', date:daysAgo(5), items:[{productId:2,productName:'Makita Cordless Drill',barcode:'4006381333931',qty:1,unitPrice:185000,lineTotal:185000}], totalAmount:185000, paymentMethod:'Mobile Money', notes:'', createdAt:now },
                { id:3, saleNumber:'SL-003', date:daysAgo(1), items:[{productId:5,productName:'PVC Pipe 110mm (3m)',barcode:'3045140105502',qty:10,unitPrice:8500,lineTotal:85000},{productId:4,productName:'LED Panel Light 60x60',barcode:'8710103900108',qty:2,unitPrice:35000,lineTotal:70000}], totalAmount:155000, paymentMethod:'Bank Transfer', notes:'', createdAt:now }
            ]
        };
        this.save();
    }
};

// ============================================================
// SECTION 3: AUTH MODULE
// ============================================================
const Auth = {
    currentUser: null,

    login(username, password) {
        if (username.toLowerCase() === CONFIG.ADMIN_USER && password === CONFIG.ADMIN_PASS) {
            this.currentUser = { role:'Admin', id:null, teamId:null, name:'Admin User' };
            DataStore.setSession(this.currentUser);
            return { success:true };
        }
        const member = DataStore.query('members', m => m.name.toLowerCase() === username.toLowerCase() && m.password === password)[0];
        if (member) {
            if (member.accountStatus === 'Deactivated') {
                return { success:false, error:I18n.t('msg.accountDeactivated') };
            }
            this.currentUser = { role:member.role, id:member.id, teamId:member.teamId || null, name:member.name };
            DataStore.setSession(this.currentUser);
            return { success:true };
        }
        return { success:false, error:I18n.t('msg.loginError') };
    },

    logout() {
        this.currentUser = null;
        DataStore.clearSession();
    },

    restoreSession() {
        const session = DataStore.getSession();
        if (!session) return false;
        // Hardcoded admin (no member id)
        if (session.role === 'Admin' && !session.id) {
            this.currentUser = session;
            return true;
        }
        // Member-based login (including member admins)
        const member = DataStore.getById('members', session.id);
        if (member && member.accountStatus !== 'Deactivated') {
            this.currentUser = { role:member.role, id:member.id, teamId:member.teamId || null, name:member.name };
            return true;
        }
        DataStore.clearSession();
        return false;
    },

    isAdmin() { return this.currentUser && this.currentUser.role === 'Admin'; },
    isLeader() { return this.currentUser && this.currentUser.role === 'Team Leader'; },
    isWorker() { return this.currentUser && this.currentUser.role === 'Team Worker'; },

    canAccess(tab) {
        if (this.isAdmin()) return true;
        const adminOnly = ['departments','teams','customers','equipment','sales'];
        if (adminOnly.includes(tab)) return false;
        if (tab === 'members') return this.isLeader();
        return true;
    },

    canCreateTask() { return this.isAdmin() || this.isLeader(); },
    canDeleteTask() { return this.isAdmin(); },
    canToggleAvailability(memberId) {
        if (this.isAdmin()) return true;
        if (this.isLeader()) {
            const m = DataStore.getById('members', memberId);
            return m && m.teamId === this.currentUser.teamId;
        }
        if (this.isWorker()) return memberId === this.currentUser.id;
        return false;
    }
};

// ============================================================
// SECTION 4: UI CORE
// ============================================================
const UI = {
    currentTab: 'dashboard',
    _confirmResolve: null,

    switchTab(tabId) {
        if (!Auth.canAccess(tabId)) return;
        this.currentTab = tabId;
        document.querySelectorAll('.nav-item[data-tab]').forEach(el => el.classList.remove('active'));
        const nav = document.querySelector(`[data-tab="${tabId}"]`);
        if (nav) nav.classList.add('active');
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        const view = document.getElementById(`view-${tabId}`);
        if (view) view.classList.add('active');
        this.closeSidebar();
        this.renderAll();
    },

    openModal(type) {
        const modal = document.getElementById(`modal-${type}`);
        if (modal) modal.classList.add('active');
    },

    closeModal(type) {
        const modal = document.getElementById(`modal-${type}`);
        if (modal) {
            modal.classList.remove('active');
            const form = modal.querySelector('form');
            if (form) form.reset();
            const err = modal.querySelector('.form-error');
            if (err) err.style.display = 'none';
        }
    },

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('sidebar-overlay').classList.toggle('active');
    },

    closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('active');
    },

    toggleTheme() {
        const html = document.documentElement;
        const isDark = !html.dataset.theme || html.dataset.theme === 'dark';
        html.dataset.theme = isDark ? 'light' : 'dark';
        const icon = document.querySelector('#theme-toggle i');
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        const session = DataStore.getSession();
        if (session) { session.theme = html.dataset.theme; DataStore.setSession(session); }
    },

    toggleLanguage() {
        const newLang = I18n.currentLang === 'en' ? 'fr' : 'en';
        I18n.setLang(newLang);
        document.getElementById('lang-toggle').textContent = newLang === 'en' ? 'FR' : 'EN';
        const session = DataStore.getSession();
        if (session) { session.lang = newLang; DataStore.setSession(session); }
        this.renderAll();
    },

    toast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const icons = { success:'fa-check-circle', error:'fa-exclamation-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3200);
    },

    confirm(message) {
        return new Promise(resolve => {
            document.getElementById('confirm-message').textContent = message;
            this.openModal('confirm');
            this._confirmResolve = resolve;
        });
    },

    _handleConfirmYes() {
        this.closeModal('confirm');
        if (this._confirmResolve) { this._confirmResolve(true); this._confirmResolve = null; }
    },

    _handleConfirmCancel() {
        this.closeModal('confirm');
        if (this._confirmResolve) { this._confirmResolve(false); this._confirmResolve = null; }
    },

    applyPermissions() {
        const role = Auth.currentUser.role;
        // Nav items
        ['departments','teams','customers','equipment','sales'].forEach(tab => {
            const el = document.querySelector(`[data-tab="${tab}"]`);
            if (el) el.style.display = role === 'Admin' ? 'flex' : 'none';
        });
        const membersNav = document.querySelector('[data-tab="members"]');
        if (membersNav) membersNav.style.display = (role === 'Admin' || role === 'Team Leader') ? 'flex' : 'none';
        // Quick actions
        const qa = document.getElementById('quick-actions-card');
        if (qa) qa.style.display = role === 'Team Worker' ? 'none' : '';
        ['qa-department','qa-team'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = role === 'Admin' ? 'flex' : 'none';
        });
        // New task buttons
        const btnNewTask = document.getElementById('btn-new-task');
        if (btnNewTask) btnNewTask.style.display = Auth.canCreateTask() ? 'inline-flex' : 'none';
        // Finance buttons
        ['btn-pay-worker','btn-log-expense'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = role === 'Team Worker' ? 'none' : 'inline-flex';
        });
        // Add member button
        const btnAddMember = document.getElementById('btn-add-member');
        if (btnAddMember) btnAddMember.style.display = role === 'Admin' ? 'inline-flex' : 'none';
        // Availability toggle in header
        const availToggle = document.getElementById('avail-toggle-header');
        if (availToggle) {
            if (role === 'Team Leader' || role === 'Team Worker') {
                availToggle.style.display = 'flex';
                this.updateHeaderAvailability();
            } else {
                availToggle.style.display = 'none';
            }
        }
        // User info
        document.getElementById('logged-user-name').textContent = Auth.currentUser.name;
        document.getElementById('logged-user-role').textContent = Auth.currentUser.role;
    },

    updateHeaderAvailability() {
        if (!Auth.currentUser || !Auth.currentUser.id) return;
        const member = DataStore.getById('members', Auth.currentUser.id);
        if (!member) return;
        const dot = document.getElementById('avail-header-dot');
        const text = document.getElementById('avail-header-text');
        const toggle = document.getElementById('avail-toggle-header');
        const isAvail = member.availability === 'Available';
        dot.className = `avail-dot ${isAvail ? 'available' : 'unavailable'}`;
        text.textContent = isAvail ? I18n.t('avail.available') : I18n.t('avail.notAvailable');
        toggle.className = `avail-toggle-header ${isAvail ? 'available' : 'unavailable'}`;
    },

    renderAll() {
        DashboardModule.render();
        TasksModule.render();
        DepartmentsModule.render();
        TeamsModule.render();
        CustomersModule.render();
        EquipmentModule.render();
        MembersModule.render();
        ReportsModule.render();
        FinanceModule.render();
        SalesModule.render();
    },

    globalSearch(query) {
        const results = [];
        if (!query || query.length < 2) return results;
        const q = query.toLowerCase();
        DataStore.getAll('tasks').forEach(t => {
            if (t.title.toLowerCase().includes(q)) results.push({ type:'Task', name:t.title, tab:'tasks' });
        });
        DataStore.getAll('members').forEach(m => {
            if (m.name.toLowerCase().includes(q)) results.push({ type:'Member', name:m.name, tab:'members' });
        });
        DataStore.getAll('customers').forEach(c => {
            if (c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)) results.push({ type:'Customer', name:`${c.name} - ${c.location}`, tab:'customers' });
        });
        DataStore.getAll('equipment').forEach(e => {
            if (e.name.toLowerCase().includes(q)) results.push({ type:'Equipment', name:e.name, tab:'equipment' });
        });
        return results.slice(0, 10);
    }
};

// ============================================================
// SECTION 5: DASHBOARD MODULE
// ============================================================
const DashboardModule = {
    render() {
        const depts = DataStore.getAll('departments');
        const teams = DataStore.getAll('teams');
        const members = DataStore.getAll('members');
        const customers = DataStore.getAll('customers');
        const equipment = DataStore.getAll('equipment');
        const tasks = DataStore.getAll('tasks');

        document.getElementById('stat-depts').textContent = depts.length;
        document.getElementById('stat-teams').textContent = teams.length;
        document.getElementById('stat-customers').textContent = customers.length;
        document.getElementById('stat-tasks').textContent = tasks.length;
        document.getElementById('stat-equipment').textContent = equipment.length;
        document.getElementById('stat-equip-avail').textContent = equipment.filter(e => e.status === 'Available').length;
        document.getElementById('stat-completed').textContent = tasks.filter(t => t.status === 'Completed').length;
        document.getElementById('stat-members').textContent = members.length;

        const availCount = members.filter(m => m.availability === 'Available').length;
        document.getElementById('stat-available-workers').textContent = `${availCount} / ${members.length}`;

        // Recent tasks
        const tbody = document.getElementById('dashboard-tasks-table');
        const filteredTasks = tasks.filter(t => {
            if (Auth.isAdmin()) return true;
            if (Auth.isLeader()) return t.teamId === Auth.currentUser.teamId;
            return t.assigneeIds && t.assigneeIds.includes(Auth.currentUser.id);
        });
        const recent = [...filteredTasks].reverse().slice(0, 5);

        if (recent.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:30px;">${I18n.t('msg.noTasks')}</td></tr>`;
            return;
        }

        tbody.innerHTML = recent.map(task => {
            const assignees = this._getAssigneeNames(task);
            const equipHtml = this._getEquipmentHtml(task);
            return `<tr>
                <td><strong>${this._esc(task.title)}</strong>${equipHtml}</td>
                <td>${this._getDeptName(task.departmentId)}</td>
                <td>${this._getTeamName(task.teamId)}</td>
                <td>${assignees}</td>
                <td>${this._getCustomerHtml(task.customerId)}</td>
                <td>${task.deadlineDate ? new Date(task.deadlineDate).toLocaleDateString() : 'N/A'}</td>
                <td>${this._getPriorityBadge(task.priority)}</td>
                <td>${this._getStatusBadge(task.status, task.id)}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="TasksModule.openInstructions(${task.id})" title="Instructions">
                        <i class="fa-solid fa-file-lines"></i>
                    </button>
                    ${Auth.isAdmin() ? `<button class="btn btn-outline btn-sm" onclick="TasksModule.openEditModal(${task.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>` : ''}
                    ${Auth.canDeleteTask() ? `<button class="btn btn-outline btn-sm" onclick="TasksModule.deleteTask(${task.id})"><i class="fa-solid fa-trash text-danger"></i></button>` : ''}
                </td>
            </tr>`;
        }).join('');
    },

    _esc(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; },
    _getDeptName(id) { const d = DataStore.getById('departments', id); return d ? d.name : 'Unknown'; },
    _getTeamName(id) { const t = DataStore.getById('teams', id); return t ? t.name : 'Unknown'; },
    _getAssigneeNames(task) {
        if (!task.assigneeIds || task.assigneeIds.length === 0) return '<span style="color:var(--text-secondary)">Unassigned</span>';
        return task.assigneeIds.map(id => {
            const m = DataStore.getById('members', id);
            if (!m) return 'Unknown';
            const dotClass = m.availability === 'Available' ? 'available' : 'unavailable';
            return `<span class="avail-badge"><span class="avail-dot ${dotClass}"></span>${m.name}</span>`;
        }).join(', ');
    },
    _getEquipmentHtml(task) {
        if (!task.equipmentIds || task.equipmentIds.length === 0) return '';
        const names = task.equipmentIds.map(id => { const e = DataStore.getById('equipment', id); return e ? e.name : 'Unknown'; });
        return `<div style="margin-top:3px;font-size:11px;color:var(--text-secondary);"><i class="fa-solid fa-toolbox"></i> ${names.join(', ')}</div>`;
    },
    _getCustomerHtml(id) {
        const c = DataStore.getById('customers', id);
        if (!c) return 'Unknown';
        return `<div class="team-name">${c.name}</div><div class="dept-subtext">${c.location}</div>`;
    },
    _getPriorityBadge(priority) {
        const cls = { 'High':'priority-high', 'Medium':'priority-medium', 'Low':'priority-low' };
        return `<span class="status-badge ${cls[priority] || 'priority-medium'}">${priority || 'Medium'}</span>`;
    },
    _getStatusBadge(status, taskId) {
        const cls = { 'Active':'status-active', 'Pending':'status-pending', 'Completed':'status-completed' };
        const canCycle = Auth.isAdmin() || Auth.isLeader() || (Auth.isWorker() && taskId);
        const click = canCycle ? ` onclick="TasksModule.cycleStatus(${taskId})"` : '';
        const clickClass = canCycle ? ' clickable' : '';
        return `<span class="status-badge ${cls[status] || ''}${clickClass}" title="Click to change status"${click}>${status}</span>`;
    }
};

// ============================================================
// SECTION 6: TASKS MODULE
// ============================================================
const TasksModule = {
    _editId: null,
    render() {
        const tbody = document.getElementById('all-tasks-table');
        if (!tbody) return;
        const tasks = DataStore.getAll('tasks');
        let filtered = tasks.filter(t => {
            if (Auth.isAdmin()) return true;
            if (Auth.isLeader()) return t.teamId === Auth.currentUser.teamId;
            return t.assigneeIds && t.assigneeIds.includes(Auth.currentUser.id);
        });

        // Apply filters
        const statusF = document.getElementById('filter-task-status')?.value;
        const priorityF = document.getElementById('filter-task-priority')?.value;
        const searchF = document.getElementById('filter-task-search')?.value?.toLowerCase();
        if (statusF) filtered = filtered.filter(t => t.status === statusF);
        if (priorityF) filtered = filtered.filter(t => t.priority === priorityF);
        if (searchF) filtered = filtered.filter(t => t.title.toLowerCase().includes(searchF));

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:30px;">${I18n.t('msg.noTasks')}</td></tr>`;
            return;
        }

        tbody.innerHTML = [...filtered].reverse().map(task => {
            const assignees = DashboardModule._getAssigneeNames(task);
            const equipHtml = DashboardModule._getEquipmentHtml(task);
            return `<tr>
                <td><strong>${DashboardModule._esc(task.title)}</strong>${equipHtml}</td>
                <td>${DashboardModule._getDeptName(task.departmentId)}</td>
                <td>${DashboardModule._getTeamName(task.teamId)}</td>
                <td>${assignees}</td>
                <td>${DashboardModule._getCustomerHtml(task.customerId)}</td>
                <td>${task.deadlineDate ? new Date(task.deadlineDate).toLocaleDateString() : 'N/A'}</td>
                <td>${DashboardModule._getPriorityBadge(task.priority)}</td>
                <td>${DashboardModule._getStatusBadge(task.status, task.id)}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="TasksModule.openInstructions(${task.id})" title="Instructions"><i class="fa-solid fa-file-lines"></i></button>
                    ${Auth.isAdmin() ? `<button class="btn btn-outline btn-sm" onclick="TasksModule.openEditModal(${task.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>` : ''}
                    ${Auth.canDeleteTask() ? `<button class="btn btn-outline btn-sm" onclick="TasksModule.deleteTask(${task.id})"><i class="fa-solid fa-trash text-danger"></i></button>` : ''}
                </td>
            </tr>`;
        }).join('');
    },

    openEditModal(id) {
        if (!Auth.isAdmin()) return;
        const task = DataStore.getById('tasks', id);
        if (!task) return;
        this._editId = id;

        // Populate customers dropdown
        const custSel = document.getElementById('task-customer');
        custSel.innerHTML = '<option value="">-- Select Customer --</option>' +
            DataStore.getAll('customers').map(c => `<option value="${c.id}">${c.name} - ${c.location}</option>`).join('');
        custSel.value = task.customerId;

        // Populate departments dropdown
        const deptSel = document.getElementById('task-department');
        deptSel.innerHTML = '<option value="">-- Select Department --</option>' +
            DataStore.getAll('departments').map(d => `<option value="${d.id}">${d.name}</option>`).join('');
        deptSel.value = task.departmentId;

        // Populate teams and select
        this.updateTeamDropdown();
        document.getElementById('task-team').value = task.teamId;

        // Populate assignees and check the right ones
        this._populateAssigneesForEdit(task.teamId, task.assigneeIds || []);

        // Populate equipment: show available + currently assigned
        this._populateEquipmentForEdit(task.equipmentIds || []);

        // Fill other fields
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-startDate').value = task.startDate || '';
        document.getElementById('task-deadlineDate').value = task.deadlineDate || '';
        document.getElementById('task-instructions').value = task.instructions || '';
        document.getElementById('task-priority').value = task.priority || 'Medium';
        document.getElementById('task-status').value = task.status || 'Pending';

        document.querySelector('#modal-task .modal-header h2').textContent = 'Edit Task';
        UI.openModal('task');
    },

    _populateAssigneesForEdit(teamId, checkedIds) {
        const container = document.getElementById('task-assignees-container');
        const hint = document.getElementById('task-avail-hint');
        const members = DataStore.query('members', m => m.teamId === teamId && m.accountStatus !== 'Deactivated');
        const availCount = members.filter(m => m.availability === 'Available').length;
        hint.textContent = `${availCount} / ${members.length} ${I18n.t('avail.available').toLowerCase()}`;
        container.innerHTML = members.map(m => {
            const isAvail = m.availability === 'Available';
            const unavailClass = isAvail ? '' : ' unavailable';
            const dotClass = isAvail ? 'available' : 'unavailable';
            const checked = checkedIds.includes(m.id) ? ' checked' : '';
            return `<label class="${unavailClass}">
                <input type="checkbox" name="task-assignee" value="${m.id}"${checked}>
                <span class="avail-dot ${dotClass}"></span>
                ${m.name} (${m.role})
            </label>`;
        }).join('');
    },

    _populateEquipmentForEdit(checkedIds) {
        const container = document.getElementById('task-equipment-list');
        // Show available equipment + equipment currently assigned to this task
        const allEquip = DataStore.getAll('equipment');
        const relevant = allEquip.filter(eq => eq.status === 'Available' || checkedIds.includes(eq.id));
        if (relevant.length === 0) {
            container.innerHTML = `<span style="color:var(--text-secondary);font-size:13px;">No equipment available.</span>`;
            return;
        }
        container.innerHTML = relevant.map(eq => {
            const icon = eq.type === 'Vehicle' ? 'fa-truck' : 'fa-wrench';
            const checked = checkedIds.includes(eq.id) ? ' checked' : '';
            return `<label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
                <input type="checkbox" name="task-equipment" value="${eq.id}"${checked}>
                <i class="fa-solid ${icon}" style="color:var(--text-secondary);"></i> ${eq.name}
            </label>`;
        }).join('');
    },

    openCreateModal() {
        if (!Auth.canCreateTask()) return;
        this._editId = null;
        document.querySelector('#modal-task .modal-header h2').textContent = I18n.t('modal.createTask');
        // Populate customers dropdown
        const custSel = document.getElementById('task-customer');
        custSel.innerHTML = '<option value="">-- Select Customer --</option>' +
            DataStore.getAll('customers').map(c => `<option value="${c.id}">${c.name} - ${c.location}</option>`).join('');

        // Populate departments dropdown
        const deptSel = document.getElementById('task-department');
        deptSel.innerHTML = '<option value="">-- Select Department --</option>' +
            DataStore.getAll('departments').map(d => `<option value="${d.id}">${d.name}</option>`).join('');

        // Reset team/assignees/equipment
        document.getElementById('task-team').innerHTML = '<option value="">-- Select Team --</option>';
        document.getElementById('task-assignees-container').innerHTML = `<span style="color:var(--text-secondary);font-size:13px;">${I18n.t('form.selectTeam')}</span>`;
        document.getElementById('task-avail-hint').textContent = '';
        this._populateEquipment();

        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('task-startDate').value = today;
        const deadline = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
        document.getElementById('task-deadlineDate').value = deadline;

        UI.openModal('task');
    },

    updateTeamDropdown() {
        const deptId = parseInt(document.getElementById('task-department').value);
        const teamSel = document.getElementById('task-team');
        teamSel.innerHTML = '<option value="">-- Select Team --</option>';
        if (!deptId) return;
        DataStore.query('teams', t => t.departmentId === deptId).forEach(t => {
            teamSel.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });
        document.getElementById('task-assignees-container').innerHTML = `<span style="color:var(--text-secondary);font-size:13px;">${I18n.t('form.selectTeam')}</span>`;
        document.getElementById('task-avail-hint').textContent = '';
    },

    updateAssigneeDropdown() {
        const teamId = parseInt(document.getElementById('task-team').value);
        const container = document.getElementById('task-assignees-container');
        const hint = document.getElementById('task-avail-hint');
        if (!teamId) {
            container.innerHTML = `<span style="color:var(--text-secondary);font-size:13px;">${I18n.t('form.selectTeam')}</span>`;
            hint.textContent = '';
            return;
        }
        const members = DataStore.query('members', m => m.teamId === teamId && m.accountStatus !== 'Deactivated');
        const availCount = members.filter(m => m.availability === 'Available').length;
        hint.textContent = `${availCount} / ${members.length} ${I18n.t('avail.available').toLowerCase()}`;

        container.innerHTML = members.map(m => {
            const isAvail = m.availability === 'Available';
            const unavailClass = isAvail ? '' : ' unavailable';
            const dotClass = isAvail ? 'available' : 'unavailable';
            return `<label class="${unavailClass}">
                <input type="checkbox" name="task-assignee" value="${m.id}" ${isAvail ? '' : ''}>
                <span class="avail-dot ${dotClass}"></span>
                ${m.name} (${m.role})
            </label>`;
        }).join('');
    },

    _populateEquipment() {
        const container = document.getElementById('task-equipment-list');
        const available = DataStore.query('equipment', e => e.status === 'Available');
        if (available.length === 0) {
            container.innerHTML = `<span style="color:var(--text-secondary);font-size:13px;">No equipment available.</span>`;
            return;
        }
        container.innerHTML = available.map(eq => {
            const icon = eq.type === 'Vehicle' ? 'fa-truck' : 'fa-wrench';
            return `<label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;">
                <input type="checkbox" name="task-equipment" value="${eq.id}">
                <i class="fa-solid ${icon}" style="color:var(--text-secondary);"></i> ${eq.name}
            </label>`;
        }).join('');
    },

    submitTask(e) {
        e.preventDefault();
        const assigneeEls = document.querySelectorAll('input[name="task-assignee"]:checked');
        const equipEls = document.querySelectorAll('input[name="task-equipment"]:checked');
        const assigneeIds = Array.from(assigneeEls).map(el => parseInt(el.value));
        const equipmentIds = Array.from(equipEls).map(el => parseInt(el.value));

        const data = {
            title: document.getElementById('task-title').value.trim(),
            customerId: parseInt(document.getElementById('task-customer').value),
            startDate: document.getElementById('task-startDate').value,
            deadlineDate: document.getElementById('task-deadlineDate').value,
            departmentId: parseInt(document.getElementById('task-department').value),
            teamId: parseInt(document.getElementById('task-team').value),
            assigneeIds,
            equipmentIds,
            instructions: document.getElementById('task-instructions').value.trim(),
            priority: document.getElementById('task-priority').value,
            status: document.getElementById('task-status').value
        };

        if (this._editId) {
            // Release old equipment
            const oldTask = DataStore.getById('tasks', this._editId);
            if (oldTask && oldTask.equipmentIds) {
                oldTask.equipmentIds.forEach(eqId => {
                    if (!equipmentIds.includes(eqId)) {
                        DataStore.update('equipment', eqId, { status: 'Available' });
                    }
                });
            }
            // Mark new equipment as In Use
            equipmentIds.forEach(eqId => {
                DataStore.update('equipment', eqId, { status: 'In Use' });
            });
            DataStore.update('tasks', this._editId, data);
            this._editId = null;
            UI.closeModal('task');
            UI.toast(I18n.t('msg.saved'), 'success');
            UI.renderAll();
            return;
        }

        // Create mode
        data.completedAt = null;
        data.paymentStatus = 'Unpaid';
        data.paymentAmount = null;
        data.paymentMethod = null;
        DataStore.create('tasks', data);

        // Mark equipment as In Use
        equipmentIds.forEach(eqId => {
            DataStore.update('equipment', eqId, { status: 'In Use' });
        });

        UI.closeModal('task');
        UI.toast(I18n.t('msg.created'), 'success');
        UI.renderAll();
    },

    cycleStatus(id) {
        const task = DataStore.getById('tasks', id);
        if (!task) return;
        // Permission check
        if (Auth.isWorker() && (!task.assigneeIds || !task.assigneeIds.includes(Auth.currentUser.id))) return;
        if (Auth.isLeader() && task.teamId !== Auth.currentUser.teamId) return;

        const cycle = { 'Pending':'Active', 'Active':'Completed', 'Completed':'Pending' };
        const newStatus = cycle[task.status] || 'Pending';
        const completedAt = newStatus === 'Completed' ? new Date().toISOString() : null;

        DataStore.update('tasks', id, { status: newStatus, completedAt });

        // Sync equipment status
        if (task.equipmentIds && task.equipmentIds.length > 0) {
            const eqStatus = newStatus === 'Completed' ? 'Available' : (newStatus === 'Pending' ? 'Available' : 'In Use');
            task.equipmentIds.forEach(eqId => {
                DataStore.update('equipment', eqId, { status: eqStatus });
            });
        }

        UI.renderAll();
    },

    async deleteTask(id) {
        const confirmed = await UI.confirm(I18n.t('msg.deleteConfirm'));
        if (!confirmed) return;
        const task = DataStore.getById('tasks', id);
        if (task && task.equipmentIds) {
            task.equipmentIds.forEach(eqId => DataStore.update('equipment', eqId, { status: 'Available' }));
        }
        DataStore.delete('tasks', id);
        UI.toast(I18n.t('msg.deleted'), 'info');
        UI.renderAll();
    },

    openInstructions(id) {
        const task = DataStore.getById('tasks', id);
        if (!task) return;
        document.getElementById('instruction-task-id').value = id;
        document.getElementById('instruction-text').value = task.instructions || '';
        UI.openModal('instruction');
    },

    saveInstructions(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('instruction-task-id').value);
        const text = document.getElementById('instruction-text').value.trim();
        DataStore.update('tasks', id, { instructions: text });
        UI.closeModal('instruction');
        UI.toast(I18n.t('msg.saved'), 'success');
        UI.renderAll();
    }
};

// ============================================================
// SECTION 7: DEPARTMENTS MODULE
// ============================================================
const DepartmentsModule = {
    _editId: null,

    openCreateModal() {
        this._editId = null;
        document.getElementById('dept-name').value = '';
        document.querySelector('#modal-department .modal-header h2').textContent = I18n.t('modal.addDept');
        UI.openModal('department');
    },

    openEditModal(id) {
        if (!Auth.isAdmin()) return;
        const dept = DataStore.getById('departments', id);
        if (!dept) return;
        this._editId = id;
        document.getElementById('dept-name').value = dept.name;
        document.querySelector('#modal-department .modal-header h2').textContent = 'Edit Department';
        UI.openModal('department');
    },

    render() {
        const tbody = document.getElementById('departments-table');
        if (!tbody) return;
        const depts = DataStore.getAll('departments');
        if (depts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-secondary);padding:30px;">${I18n.t('msg.noDepts')}</td></tr>`;
            return;
        }
        tbody.innerHTML = depts.map(d => `<tr>
            <td>DEP-${String(d.id).padStart(3,'0')}</td>
            <td><strong>${DashboardModule._esc(d.name)}</strong></td>
            <td>${Auth.isAdmin() ? `<button class="btn btn-outline btn-sm" onclick="DepartmentsModule.openEditModal(${d.id})" title="Edit"><i class="fa-solid fa-pen"></i></button> <button class="btn btn-outline btn-sm text-danger" onclick="DepartmentsModule.delete(${d.id})"><i class="fa-solid fa-trash"></i></button>` : ''}</td>
        </tr>`).join('');
    },
    submit(e) {
        e.preventDefault();
        const name = document.getElementById('dept-name').value.trim();
        if (this._editId) {
            DataStore.update('departments', this._editId, { name });
            this._editId = null;
            UI.toast(I18n.t('msg.saved'), 'success');
        } else {
            DataStore.create('departments', { name });
            UI.toast(I18n.t('msg.created'), 'success');
        }
        UI.closeModal('department');
        UI.renderAll();
    },
    async delete(id) {
        if (!Auth.isAdmin()) return;
        const confirmed = await UI.confirm(I18n.t('msg.deleteConfirm'));
        if (!confirmed) return;
        DataStore.delete('departments', id);
        UI.toast(I18n.t('msg.deleted'), 'info');
        UI.renderAll();
    }
};

// ============================================================
// SECTION 8: TEAMS MODULE
// ============================================================
const TeamsModule = {
    _editId: null,

    openEditModal(id) {
        if (!Auth.isAdmin()) return;
        const team = DataStore.getById('teams', id);
        if (!team) return;
        this._editId = id;
        const sel = document.getElementById('team-department');
        sel.innerHTML = '<option value="">-- Select --</option>' +
            DataStore.getAll('departments').map(d => `<option value="${d.id}">${d.name}</option>`).join('');
        sel.value = team.departmentId;
        document.getElementById('team-name').value = team.name;
        document.getElementById('team-fields').value = team.fields || '';
        document.querySelector('#modal-team .modal-header h2').textContent = 'Edit Team';
        UI.openModal('team');
    },

    render() {
        const tbody = document.getElementById('teams-table');
        if (!tbody) return;
        const teams = DataStore.getAll('teams');
        if (teams.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-secondary);padding:30px;">${I18n.t('msg.noTeams')}</td></tr>`;
            return;
        }
        tbody.innerHTML = teams.map(t => `<tr>
            <td><strong>${DashboardModule._esc(t.name)}</strong></td>
            <td>${DashboardModule._getDeptName(t.departmentId)}</td>
            <td>${t.fields || 'N/A'}</td>
            <td>${Auth.isAdmin() ? `<button class="btn btn-outline btn-sm" onclick="TeamsModule.openEditModal(${t.id})" title="Edit"><i class="fa-solid fa-pen"></i></button> <button class="btn btn-outline btn-sm text-danger" onclick="TeamsModule.delete(${t.id})"><i class="fa-solid fa-trash"></i></button>` : ''}</td>
        </tr>`).join('');
    },
    openModal() {
        this._editId = null;
        const sel = document.getElementById('team-department');
        sel.innerHTML = '<option value="">-- Select --</option>' +
            DataStore.getAll('departments').map(d => `<option value="${d.id}">${d.name}</option>`).join('');
        document.getElementById('team-name').value = '';
        document.getElementById('team-fields').value = '';
        document.querySelector('#modal-team .modal-header h2').textContent = I18n.t('modal.formTeam');
        UI.openModal('team');
    },
    submit(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('team-name').value.trim(),
            departmentId: parseInt(document.getElementById('team-department').value),
            fields: document.getElementById('team-fields').value.trim()
        };
        if (this._editId) {
            DataStore.update('teams', this._editId, data);
            this._editId = null;
            UI.toast(I18n.t('msg.saved'), 'success');
        } else {
            DataStore.create('teams', data);
            UI.toast(I18n.t('msg.created'), 'success');
        }
        UI.closeModal('team');
        UI.renderAll();
    },
    async delete(id) {
        if (!Auth.isAdmin()) return;
        const confirmed = await UI.confirm(I18n.t('msg.deleteConfirm'));
        if (!confirmed) return;
        DataStore.delete('teams', id);
        UI.toast(I18n.t('msg.deleted'), 'info');
        UI.renderAll();
    }
};

// ============================================================
// SECTION 9: CUSTOMERS MODULE
// ============================================================
const CustomersModule = {
    _editId: null,

    openCreateModal() {
        this._editId = null;
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-location').value = '';
        document.querySelector('#modal-customer .modal-header h2').textContent = I18n.t('modal.addCustomer');
        UI.openModal('customer');
    },

    openEditModal(id) {
        if (!Auth.isAdmin()) return;
        const c = DataStore.getById('customers', id);
        if (!c) return;
        this._editId = id;
        document.getElementById('customer-name').value = c.name;
        document.getElementById('customer-location').value = c.location;
        document.querySelector('#modal-customer .modal-header h2').textContent = 'Edit Customer';
        UI.openModal('customer');
    },

    render() {
        const tbody = document.getElementById('customers-table');
        if (!tbody) return;
        const custs = DataStore.getAll('customers');
        if (custs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-secondary);padding:30px;">${I18n.t('msg.noCustomers')}</td></tr>`;
            return;
        }
        tbody.innerHTML = custs.map(c => `<tr>
            <td><strong>${DashboardModule._esc(c.name)}</strong></td>
            <td>${DashboardModule._esc(c.location)}</td>
            <td>${Auth.isAdmin() ? `<button class="btn btn-outline btn-sm" onclick="CustomersModule.openEditModal(${c.id})" title="Edit"><i class="fa-solid fa-pen"></i></button> <button class="btn btn-outline btn-sm text-danger" onclick="CustomersModule.delete(${c.id})"><i class="fa-solid fa-trash"></i></button>` : ''}</td>
        </tr>`).join('');
    },
    submit(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('customer-name').value.trim(),
            location: document.getElementById('customer-location').value.trim()
        };
        if (this._editId) {
            DataStore.update('customers', this._editId, data);
            this._editId = null;
            UI.toast(I18n.t('msg.saved'), 'success');
        } else {
            DataStore.create('customers', data);
            UI.toast(I18n.t('msg.created'), 'success');
        }
        UI.closeModal('customer');
        UI.renderAll();
    },
    async delete(id) {
        if (!Auth.isAdmin()) return;
        const confirmed = await UI.confirm(I18n.t('msg.deleteConfirm'));
        if (!confirmed) return;
        DataStore.delete('customers', id);
        UI.toast(I18n.t('msg.deleted'), 'info');
        UI.renderAll();
    }
};

// ============================================================
// SECTION 10: EQUIPMENT MODULE
// ============================================================
const EquipmentModule = {
    _editId: null,

    openCreateModal() {
        this._editId = null;
        document.getElementById('equipment-name').value = '';
        document.getElementById('equipment-type').value = 'Tool';
        document.querySelector('#modal-equipment .modal-header h2').textContent = I18n.t('modal.addEquip');
        UI.openModal('equipment');
    },

    openEditModal(id) {
        if (!Auth.isAdmin()) return;
        const eq = DataStore.getById('equipment', id);
        if (!eq) return;
        this._editId = id;
        document.getElementById('equipment-name').value = eq.name;
        document.getElementById('equipment-type').value = eq.type;
        document.querySelector('#modal-equipment .modal-header h2').textContent = 'Edit Equipment';
        UI.openModal('equipment');
    },

    render() {
        const tbody = document.getElementById('equipment-table');
        if (!tbody) return;
        const equip = DataStore.getAll('equipment');
        if (equip.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-secondary);padding:30px;">${I18n.t('msg.noEquipment')}</td></tr>`;
            return;
        }
        tbody.innerHTML = equip.map(eq => {
            const icon = eq.type === 'Vehicle' ? '<i class="fa-solid fa-truck"></i> Vehicle' : '<i class="fa-solid fa-wrench"></i> Tool';
            const statusClass = eq.status === 'Available' ? 'status-completed' : 'status-active';
            const inUse = eq.status === 'In Use';
            return `<tr>
                <td><strong>${DashboardModule._esc(eq.name)}</strong></td>
                <td>${icon}</td>
                <td><span class="status-badge ${statusClass}">${eq.status}</span></td>
                <td>${Auth.isAdmin() ? `<button class="btn btn-outline btn-sm" onclick="EquipmentModule.openEditModal(${eq.id})" title="Edit"><i class="fa-solid fa-pen"></i></button> <button class="btn btn-outline btn-sm text-danger" onclick="EquipmentModule.delete(${eq.id})" ${inUse ? 'disabled title="'+I18n.t('msg.cannotDeleteEquip')+'"' : ''}><i class="fa-solid fa-trash"></i></button>` : ''}</td>
            </tr>`;
        }).join('');
    },
    submit(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('equipment-name').value.trim(),
            type: document.getElementById('equipment-type').value
        };
        if (this._editId) {
            DataStore.update('equipment', this._editId, data);
            this._editId = null;
            UI.toast(I18n.t('msg.saved'), 'success');
        } else {
            data.status = 'Available';
            DataStore.create('equipment', data);
            UI.toast(I18n.t('msg.created'), 'success');
        }
        UI.closeModal('equipment');
        UI.renderAll();
    },
    async delete(id) {
        if (!Auth.isAdmin()) return;
        const eq = DataStore.getById('equipment', id);
        if (eq && eq.status === 'In Use') { UI.toast(I18n.t('msg.cannotDeleteEquip'), 'error'); return; }
        const confirmed = await UI.confirm(I18n.t('msg.deleteConfirm'));
        if (!confirmed) return;
        DataStore.delete('equipment', id);
        UI.toast(I18n.t('msg.deleted'), 'info');
        UI.renderAll();
    }
};

// ============================================================
// SECTION 11: MEMBERS MODULE
// ============================================================
const MembersModule = {
    _editId: null,

    openEditModal(id) {
        if (!Auth.isAdmin()) return;
        const m = DataStore.getById('members', id);
        if (!m) return;
        this._editId = id;
        document.getElementById('member-name').value = m.name;
        document.getElementById('member-role').value = m.role;
        document.getElementById('member-type').value = m.type;
        document.getElementById('member-hiring-date').value = m.hiringDate || '';
        // Handle password section - hide during edit
        document.getElementById('member-password-section').style.display = 'none';
        document.getElementById('member-password').removeAttribute('required');
        document.getElementById('member-password-confirm').removeAttribute('required');
        // Handle team fields
        const teamFields = document.getElementById('member-team-fields');
        if (m.role === 'Admin') {
            teamFields.style.display = 'none';
        } else {
            teamFields.style.display = 'block';
            const deptSel = document.getElementById('member-department');
            deptSel.innerHTML = '<option value="">-- Select --</option>' +
                DataStore.getAll('departments').map(d => `<option value="${d.id}">${d.name}</option>`).join('');
            // Find dept from team
            const team = DataStore.getById('teams', m.teamId);
            if (team) {
                deptSel.value = team.departmentId;
                this.updateTeamDropdown();
                document.getElementById('member-team').value = m.teamId;
            }
        }
        document.querySelector('#modal-member .modal-header h2').textContent = 'Edit Member';
        UI.openModal('member');
    },

    render() {
        const tbody = document.getElementById('members-table');
        if (!tbody) return;

        // Populate team filter dropdown
        const teamFilter = document.getElementById('filter-member-team');
        if (teamFilter) {
            const currentVal = teamFilter.value;
            teamFilter.innerHTML = '<option value="">All Teams</option>' +
                DataStore.getAll('teams').map(t => `<option value="${t.id}">${t.name}</option>`).join('');
            teamFilter.value = currentVal;
        }

        let members = DataStore.getAll('members');
        // Role-based filtering
        if (Auth.isLeader()) members = members.filter(m => m.teamId === Auth.currentUser.teamId);
        else if (Auth.isWorker()) { tbody.innerHTML = ''; return; }

        // Apply UI filters
        const teamF = document.getElementById('filter-member-team')?.value;
        const roleF = document.getElementById('filter-member-role')?.value;
        const availF = document.getElementById('filter-member-avail')?.value;
        if (teamF) members = members.filter(m => m.teamId === parseInt(teamF));
        if (roleF) members = members.filter(m => m.role === roleF);
        if (availF) members = members.filter(m => m.availability === availF);

        if (members.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-secondary);padding:30px;">${I18n.t('msg.noMembers')}</td></tr>`;
            return;
        }

        tbody.innerHTML = members.map(m => {
            const team = DataStore.getById('teams', m.teamId);
            const teamName = team ? team.name : 'Unknown';
            const deptName = team ? DashboardModule._getDeptName(team.departmentId) : 'Unknown';
            const roleClass = m.role === 'Team Leader' ? 'role-leader' : 'role-worker';
            const isAvail = m.availability === 'Available';
            const canToggle = Auth.canToggleAvailability(m.id);
            const toggleBtn = canToggle ?
                `<button class="avail-toggle-btn ${isAvail ? 'available' : 'unavailable'}" onclick="MembersModule.toggleAvailability(${m.id})">
                    <span class="avail-dot ${isAvail ? 'available' : 'unavailable'}"></span>
                    ${isAvail ? I18n.t('avail.available') : I18n.t('avail.notAvailable')}
                </button>` :
                `<span class="avail-badge"><span class="avail-dot ${isAvail ? 'available' : 'unavailable'}"></span>${isAvail ? I18n.t('avail.available') : I18n.t('avail.notAvailable')}</span>`;

            const isActive = m.accountStatus !== 'Deactivated';
            const acctBtn = Auth.isAdmin() ? `<button class="btn btn-outline btn-sm ${isActive ? '' : 'text-danger'}" onclick="MembersModule.toggleAccountStatus(${m.id})" title="${isActive ? 'Deactivate' : 'Activate'}"><i class="fa-solid ${isActive ? 'fa-user-check' : 'fa-user-slash'}"></i></button>` : '';

            return `<tr${!isActive ? ' style="opacity:0.5"' : ''}>
                <td><strong>${DashboardModule._esc(m.name)}</strong>${!isActive ? ' <span class="status-badge status-pending" style="font-size:10px;">Deactivated</span>' : ''}</td>
                <td><span class="status-badge ${roleClass}">${m.role}</span></td>
                <td>${m.type || 'N/A'}</td>
                <td>${m.hiringDate || 'N/A'}</td>
                <td>${teamName}</td>
                <td>${deptName}</td>
                <td>${toggleBtn}</td>
                <td>${Auth.isAdmin() ? `${acctBtn} <button class="btn btn-outline btn-sm" onclick="MembersModule.resetPassword(${m.id})" title="Reset Password"><i class="fa-solid fa-key"></i></button> <button class="btn btn-outline btn-sm" onclick="MembersModule.openEditModal(${m.id})" title="Edit"><i class="fa-solid fa-pen"></i></button> <button class="btn btn-outline btn-sm text-danger" onclick="MembersModule.delete(${m.id})"><i class="fa-solid fa-trash"></i></button>` : ''}</td>
            </tr>`;
        }).join('');
    },

    toggleAvailability(id) {
        const m = DataStore.getById('members', id);
        if (!m || !Auth.canToggleAvailability(id)) return;
        const newAvail = m.availability === 'Available' ? 'Not Available' : 'Available';
        DataStore.update('members', id, { availability: newAvail });
        UI.updateHeaderAvailability();
        UI.renderAll();
    },

    openModal() {
        this._editId = null;
        const deptSel = document.getElementById('member-department');
        deptSel.innerHTML = '<option value="">-- Select --</option>' +
            DataStore.getAll('departments').map(d => `<option value="${d.id}">${d.name}</option>`).join('');
        document.getElementById('member-team').innerHTML = '<option value="">-- Select --</option>';
        // Reset team fields visibility and password strength
        const teamFields = document.getElementById('member-team-fields');
        if (teamFields) teamFields.style.display = 'block';
        // Show password section and restore required
        document.getElementById('member-password-section').style.display = 'block';
        document.getElementById('member-password').setAttribute('required', '');
        document.getElementById('member-password-confirm').setAttribute('required', '');
        const strengthEl = document.getElementById('member-pw-strength');
        if (strengthEl) strengthEl.textContent = '';
        document.getElementById('member-role').value = 'Team Leader';
        document.querySelector('#modal-member .modal-header h2').textContent = I18n.t('modal.addMember');
        UI.openModal('member');
    },

    updateTeamDropdown() {
        const deptId = parseInt(document.getElementById('member-department').value);
        const teamSel = document.getElementById('member-team');
        teamSel.innerHTML = '<option value="">-- Select --</option>';
        if (!deptId) return;
        DataStore.query('teams', t => t.departmentId === deptId).forEach(t => {
            teamSel.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });
    },

    submit(e) {
        e.preventDefault();
        const role = document.getElementById('member-role').value;
        const teamId = role === 'Admin' ? null : parseInt(document.getElementById('member-team').value);
        if (role !== 'Admin' && !teamId) {
            UI.toast('Please select a team.', 'warning');
            return;
        }

        if (this._editId) {
            // Edit mode — update without touching password
            DataStore.update('members', this._editId, {
                name: document.getElementById('member-name').value.trim(),
                role,
                type: document.getElementById('member-type').value,
                hiringDate: document.getElementById('member-hiring-date').value,
                teamId
            });
            this._editId = null;
            UI.closeModal('member');
            UI.toast(I18n.t('msg.saved'), 'success');
            UI.renderAll();
            return;
        }

        // Create mode — require password
        const pw = document.getElementById('member-password').value;
        const pwConfirm = document.getElementById('member-password-confirm').value;
        const result = PasswordUtil.validate(pw);
        if (!result.valid) {
            UI.toast(I18n.t('msg.pwWeak'), 'error');
            return;
        }
        if (pw !== pwConfirm) {
            UI.toast(I18n.t('msg.pwNoMatch'), 'error');
            return;
        }

        DataStore.create('members', {
            name: document.getElementById('member-name').value.trim(),
            role,
            type: document.getElementById('member-type').value,
            hiringDate: document.getElementById('member-hiring-date').value,
            teamId,
            password: pw,
            availability: 'Available',
            accountStatus: 'Active'
        });
        UI.closeModal('member');
        UI.toast(I18n.t('msg.created'), 'success');
        UI.renderAll();
    },

    async toggleAccountStatus(id) {
        if (!Auth.isAdmin()) return;
        const member = DataStore.getById('members', id);
        if (!member) return;
        const newStatus = member.accountStatus === 'Active' ? 'Deactivated' : 'Active';
        const msg = newStatus === 'Deactivated' ? 'Deactivate this member account?' : 'Reactivate this member account?';
        const confirmed = await UI.confirm(msg);
        if (!confirmed) return;
        DataStore.update('members', id, { accountStatus: newStatus });
        UI.toast(`Account ${newStatus.toLowerCase()}`, 'info');
        UI.renderAll();
    },

    resetPassword(id) {
        if (!Auth.isAdmin()) return;
        const member = DataStore.getById('members', id);
        if (!member) return;
        document.getElementById('reset-pw-member-id').value = id;
        document.getElementById('reset-pw-member-name').textContent = member.name;
        document.getElementById('reset-pw-new').value = '';
        document.getElementById('reset-pw-confirm').value = '';
        document.getElementById('reset-pw-strength').textContent = '';
        document.getElementById('reset-pw-error').style.display = 'none';
        UI.openModal('reset-password');
    },

    submitResetPassword(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('reset-pw-member-id').value);
        const newPw = document.getElementById('reset-pw-new').value;
        const conf = document.getElementById('reset-pw-confirm').value;
        const errEl = document.getElementById('reset-pw-error');
        errEl.style.display = 'none';
        if (newPw !== conf) { errEl.textContent = I18n.t('msg.pwMismatch'); errEl.style.display = 'block'; return; }
        const result = PasswordUtil.validate(newPw);
        if (!result.valid) { errEl.textContent = I18n.t('msg.pwWeak'); errEl.style.display = 'block'; return; }
        DataStore.update('members', id, { password: newPw });
        UI.closeModal('reset-password');
        UI.toast('Password reset successfully', 'success');
    },

    async delete(id) {
        if (!Auth.isAdmin()) return;
        const confirmed = await UI.confirm(I18n.t('msg.deleteConfirm'));
        if (!confirmed) return;
        DataStore.delete('members', id);
        UI.toast(I18n.t('msg.deleted'), 'info');
        UI.renderAll();
    }
};

// ============================================================
// SECTION 12: REPORTS / STATS MODULE
// ============================================================
const ReportsModule = {
    currentTimeframe: 'Monthly',

    render() {
        const tasks = DataStore.getAll('tasks');
        const tf = this.currentTimeframe;
        const msMap = { 'Daily': 86400000, 'Weekly': 86400000 * 7, 'Monthly': 86400000 * 30 };
        const ms = msMap[tf] || Infinity;
        const now = Date.now();

        let filtered = tasks;
        if (ms !== Infinity) {
            filtered = tasks.filter(t => {
                const d = t.createdAt ? new Date(t.createdAt).getTime() : 0;
                return (now - d) <= ms;
            });
        }

        // Role filter
        if (Auth.isLeader()) filtered = filtered.filter(t => t.teamId === Auth.currentUser.teamId);
        if (Auth.isWorker()) filtered = filtered.filter(t => t.assigneeIds && t.assigneeIds.includes(Auth.currentUser.id));

        document.getElementById('stats-total').textContent = filtered.length;
        document.getElementById('stats-completed').textContent = filtered.filter(t => t.status === 'Completed').length;

        // Team performance
        const teamTbody = document.getElementById('stats-team-table');
        const teams = DataStore.getAll('teams');
        teamTbody.innerHTML = teams.map(team => {
            const teamTasks = filtered.filter(t => t.teamId === team.id);
            const completed = teamTasks.filter(t => t.status === 'Completed').length;
            const pending = teamTasks.filter(t => t.status === 'Pending').length;
            return `<tr>
                <td><strong>${team.name}</strong></td>
                <td class="text-success">${completed}</td>
                <td class="text-warning">${pending}</td>
                <td>${teamTasks.length}</td>
            </tr>`;
        }).join('');

        // Worker performance
        const workerTbody = document.getElementById('stats-worker-table');
        const members = DataStore.getAll('members');
        workerTbody.innerHTML = members.map(m => {
            const team = DataStore.getById('teams', m.teamId);
            const mTasks = filtered.filter(t => t.assigneeIds && t.assigneeIds.includes(m.id));
            const completed = mTasks.filter(t => t.status === 'Completed').length;
            const pending = mTasks.filter(t => t.status === 'Pending').length;
            return `<tr>
                <td><strong>${m.name}</strong></td>
                <td>${team ? team.name : 'Unknown'}</td>
                <td class="text-success">${completed}</td>
                <td class="text-warning">${pending}</td>
            </tr>`;
        }).join('');
    }
};

// ============================================================
// SECTION 13: FINANCE MODULE
// ============================================================
const FinanceModule = {
    currentTimeframe: 'Monthly',

    render() {
        const now = Date.now();
        const msMap = { 'Daily':86400000, 'Weekly':86400000*7, 'Monthly':86400000*30 };
        const ms = this.currentTimeframe === 'All Time' ? Infinity : (msMap[this.currentTimeframe] || Infinity);
        const inPeriod = (dateStr) => {
            if (ms === Infinity) return true;
            if (!dateStr) return false;
            return (now - new Date(dateStr).getTime()) <= ms;
        };

        this._renderBilling();
        this._renderPayroll(inPeriod);
        this._renderExpenses(inPeriod);
        this._renderSummary(inPeriod);
    },

    _renderBilling() {
        const tbody = document.getElementById('finance-billing-table');
        if (!tbody) return;
        if (!Auth.isAdmin()) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-secondary);padding:20px;">${I18n.t('msg.restricted')}</td></tr>`;
            return;
        }
        const completed = DataStore.query('tasks', t => t.status === 'Completed');
        if (completed.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-secondary);padding:20px;">No completed tasks.</td></tr>`;
            return;
        }
        tbody.innerHTML = completed.map(task => {
            const statusClass = task.paymentStatus === 'Paid' ? 'status-paid' : 'status-unpaid';
            const amount = task.paymentAmount ? `${parseFloat(task.paymentAmount).toLocaleString()} ${CONFIG.CURRENCY}` : '-';
            const method = task.paymentMethod || '-';
            const action = task.paymentStatus === 'Paid'
                ? `<span class="text-success"><i class="fa-solid fa-check"></i> ${I18n.t('msg.settled')}</span>`
                : `<button class="btn btn-outline btn-sm" onclick="FinanceModule.openCustomerPayment(${task.id})">Record Payment</button>`;
            return `<tr>
                <td><strong>${task.title}</strong></td>
                <td>${DashboardModule._getCustomerHtml(task.customerId)}</td>
                <td><span class="status-badge ${statusClass}">${task.paymentStatus || 'Unpaid'}</span></td>
                <td>${amount}</td>
                <td>${method}</td>
                <td>${action}</td>
            </tr>`;
        }).join('');
    },

    _renderPayroll(inPeriod) {
        const payrollTbody = document.getElementById('finance-payroll-table');
        const logTbody = document.getElementById('finance-payments-log');
        if (!payrollTbody || !logTbody) return;

        let payments = DataStore.getAll('workerPayments').filter(p => inPeriod(p.date));
        // Role filter
        if (Auth.isWorker()) payments = payments.filter(p => p.workerId === Auth.currentUser.id);
        if (Auth.isLeader()) payments = payments.filter(p => {
            const w = DataStore.getById('members', p.workerId);
            return w && w.teamId === Auth.currentUser.teamId;
        });

        // Aggregate
        const members = DataStore.getAll('members');
        const agg = {};
        members.forEach(m => { agg[m.id] = { name:m.name, teamId:m.teamId, total:0 }; });
        payments.forEach(p => { if (agg[p.workerId]) agg[p.workerId].total += parseFloat(p.amount); });

        const aggArr = Object.values(agg);
        if (aggArr.length === 0) {
            payrollTbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-secondary);">No workers.</td></tr>`;
        } else {
            payrollTbody.innerHTML = aggArr.map(w => {
                const team = DataStore.getById('teams', w.teamId);
                const cls = w.total > 0 ? 'text-success' : 'text-secondary';
                return `<tr><td><strong>${w.name}</strong></td><td>${team ? team.name : 'Unknown'}</td><td><strong class="${cls}">${w.total.toLocaleString()} ${CONFIG.CURRENCY}</strong></td></tr>`;
            }).join('');
        }

        if (payments.length === 0) {
            logTbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-secondary);">${I18n.t('msg.noPayments')}</td></tr>`;
        } else {
            logTbody.innerHTML = [...payments].reverse().map(p => {
                const w = DataStore.getById('members', p.workerId);
                return `<tr><td><strong>${w ? w.name : 'Unknown'}</strong></td><td class="text-success">+${parseFloat(p.amount).toLocaleString()} ${CONFIG.CURRENCY}</td><td>${p.method}</td><td>${p.date}</td></tr>`;
            }).join('');
        }
    },

    _renderExpenses(inPeriod) {
        const deptTbody = document.getElementById('finance-expenses-dept-table');
        const logTbody = document.getElementById('finance-expenses-log');
        if (!deptTbody || !logTbody) return;

        let expenses = DataStore.getAll('expenses').filter(e => inPeriod(e.date));
        if (Auth.isWorker()) expenses = expenses.filter(e => e.workerId === Auth.currentUser.id);
        if (Auth.isLeader()) expenses = expenses.filter(e => {
            const w = DataStore.getById('members', e.workerId);
            return w && w.teamId === Auth.currentUser.teamId;
        });

        // Aggregate by dept
        const depts = DataStore.getAll('departments');
        const agg = {};
        depts.forEach(d => { agg[d.id] = { name:d.name, total:0 }; });
        expenses.forEach(e => { if (agg[e.departmentId]) agg[e.departmentId].total += parseFloat(e.amount); });

        deptTbody.innerHTML = Object.values(agg).map(d => {
            const cls = d.total > 0 ? 'text-danger' : 'text-secondary';
            return `<tr><td><strong>${d.name}</strong></td><td><strong class="${cls}">${d.total.toLocaleString()} ${CONFIG.CURRENCY}</strong></td></tr>`;
        }).join('');

        if (expenses.length === 0) {
            logTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);">${I18n.t('msg.noExpenses')}</td></tr>`;
        } else {
            logTbody.innerHTML = [...expenses].reverse().map(e => {
                const w = DataStore.getById('members', e.workerId);
                return `<tr>
                    <td><strong>${w ? w.name : 'Unknown'}</strong></td>
                    <td><span class="status-badge status-pending">${e.type}</span></td>
                    <td>${e.desc || ''}</td>
                    <td class="text-danger">-${parseFloat(e.amount).toLocaleString()} ${CONFIG.CURRENCY}</td>
                    <td>${e.date}</td>
                </tr>`;
            }).join('');
        }
    },

    _renderSummary(inPeriod) {
        // Revenue: sum of paid tasks
        const paidTasks = DataStore.query('tasks', t => t.paymentStatus === 'Paid' && t.paymentAmount);
        const revenue = paidTasks.reduce((sum, t) => sum + parseFloat(t.paymentAmount || 0), 0);

        // Payroll
        let payments = DataStore.getAll('workerPayments').filter(p => inPeriod(p.date));
        const payroll = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

        // Expenses
        let expenses = DataStore.getAll('expenses').filter(e => inPeriod(e.date));
        const expTotal = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

        const net = revenue - payroll - expTotal;

        document.getElementById('fin-total-revenue').textContent = `${revenue.toLocaleString()} ${CONFIG.CURRENCY}`;
        document.getElementById('fin-total-payroll').textContent = `${payroll.toLocaleString()} ${CONFIG.CURRENCY}`;
        document.getElementById('fin-total-expenses').textContent = `${expTotal.toLocaleString()} ${CONFIG.CURRENCY}`;
        document.getElementById('fin-net').textContent = `${net.toLocaleString()} ${CONFIG.CURRENCY}`;
    },

    openCustomerPayment(taskId) {
        document.getElementById('customer-payment-task-id').value = taskId;
        UI.openModal('customer-payment');
    },

    submitCustomerPayment(e) {
        e.preventDefault();
        const taskId = parseInt(document.getElementById('customer-payment-task-id').value);
        const amount = parseFloat(document.getElementById('customer-payment-amount').value);
        const method = document.getElementById('customer-payment-method').value;
        DataStore.update('tasks', taskId, { paymentStatus:'Paid', paymentAmount:amount, paymentMethod:method });
        DataStore.create('customerPayments', { taskId, amount, method, date:new Date().toISOString().split('T')[0] });
        UI.closeModal('customer-payment');
        UI.toast(I18n.t('msg.saved'), 'success');
        UI.renderAll();
    },

    openWorkerPaymentModal() {
        const sel = document.getElementById('wp-worker');
        let members = DataStore.getAll('members');
        if (Auth.isLeader()) members = members.filter(m => m.teamId === Auth.currentUser.teamId);
        sel.innerHTML = '<option value="">-- Select Worker --</option>' + members.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
        document.getElementById('wp-date').value = new Date().toISOString().split('T')[0];
        UI.openModal('worker-payment');
    },

    submitWorkerPayment(e) {
        e.preventDefault();
        DataStore.create('workerPayments', {
            workerId: parseInt(document.getElementById('wp-worker').value),
            amount: parseFloat(document.getElementById('wp-amount').value),
            method: document.getElementById('wp-method').value,
            date: document.getElementById('wp-date').value
        });
        UI.closeModal('worker-payment');
        UI.toast(I18n.t('msg.saved'), 'success');
        UI.renderAll();
    },

    openExpenseModal() {
        const sel = document.getElementById('exp-worker');
        let members = DataStore.getAll('members');
        if (Auth.isLeader()) members = members.filter(m => m.teamId === Auth.currentUser.teamId);
        sel.innerHTML = '<option value="">-- Select Worker --</option>' + members.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
        document.getElementById('exp-date').value = new Date().toISOString().split('T')[0];
        UI.openModal('expense');
    },

    submitExpense(e) {
        e.preventDefault();
        const workerId = parseInt(document.getElementById('exp-worker').value);
        const member = DataStore.getById('members', workerId);
        const team = member ? DataStore.getById('teams', member.teamId) : null;
        DataStore.create('expenses', {
            workerId,
            departmentId: team ? team.departmentId : null,
            type: document.getElementById('exp-type').value,
            desc: document.getElementById('exp-desc').value.trim(),
            amount: parseFloat(document.getElementById('exp-amount').value),
            date: document.getElementById('exp-date').value
        });
        UI.closeModal('expense');
        UI.toast(I18n.t('msg.saved'), 'success');
        UI.renderAll();
    }
};

// ============================================================
// SECTION 14: SALES MODULE
// ============================================================
const SalesModule = {
    _editProductId: null,
    _cart: [],

    render() {
        if (!document.getElementById('view-sales')) return;
        this._renderStats();
        this._renderProducts();
        this._renderPOS();
        this._renderHistory();
        this._renderAlerts();
    },

    // ---- STATS ----
    _renderStats() {
        const products = DataStore.getAll('products');
        const sales = DataStore.getAll('sales');
        const totalProducts = products.length;
        const inventoryValue = products.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);
        const totalSales = sales.length;
        const salesRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
        const lowStock = products.filter(p => p.quantity <= p.minStock).length;

        document.getElementById('sales-stat-products').textContent = totalProducts;
        document.getElementById('sales-stat-inv-value').textContent = inventoryValue.toLocaleString() + ' ' + CONFIG.CURRENCY;
        document.getElementById('sales-stat-total-sales').textContent = totalSales;
        document.getElementById('sales-stat-revenue').textContent = salesRevenue.toLocaleString() + ' ' + CONFIG.CURRENCY;
        document.getElementById('sales-stat-low-stock').textContent = lowStock;
    },

    // ---- PRODUCTS CATALOG ----
    _renderProducts() {
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;
        let products = DataStore.getAll('products');

        const catFilter = document.getElementById('filter-product-category')?.value;
        const stockFilter = document.getElementById('filter-product-stock')?.value;
        const searchFilter = document.getElementById('filter-product-search')?.value?.toLowerCase();

        if (catFilter) products = products.filter(p => p.category === catFilter);
        if (stockFilter === 'ok') products = products.filter(p => p.quantity > p.minStock);
        else if (stockFilter === 'low') products = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock);
        else if (stockFilter === 'out') products = products.filter(p => p.quantity === 0);
        if (searchFilter) products = products.filter(p => p.name.toLowerCase().includes(searchFilter) || p.barcode.includes(searchFilter));

        if (products.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-msg">${I18n.t('sales.noProducts')}</td></tr>`;
            return;
        }
        tbody.innerHTML = products.map(p => {
            const stockClass = p.quantity === 0 ? 'out' : p.quantity <= p.minStock ? 'low' : 'ok';
            const stockLabel = p.quantity === 0 ? 'Out of Stock' : p.quantity <= p.minStock ? 'Low Stock' : 'In Stock';
            return `<tr>
                <td><code>${p.barcode}</code></td>
                <td><strong>${p.name}</strong>${p.description ? '<br><small style="color:var(--text-muted)">' + p.description + '</small>' : ''}</td>
                <td>${p.category}</td>
                <td>${p.unitPrice.toLocaleString()} ${CONFIG.CURRENCY}</td>
                <td>${p.quantity}</td>
                <td><span class="stock-badge ${stockClass}">${stockLabel}</span></td>
                <td>
                    ${Auth.isAdmin() ? `<button class="btn btn-outline btn-sm" onclick="SalesModule.openEditProduct(${p.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-outline btn-sm text-danger" onclick="SalesModule.deleteProduct(${p.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>` : ''}
                </td>
            </tr>`;
        }).join('');
    },

    openCreateProduct() {
        this._editProductId = null;
        document.getElementById('form-product').reset();
        document.getElementById('product-min-stock').value = '5';
        document.querySelector('#modal-product .modal-header h2').textContent = I18n.t('modal.addProduct');
        UI.openModal('product');
    },

    openEditProduct(id) {
        if (!Auth.isAdmin()) return;
        const p = DataStore.getById('products', id);
        if (!p) return;
        this._editProductId = id;
        document.getElementById('product-barcode').value = p.barcode;
        document.getElementById('product-name').value = p.name;
        document.getElementById('product-category').value = p.category;
        document.getElementById('product-description').value = p.description || '';
        document.getElementById('product-unit-price').value = p.unitPrice;
        document.getElementById('product-quantity').value = p.quantity;
        document.getElementById('product-min-stock').value = p.minStock;
        document.querySelector('#modal-product .modal-header h2').textContent = I18n.t('modal.editProduct');
        UI.openModal('product');
    },

    submitProduct(e) {
        e.preventDefault();
        const data = {
            barcode: document.getElementById('product-barcode').value.trim(),
            name: document.getElementById('product-name').value.trim(),
            category: document.getElementById('product-category').value,
            description: document.getElementById('product-description').value.trim(),
            unitPrice: parseInt(document.getElementById('product-unit-price').value) || 0,
            quantity: parseInt(document.getElementById('product-quantity').value) || 0,
            minStock: parseInt(document.getElementById('product-min-stock').value) || 5
        };

        // Check barcode uniqueness
        const existing = DataStore.query('products', p => p.barcode === data.barcode && p.id !== this._editProductId);
        if (existing.length > 0) {
            UI.toast('A product with this barcode already exists.', 'error');
            return;
        }

        if (this._editProductId) {
            DataStore.update('products', this._editProductId, data);
            this._editProductId = null;
            UI.toast(I18n.t('msg.saved'), 'success');
        } else {
            DataStore.create('products', data);
            UI.toast(I18n.t('msg.created'), 'success');
        }
        UI.closeModal('product');
        UI.renderAll();
    },

    async deleteProduct(id) {
        if (!Auth.isAdmin()) return;
        const confirmed = await UI.confirm(I18n.t('msg.deleteConfirm'));
        if (!confirmed) return;
        DataStore.delete('products', id);
        UI.toast(I18n.t('msg.deleted'), 'success');
        UI.renderAll();
    },

    // ---- POINT OF SALE ----
    _renderPOS() {
        const tbody = document.getElementById('pos-cart-body');
        if (!tbody) return;

        if (this._cart.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="pos-cart-empty">${I18n.t('sales.cartEmpty')}</td></tr>`;
        } else {
            tbody.innerHTML = this._cart.map((item, i) => `<tr>
                <td>${item.name}</td>
                <td><code>${item.barcode}</code></td>
                <td><input type="number" value="${item.qty}" min="1" max="${item.maxQty}" style="width:60px;padding:4px 8px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);" onchange="SalesModule.updateCartQty(${i}, parseInt(this.value))"></td>
                <td>${item.unitPrice.toLocaleString()} ${CONFIG.CURRENCY}</td>
                <td>${item.lineTotal.toLocaleString()} ${CONFIG.CURRENCY}</td>
                <td><button class="btn btn-outline btn-sm text-danger" onclick="SalesModule.removeFromCart(${i})"><i class="fa-solid fa-xmark"></i></button></td>
            </tr>`).join('');
        }

        const total = this._cart.reduce((sum, item) => sum + item.lineTotal, 0);
        document.getElementById('pos-cart-total').textContent = total.toLocaleString() + ' ' + CONFIG.CURRENCY;
    },

    scanBarcode(code) {
        const product = DataStore.query('products', p => p.barcode === code)[0];
        if (!product) {
            UI.toast(I18n.t('sales.productNotFound'), 'error');
            return;
        }
        if (product.quantity === 0) {
            UI.toast(I18n.t('sales.outOfStock'), 'warning');
            return;
        }

        const existingIndex = this._cart.findIndex(item => item.productId === product.id);
        if (existingIndex >= 0) {
            const item = this._cart[existingIndex];
            if (item.qty < product.quantity) {
                item.qty++;
                item.lineTotal = item.qty * item.unitPrice;
            } else {
                UI.toast('Maximum available stock reached.', 'warning');
            }
        } else {
            this._cart.push({
                productId: product.id,
                name: product.name,
                barcode: product.barcode,
                qty: 1,
                unitPrice: product.unitPrice,
                lineTotal: product.unitPrice,
                maxQty: product.quantity
            });
        }
        this._renderPOS();
    },

    removeFromCart(index) {
        this._cart.splice(index, 1);
        this._renderPOS();
    },

    updateCartQty(index, newQty) {
        if (!newQty || newQty < 1) newQty = 1;
        const item = this._cart[index];
        if (!item) return;
        const product = DataStore.getById('products', item.productId);
        if (product && newQty > product.quantity) {
            newQty = product.quantity;
            UI.toast('Maximum available stock reached.', 'warning');
        }
        item.qty = newQty;
        item.lineTotal = item.qty * item.unitPrice;
        this._renderPOS();
    },

    completeSale() {
        if (this._cart.length === 0) {
            UI.toast(I18n.t('sales.emptyCart'), 'warning');
            return;
        }

        const totalAmount = this._cart.reduce((sum, item) => sum + item.lineTotal, 0);
        const paymentMethod = document.getElementById('pos-payment-method').value;

        // Generate sale number
        const allSales = DataStore.getAll('sales');
        const nextNum = allSales.length > 0 ? Math.max(...allSales.map(s => parseInt(s.saleNumber.replace('SL-', '')) || 0)) + 1 : 1;
        const saleNumber = 'SL-' + String(nextNum).padStart(3, '0');

        // Denormalized items
        const items = this._cart.map(item => ({
            productId: item.productId,
            productName: item.name,
            barcode: item.barcode,
            qty: item.qty,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal
        }));

        // Create sale record
        DataStore.create('sales', {
            saleNumber,
            date: new Date().toISOString().split('T')[0],
            items,
            totalAmount,
            paymentMethod,
            notes: ''
        });

        // Decrement product quantities
        this._cart.forEach(item => {
            const product = DataStore.getById('products', item.productId);
            if (product) {
                DataStore.update('products', item.productId, { quantity: product.quantity - item.qty });
            }
        });

        // Clear cart
        this._cart = [];
        UI.toast(I18n.t('sales.saleComplete'), 'success');
        UI.renderAll();
    },

    // ---- SALES HISTORY ----
    _renderHistory() {
        const tbody = document.getElementById('sales-history-body');
        if (!tbody) return;

        let sales = DataStore.getAll('sales');
        const timeframe = document.getElementById('sales-timeframe')?.value || '30';

        if (timeframe !== 'all') {
            const days = parseInt(timeframe);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            const cutoffStr = cutoff.toISOString().split('T')[0];
            sales = sales.filter(s => s.date >= cutoffStr);
        }

        sales.sort((a, b) => b.date.localeCompare(a.date));

        if (sales.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty-msg">${I18n.t('sales.noSales')}</td></tr>`;
            return;
        }
        tbody.innerHTML = sales.map(s => `<tr>
            <td><strong>${s.saleNumber}</strong></td>
            <td>${s.date}</td>
            <td>${s.items.length} item${s.items.length > 1 ? 's' : ''}</td>
            <td>${s.totalAmount.toLocaleString()} ${CONFIG.CURRENCY}</td>
            <td>${s.paymentMethod}</td>
            <td><button class="btn btn-outline btn-sm" onclick="SalesModule.viewSaleDetail(${s.id})" title="View"><i class="fa-solid fa-eye"></i></button></td>
        </tr>`).join('');
    },

    viewSaleDetail(id) {
        const sale = DataStore.getById('sales', id);
        if (!sale) return;
        const content = document.getElementById('sale-detail-content');
        content.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
                <div><strong>${sale.saleNumber}</strong></div>
                <div>${sale.date}</div>
            </div>
            <div style="margin-bottom:8px;color:var(--text-muted);">Payment: ${sale.paymentMethod}</div>
            <table class="sale-detail-items">
                <thead><tr><th>Product</th><th>Barcode</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
                <tbody>
                    ${sale.items.map(item => `<tr>
                        <td>${item.productName}</td>
                        <td><code>${item.barcode}</code></td>
                        <td>${item.qty}</td>
                        <td>${item.unitPrice.toLocaleString()} ${CONFIG.CURRENCY}</td>
                        <td>${item.lineTotal.toLocaleString()} ${CONFIG.CURRENCY}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
            <div class="sale-detail-total">Total: ${sale.totalAmount.toLocaleString()} ${CONFIG.CURRENCY}</div>
        `;
        UI.openModal('sale-detail');
    },

    // ---- INVENTORY ALERTS ----
    _renderAlerts() {
        const tbody = document.getElementById('inventory-alerts-body');
        if (!tbody) return;

        const lowStockProducts = DataStore.query('products', p => p.quantity <= p.minStock);
        if (lowStockProducts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty-msg">${I18n.t('sales.noAlerts')}</td></tr>`;
            return;
        }
        tbody.innerHTML = lowStockProducts.map(p => {
            const stockClass = p.quantity === 0 ? 'out' : 'low';
            const stockLabel = p.quantity === 0 ? 'Out of Stock' : 'Low Stock';
            return `<tr>
                <td><code>${p.barcode}</code></td>
                <td>${p.name}</td>
                <td>${p.quantity}</td>
                <td>${p.minStock}</td>
                <td><span class="stock-badge ${stockClass}">${stockLabel}</span></td>
                <td><button class="btn btn-primary btn-sm" onclick="SalesModule.openRestock(${p.id})"><i class="fa-solid fa-boxes-packing"></i> ${I18n.t('sales.restock')}</button></td>
            </tr>`;
        }).join('');
    },

    openRestock(id) {
        const product = DataStore.getById('products', id);
        if (!product) return;
        document.getElementById('restock-product-id').value = id;
        document.getElementById('restock-product-name').textContent = product.name;
        document.getElementById('restock-current').value = product.quantity;
        document.getElementById('restock-qty').value = 1;
        UI.openModal('restock');
    },

    submitRestock(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('restock-product-id').value);
        const addQty = parseInt(document.getElementById('restock-qty').value) || 0;
        if (addQty <= 0) return;
        const product = DataStore.getById('products', id);
        if (!product) return;
        DataStore.update('products', id, { quantity: product.quantity + addQty });
        UI.closeModal('restock');
        UI.toast(I18n.t('sales.restocked'), 'success');
        UI.renderAll();
    },

    // ---- EXPORT ----
    exportProductsCSV() {
        const products = DataStore.getAll('products').map(p => ({
            Barcode: p.barcode, Name: p.name, Category: p.category,
            Description: p.description || '', UnitPrice: p.unitPrice,
            Quantity: p.quantity, MinStock: p.minStock
        }));
        ExportModule._downloadCSV(products, 'ems-sales-products.csv');
    },

    exportSalesCSV() {
        const sales = DataStore.getAll('sales').map(s => ({
            SaleNumber: s.saleNumber, Date: s.date,
            Items: s.items.map(i => `${i.productName} x${i.qty}`).join('; '),
            TotalAmount: s.totalAmount, PaymentMethod: s.paymentMethod
        }));
        ExportModule._downloadCSV(sales, 'ems-sales-history.csv');
    }
};

// ============================================================
// SECTION 15: EXPORT MODULE
// ============================================================
const ExportModule = {
    _downloadCSV(data, filename) {
        if (!data || data.length === 0) { UI.toast('No data to export', 'warning'); return; }
        const headers = Object.keys(data[0]);
        const csv = [headers.join(','), ...data.map(row => headers.map(h => {
            let val = row[h];
            if (val === null || val === undefined) val = '';
            if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
                val = '"' + val.replace(/"/g, '""') + '"';
            }
            return val;
        }).join(','))].join('\n');

        const blob = new Blob(['\uFEFF' + csv], { type:'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        UI.toast('CSV exported', 'success');
    },

    exportTasksCSV() {
        const tasks = DataStore.getAll('tasks').map(t => ({
            Title: t.title,
            Department: DashboardModule._getDeptName(t.departmentId),
            Team: DashboardModule._getTeamName(t.teamId),
            Customer: DataStore.getById('customers', t.customerId)?.name || '',
            Priority: t.priority,
            Status: t.status,
            StartDate: t.startDate,
            Deadline: t.deadlineDate,
            PaymentStatus: t.paymentStatus,
            Amount: t.paymentAmount || ''
        }));
        this._downloadCSV(tasks, 'ems-gabon-tasks.csv');
    },

    exportMembersCSV() {
        const members = DataStore.getAll('members').map(m => ({
            Name: m.name,
            Role: m.role,
            Type: m.type,
            HiringDate: m.hiringDate,
            Team: DashboardModule._getTeamName(m.teamId),
            Availability: m.availability
        }));
        this._downloadCSV(members, 'ems-gabon-members.csv');
    },

    exportFinanceCSV() {
        const payments = DataStore.getAll('workerPayments').map(p => {
            const w = DataStore.getById('members', p.workerId);
            return { Worker: w ? w.name : '', Amount: p.amount, Method: p.method, Date: p.date };
        });
        this._downloadCSV(payments, 'ems-gabon-finance.csv');
    },

    exportReportCSV() {
        const teams = DataStore.getAll('teams');
        const tasks = DataStore.getAll('tasks');
        const data = teams.map(t => {
            const teamTasks = tasks.filter(tk => tk.teamId === t.id);
            return {
                Team: t.name,
                Department: DashboardModule._getDeptName(t.departmentId),
                Completed: teamTasks.filter(tk => tk.status === 'Completed').length,
                Active: teamTasks.filter(tk => tk.status === 'Active').length,
                Pending: teamTasks.filter(tk => tk.status === 'Pending').length,
                Total: teamTasks.length
            };
        });
        this._downloadCSV(data, 'ems-gabon-report.csv');
    },

    exportReportPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text('EMS-Team Manager Report', 14, 22);
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

            const teams = DataStore.getAll('teams');
            const tasks = DataStore.getAll('tasks');
            const rows = teams.map(t => {
                const tt = tasks.filter(tk => tk.teamId === t.id);
                return [t.name, DashboardModule._getDeptName(t.departmentId),
                    tt.filter(tk => tk.status === 'Completed').length,
                    tt.filter(tk => tk.status === 'Pending').length,
                    tt.length];
            });

            doc.autoTable({
                startY: 38,
                head: [['Team','Department','Completed','Pending','Total']],
                body: rows,
                theme: 'grid',
                headStyles: { fillColor: [249, 115, 22] }
            });

            doc.save('ems-gabon-report.pdf');
            UI.toast('PDF exported', 'success');
        } catch(e) {
            console.error(e);
            UI.toast('PDF export requires internet connection for jsPDF', 'error');
        }
    }
};

// ============================================================
// SECTION 15: PASSWORD CHANGE
// ============================================================
const PasswordModule = {
    submit(e) {
        e.preventDefault();
        const cur = document.getElementById('pw-current').value;
        const newPw = document.getElementById('pw-new').value;
        const conf = document.getElementById('pw-confirm').value;
        const errEl = document.getElementById('pw-error');
        errEl.style.display = 'none';

        if (newPw !== conf) {
            errEl.textContent = I18n.t('msg.pwMismatch');
            errEl.style.display = 'block';
            return;
        }
        // Hardcoded admin (no member id) - password is system locked
        if (Auth.isAdmin() && !Auth.currentUser.id) {
            if (cur !== CONFIG.ADMIN_PASS) {
                errEl.textContent = I18n.t('msg.pwWrong');
                errEl.style.display = 'block';
                return;
            }
            UI.toast(I18n.t('msg.pwLocked'), 'warning');
            UI.closeModal('change-password');
            return;
        }
        // Member-based users (including member admins)
        const member = DataStore.getById('members', Auth.currentUser.id);
        if (!member || member.password !== cur) {
            errEl.textContent = I18n.t('msg.pwWrong');
            errEl.style.display = 'block';
            return;
        }
        DataStore.update('members', Auth.currentUser.id, { password: newPw });
        UI.closeModal('change-password');
        UI.toast(I18n.t('msg.pwUpdated'), 'success');
    }
};

// ============================================================
// SECTION 16: APP INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Load data
    DataStore.load();

    // Restore theme/lang from session
    const session = DataStore.getSession();
    if (session) {
        if (session.theme) {
            document.documentElement.dataset.theme = session.theme;
            if (session.theme === 'light') {
                document.querySelector('#theme-toggle i').className = 'fa-solid fa-sun';
            }
        }
        if (session.lang) {
            I18n.currentLang = session.lang;
            document.getElementById('lang-toggle').textContent = session.lang === 'en' ? 'FR' : 'EN';
        }
    }
    I18n.setLang(I18n.currentLang);

    // Restore session
    if (Auth.restoreSession()) {
        document.getElementById('login-screen').style.display = 'none';
        document.querySelector('.app-container').style.display = 'flex';
        UI.applyPermissions();
        UI.renderAll();
    } else {
        document.getElementById('login-screen').style.display = 'flex';
        document.querySelector('.app-container').style.display = 'none';
    }

    // ===== SPLASH SCREEN AUTO-HIDE =====
    const splashEl = document.getElementById('splash-screen');
    if (splashEl) {
        setTimeout(() => {
            splashEl.classList.add('fade-out');
            setTimeout(() => { splashEl.style.display = 'none'; }, 600);
        }, 2500);
    }

    // ===== EVENT BINDINGS =====

    // Login
    document.getElementById('form-login').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const errEl = document.getElementById('login-error');
        const result = Auth.login(username, password);
        if (result.success) {
            errEl.style.display = 'none';
            document.getElementById('form-login').reset();
            document.getElementById('login-screen').style.display = 'none';
            document.querySelector('.app-container').style.display = 'flex';
            UI.applyPermissions();
            UI.switchTab('dashboard');
        } else {
            errEl.textContent = result.error;
            errEl.style.display = 'block';
        }
    });

    // Logout
    document.getElementById('nav-logout').addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
        document.getElementById('login-screen').style.display = 'flex';
        document.querySelector('.app-container').style.display = 'none';
    });

    // Nav items
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            UI.switchTab(e.currentTarget.dataset.tab);
        });
    });

    // Sidebar toggle (mobile)
    document.getElementById('hamburger-btn').addEventListener('click', UI.toggleSidebar);
    document.getElementById('sidebar-overlay').addEventListener('click', UI.closeSidebar);

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => UI.toggleTheme());

    // Language toggle
    document.getElementById('lang-toggle').addEventListener('click', () => UI.toggleLanguage());

    // Availability toggle in header
    document.getElementById('avail-toggle-header').addEventListener('click', () => {
        if (Auth.currentUser && Auth.currentUser.id) {
            MembersModule.toggleAvailability(Auth.currentUser.id);
        }
    });

    // Quick actions
    document.getElementById('btn-view-all-tasks').addEventListener('click', () => UI.switchTab('tasks'));
    document.getElementById('qa-task').addEventListener('click', () => TasksModule.openCreateModal());
    document.getElementById('qa-department').addEventListener('click', () => DepartmentsModule.openCreateModal());
    document.getElementById('qa-team').addEventListener('click', () => TeamsModule.openModal());
    document.getElementById('qa-member').addEventListener('click', () => MembersModule.openModal());

    // CRUD buttons
    document.getElementById('btn-new-task').addEventListener('click', () => TasksModule.openCreateModal());
    document.getElementById('btn-add-dept').addEventListener('click', () => DepartmentsModule.openCreateModal());
    document.getElementById('btn-add-team').addEventListener('click', () => TeamsModule.openModal());
    document.getElementById('btn-add-customer').addEventListener('click', () => CustomersModule.openCreateModal());
    document.getElementById('btn-add-equipment').addEventListener('click', () => EquipmentModule.openCreateModal());
    document.getElementById('btn-add-member').addEventListener('click', () => MembersModule.openModal());
    document.getElementById('btn-pay-worker').addEventListener('click', () => FinanceModule.openWorkerPaymentModal());
    document.getElementById('btn-log-expense').addEventListener('click', () => FinanceModule.openExpenseModal());
    document.getElementById('nav-change-password').addEventListener('click', (e) => { e.preventDefault(); UI.openModal('change-password'); });

    // Form submissions
    document.getElementById('form-task').addEventListener('submit', (e) => TasksModule.submitTask(e));
    document.getElementById('form-department').addEventListener('submit', (e) => DepartmentsModule.submit(e));
    document.getElementById('form-team').addEventListener('submit', (e) => TeamsModule.submit(e));
    document.getElementById('form-customer').addEventListener('submit', (e) => CustomersModule.submit(e));
    document.getElementById('form-equipment').addEventListener('submit', (e) => EquipmentModule.submit(e));
    document.getElementById('form-member').addEventListener('submit', (e) => MembersModule.submit(e));
    document.getElementById('form-instruction').addEventListener('submit', (e) => TasksModule.saveInstructions(e));
    document.getElementById('form-customer-payment').addEventListener('submit', (e) => FinanceModule.submitCustomerPayment(e));
    document.getElementById('form-worker-payment').addEventListener('submit', (e) => FinanceModule.submitWorkerPayment(e));
    document.getElementById('form-expense').addEventListener('submit', (e) => FinanceModule.submitExpense(e));
    document.getElementById('form-change-password').addEventListener('submit', (e) => PasswordModule.submit(e));
    document.getElementById('form-reset-password').addEventListener('submit', (e) => MembersModule.submitResetPassword(e));
    document.getElementById('reset-pw-new').addEventListener('input', (e) => {
        const el = document.getElementById('reset-pw-strength');
        if (!e.target.value) { el.textContent = ''; return; }
        const result = PasswordUtil.validate(e.target.value);
        const label = PasswordUtil.strengthLabel(result.passed);
        el.textContent = label.text;
        el.style.color = label.color;
    });

    // Cascading dropdowns
    document.getElementById('task-department').addEventListener('change', () => TasksModule.updateTeamDropdown());
    document.getElementById('task-team').addEventListener('change', () => TasksModule.updateAssigneeDropdown());
    document.getElementById('member-department').addEventListener('change', () => MembersModule.updateTeamDropdown());

    // Member role change: hide/show team fields for Admin
    document.getElementById('member-role').addEventListener('change', (e) => {
        const teamFields = document.getElementById('member-team-fields');
        if (teamFields) teamFields.style.display = e.target.value === 'Admin' ? 'none' : 'block';
    });

    // Password strength indicator
    document.getElementById('member-password').addEventListener('input', (e) => {
        const el = document.getElementById('member-pw-strength');
        if (!e.target.value) { el.textContent = ''; return; }
        const result = PasswordUtil.validate(e.target.value);
        const label = PasswordUtil.strengthLabel(result.passed);
        el.textContent = label.text;
        el.style.color = label.color;
    });

    // Close buttons (data-close attribute)
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.close;
            if (type === 'confirm') {
                UI._handleConfirmCancel();
            } else {
                UI.closeModal(type);
            }
        });
    });

    // Confirm yes button
    document.getElementById('confirm-yes-btn').addEventListener('click', () => UI._handleConfirmYes());

    // Finance timeframe
    document.getElementById('finance-timeframe').addEventListener('change', (e) => {
        FinanceModule.currentTimeframe = e.target.value;
        FinanceModule.render();
    });

    // Stats timeframe
    document.getElementById('stats-timeframe').addEventListener('change', (e) => {
        ReportsModule.currentTimeframe = e.target.value;
        ReportsModule.render();
    });

    // Task filters
    ['filter-task-status','filter-task-priority','filter-task-search'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => TasksModule.render());
    });

    // Member filters
    ['filter-member-team','filter-member-role','filter-member-avail'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', () => MembersModule.render());
    });

    // Export buttons
    document.getElementById('btn-export-tasks-csv').addEventListener('click', () => ExportModule.exportTasksCSV());
    document.getElementById('btn-export-members-csv').addEventListener('click', () => ExportModule.exportMembersCSV());
    document.getElementById('btn-export-finance-csv').addEventListener('click', () => ExportModule.exportFinanceCSV());
    document.getElementById('btn-export-report-csv').addEventListener('click', () => ExportModule.exportReportCSV());
    document.getElementById('btn-export-report-pdf').addEventListener('click', () => ExportModule.exportReportPDF());

    // ===== SALES MODULE BINDINGS =====
    document.getElementById('form-product').addEventListener('submit', (e) => SalesModule.submitProduct(e));
    document.getElementById('form-restock').addEventListener('submit', (e) => SalesModule.submitRestock(e));
    document.getElementById('btn-add-product').addEventListener('click', () => SalesModule.openCreateProduct());
    document.getElementById('btn-complete-sale').addEventListener('click', () => SalesModule.completeSale());
    document.getElementById('btn-export-products-csv').addEventListener('click', () => SalesModule.exportProductsCSV());
    document.getElementById('btn-export-sales-csv').addEventListener('click', () => SalesModule.exportSalesCSV());

    // POS barcode input — USB scanners type chars then press Enter
    document.getElementById('pos-barcode-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const code = e.target.value.trim();
            if (code) SalesModule.scanBarcode(code);
            e.target.value = '';
        }
    });

    // Camera barcode scanner
    document.getElementById('btn-scan-camera').addEventListener('click', () => {
        const preview = document.getElementById('pos-camera-preview');
        if (preview.style.display !== 'none') {
            // Stop camera
            if (typeof Quagga !== 'undefined') Quagga.stop();
            preview.style.display = 'none';
            preview.innerHTML = '';
            return;
        }
        if (typeof Quagga === 'undefined') {
            UI.toast('Camera scanner library not available.', 'warning');
            return;
        }
        preview.style.display = 'block';
        preview.innerHTML = '<button class="pos-camera-close" onclick="document.getElementById(\'pos-camera-preview\').style.display=\'none\';if(typeof Quagga!==\'undefined\')Quagga.stop();this.parentElement.innerHTML=\'\';"><i class="fa-solid fa-xmark"></i></button>';
        Quagga.init({
            inputStream: { name: 'Live', type: 'LiveStream', target: preview, constraints: { facingMode: 'environment' } },
            decoder: { readers: ['ean_reader', 'code_128_reader', 'upc_reader'] }
        }, (err) => {
            if (err) {
                UI.toast('Could not access camera.', 'error');
                preview.style.display = 'none';
                preview.innerHTML = '';
                return;
            }
            Quagga.start();
        });
        Quagga.onDetected((result) => {
            const code = result.codeResult.code;
            Quagga.stop();
            preview.style.display = 'none';
            preview.innerHTML = '';
            if (code) {
                document.getElementById('pos-barcode-input').value = code;
                SalesModule.scanBarcode(code);
                document.getElementById('pos-barcode-input').value = '';
            }
        });
    });

    // Sales timeframe filter
    document.getElementById('sales-timeframe').addEventListener('change', () => SalesModule._renderHistory());

    // Product filters
    ['filter-product-category','filter-product-stock','filter-product-search'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => SalesModule._renderProducts());
    });

    // Global search
    const searchInput = document.getElementById('global-search');
    const searchResults = document.getElementById('search-results');
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim();
        if (q.length < 2) { searchResults.classList.remove('active'); return; }
        const results = UI.globalSearch(q);
        if (results.length === 0) { searchResults.classList.remove('active'); return; }
        searchResults.innerHTML = results.map(r =>
            `<div class="search-result-item" data-tab="${r.tab}">
                <span class="search-result-type">${r.type}</span>
                <span>${r.name}</span>
            </div>`
        ).join('');
        searchResults.classList.add('active');
    });

    searchResults.addEventListener('click', (e) => {
        const item = e.target.closest('.search-result-item');
        if (item) {
            UI.switchTab(item.dataset.tab);
            searchInput.value = '';
            searchResults.classList.remove('active');
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            searchResults.classList.remove('active');
        }
    });

    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                const type = modal.id.replace('modal-', '');
                if (type === 'confirm') {
                    UI._handleConfirmCancel();
                } else {
                    UI.closeModal(type);
                }
            }
        });
    });
});
