console.log('Riyadh Al-Islam Platform Initialized - Akwadra Core');

// --- Configuration & Data Store ---
const DEFAULT_ADMIN = {
    id: '123456789',
    pass: 'KLd1967',
    name: 'مدير النظام',
    role: 'admin',
    avatar: 'https://cdn-icons-png.flaticon.com/512/2942/2942813.png'
};

const DEFAULT_LEADERS = [
    {
        name: 'الشيخ عبدالرحمن بن حمد بن عبدالرحمن الحصيني',
        title: 'مالك المدارس',
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        speech: 'نسعى لبناء جيل واعد متسلح بالعلم والإيمان.'
    },
    {
        name: 'الدكتور أشرف محي عبدالدايم',
        title: 'المشرف العام على المدارس',
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135823.png',
        speech: 'التعليم هو الركيزة الأساسية لنهضة الأمم.'
    },
    {
        name: 'الأستاذ خالد سركيس',
        title: 'مدير النظام',
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png',
        speech: 'التكنولوجيا هي جسر العبور نحو المستقبل.'
    },
    {
        name: 'الأستاذ حسين عبدالمحسن حسين',
        title: 'مصمم النظام',
        image: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png',
        speech: 'التصميم ليس مجرد شكل، بل هو طريقة عمل الأشياء.'
    }
];

// Initialize LocalStorage if empty
if (!localStorage.getItem('school_users')) {
    localStorage.setItem('school_users', JSON.stringify([DEFAULT_ADMIN]));
}
if (!localStorage.getItem('school_leaders')) {
    localStorage.setItem('school_leaders', JSON.stringify(DEFAULT_LEADERS));
}
if (!localStorage.getItem('school_resources')) {
    localStorage.setItem('school_resources', JSON.stringify([]));
}
if (!localStorage.getItem('school_config')) {
    localStorage.setItem('school_config', JSON.stringify({ 
        bgColor: 'from-indigo-900 via-blue-800 to-indigo-900',
        bgImage: '',
        logo: 'https://cdn-icons-png.flaticon.com/512/3248/3248866.png'
    }));
}

// --- State Management ---
let currentUser = JSON.parse(localStorage.getItem('current_session')) || null;

// --- DOM Elements ---
const mainWrapper = document.getElementById('main-wrapper');
const heroSection = document.getElementById('hero-section');
const navLogo = document.getElementById('nav-logo');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    applyConfig();
    renderLeaders();
    checkSession();
    
    // Akwadra Card Logic (Preserved)
    const card = document.querySelector('.card');
    if(card) {
        card.addEventListener('click', () => {
            console.log('تم النقر على البطاقة!');
            alert('أهلاً بك في عالم البناء بدون كود! (Akwadra Core)');
        });
    }
});

// --- Helper Functions ---
function getDB(key) { return JSON.parse(localStorage.getItem(key)); }
function setDB(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function applyConfig() {
    const config = getDB('school_config');
    if (config.bgImage) {
         heroSection.style.backgroundImage = `url('${config.bgImage}')`;
         heroSection.style.backgroundSize = 'cover';
    } 
    // Apply Logo
    navLogo.src = config.logo;
}

// --- Auth Logic ---
function toggleModal(id) {
    const modal = document.getElementById(id);
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('modal-active'), 10);
    } else {
        modal.classList.remove('modal-active');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

function toggleStudentFields() {
    const role = document.getElementById('reg-role').value;
    const fields = document.getElementById('student-fields');
    fields.style.display = role === 'student' ? 'block' : 'none';
}

function handleLogin(e) {
    e.preventDefault();
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;
    const users = getDB('school_users');
    
    // Check Admin Hardcode
    if (id === DEFAULT_ADMIN.id && pass === DEFAULT_ADMIN.pass) {
        loginUser(DEFAULT_ADMIN);
        return;
    }

    const user = users.find(u => u.id === id && u.pass === pass);
    if (user) {
        if(user.blocked) {
            alert('هذا الحساب محظور. يرجى مراجعة الإدارة.');
            return;
        }
        loginUser(user);
    } else {
        alert('بيانات الدخول غير صحيحة');
    }
}

function loginUser(user) {
    currentUser = user;
    localStorage.setItem('current_session', JSON.stringify(user));
    toggleModal('login-modal');
    checkSession();
    alert(`مرحباً بك يا ${user.name}`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('current_session');
    location.reload();
}

function handleRegister(e) {
    e.preventDefault();
    const users = getDB('school_users');
    const newUser = {
        name: document.getElementById('reg-name').value,
        id: document.getElementById('reg-id').value,
        email: document.getElementById('reg-email').value,
        pass: document.getElementById('reg-pass').value,
        role: document.getElementById('reg-role').value,
        stage: document.getElementById('reg-stage').value,
        grade: document.getElementById('reg-grade').value,
        avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        blocked: false
    };

    if (users.find(u => u.id === newUser.id)) {
        alert('رقم الهوية مسجل مسبقاً');
        return;
    }

    users.push(newUser);
    setDB('school_users', users);
    alert('تم التسجيل بنجاح! يمكنك الدخول الآن.');
    toggleModal('register-modal');
}

function checkSession() {
    const landing = document.getElementById('landing-page');
    const dashboard = document.getElementById('dashboard-section');
    const loginBtn = document.getElementById('login-btn');
    const regBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info-display');

    if (currentUser) {
        landing.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loginBtn.classList.add('hidden');
        regBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userInfo.classList.remove('hidden');
        
        document.getElementById('user-name-display').innerText = currentUser.name;
        document.getElementById('user-role-display').innerText = getRoleName(currentUser.role);
        document.getElementById('user-avatar-mini').src = currentUser.avatar;

        renderDashboard();
    } else {
        landing.classList.remove('hidden');
        dashboard.classList.add('hidden');
        loginBtn.classList.remove('hidden');
        regBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userInfo.classList.add('hidden');
    }
}

function getRoleName(role) {
    const map = { 'admin': 'مدير النظام', 'supervisor': 'مشرف', 'teacher': 'معلم', 'student': 'طالب' };
    return map[role] || role;
}

// --- Dashboard Logic ---
function renderDashboard() {
    const menu = document.getElementById('dashboard-menu');
    const roleTitle = document.getElementById('dashboard-role-title');
    roleTitle.innerText = getRoleName(currentUser.role);
    menu.innerHTML = '';

    // Common Items
    addMenuItem('الملف الشخصي', 'fa-id-card', () => renderProfile());

    if (currentUser.role === 'admin') {
        addMenuItem('إعدادات المنصة', 'fa-cogs', () => renderAdminSettings());
        addMenuItem('إدارة القادة', 'fa-user-tie', () => renderAdminLeaders());
        addMenuItem('إدارة المستخدمين', 'fa-users', () => renderAdminUsers());
        addMenuItem('الموافقة على الموارد', 'fa-check-circle', () => renderAdminApprovals());
    }

    if (currentUser.role === 'supervisor') {
         addMenuItem('الموافقة على المعلمين', 'fa-check-double', () => renderSupervisorApprovals());
    }

    if (currentUser.role === 'teacher') {
        addMenuItem('إضافة مورد', 'fa-plus-circle', () => renderAddResource());
        addMenuItem('مواردي', 'fa-folder-open', () => renderMyResources());
    }

    if (currentUser.role === 'student' || currentUser.role === 'admin' || currentUser.role === 'supervisor' || currentUser.role === 'teacher') {
        addMenuItem('تصفح الموارد', 'fa-search', () => renderBrowseResources());
    }
}

function addMenuItem(text, icon, action) {
    const btn = document.createElement('button');
    btn.className = 'w-full flex items-center px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors mb-1';
    btn.innerHTML = `<i class="fas ${icon} w-6"></i> <span class="font-medium">${text}</span>`;
    btn.onclick = action;
    document.getElementById('dashboard-menu').appendChild(btn);
}

// --- Feature Renderers ---

function renderLeaders() {
    const grid = document.getElementById('leaders-grid');
    const leaders = getDB('school_leaders');
    grid.innerHTML = leaders.map(l => `
        <div class="bg-white rounded-2xl shadow-lg p-6 hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
            <div class="w-24 h-24 mx-auto mb-4 p-1 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-full">
                <img src="${l.image}" class="w-full h-full rounded-full object-cover shadow-sm">
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-1">${l.name}</h3>
            <span class="text-xs font-semibold text-indigo-500 uppercase tracking-wide">${l.title}</span>
            <p class="mt-4 text-gray-500 text-sm leading-relaxed">"${l.speech}"</p>
        </div>
    `).join('');
}

// -- Admin Sections --
function renderAdminSettings() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
        <div class="bg-white p-8 rounded-2xl shadow-sm">
            <h2 class="text-2xl font-bold mb-6">إعدادات المنصة</h2>
            <div class="space-y-6 max-w-xl">
                <div>
                    <label class="block text-sm font-medium mb-2">تحميل الشعار</label>
                    <input type="file" onchange="handleFileUpload(this, (url) => updateConfig('logo', url))" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">صورة خلفية الصفحة الرئيسية</label>
                    <input type="file" onchange="handleFileUpload(this, (url) => updateConfig('bgImage', url))" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                </div>
            </div>
        </div>
    `;
}

function updateConfig(key, val) {
    const config = getDB('school_config');
    config[key] = val;
    setDB('school_config', config);
    applyConfig();
    alert('تم تحديث الإعدادات');
}

function handleFileUpload(input, callback) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => callback(e.target.result);
        reader.readAsDataURL(file);
    }
}

function renderAdminLeaders() {
    const leaders = getDB('school_leaders');
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
        <div class="bg-white p-6 rounded-2xl shadow-sm">
            <h2 class="text-2xl font-bold mb-6">تعديل القادة</h2>
            <div class="grid gap-6">
                ${leaders.map((l, i) => `
                <div class="border p-4 rounded-xl flex items-center gap-4 bg-gray-50">
                    <img src="${l.image}" class="w-16 h-16 rounded-full object-cover">
                    <div class="flex-1">
                        <h4 class="font-bold">${l.name}</h4>
                        <p class="text-xs text-gray-500">${l.title}</p>
                    </div>
                    <button onclick="editLeader(${i})" class="text-indigo-600 hover:text-indigo-800">تعديل</button>
                </div>
                `).join('')}
            </div>
        </div>
    `;
}

function editLeader(index) {
    const leaders = getDB('school_leaders');
    const l = leaders[index];
    const newSpeech = prompt('أدخل الكلمة الجديدة:', l.speech);
    if (newSpeech) {
        l.speech = newSpeech;
        setDB('school_leaders', leaders);
        renderLeaders();
        renderAdminLeaders();
    }
}

function renderAdminUsers() {
    const users = getDB('school_users');
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
        <div class="bg-white p-6 rounded-2xl shadow-sm overflow-hidden">
             <h2 class="text-2xl font-bold mb-6">إدارة المستخدمين</h2>
             <div class="overflow-x-auto">
                 <table class="min-w-full text-sm text-right">
                     <thead class="bg-gray-100 text-gray-600 uppercase">
                         <tr>
                             <th class="py-3 px-4">الاسم</th>
                             <th class="py-3 px-4">الهوية</th>
                             <th class="py-3 px-4">الدور</th>
                             <th class="py-3 px-4">الحالة</th>
                             <th class="py-3 px-4">إجراء</th>
                         </tr>
                     </thead>
                     <tbody class="divide-y divide-gray-100">
                         ${users.map((u, i) => `
                            <tr class="hover:bg-gray-50 transition">
                                <td class="py-3 px-4 font-medium">${u.name}</td>
                                <td class="py-3 px-4 text-gray-500">${u.id}</td>
                                <td class="py-3 px-4 text-indigo-600">${getRoleName(u.role)}</td>
                                <td class="py-3 px-4">${u.blocked ? '<span class="text-red-500">محظور</span>' : '<span class="text-green-500">نشط</span>'}</td>
                                <td class="py-3 px-4">
                                    ${u.role !== 'admin' ? `
                                        <button onclick="toggleBlockUser(${i})" class="text-xs px-2 py-1 rounded border ${u.blocked ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}">
                                            ${u.blocked ? 'فك الحظر' : 'حظر'}
                                        </button>
                                        <button onclick="deleteUser(${i})" class="mr-2 text-xs text-red-600"><i class="fas fa-trash"></i></button>
                                    ` : ''}
                                </td>
                            </tr>
                         `).join('')}
                     </tbody>
                 </table>
             </div>
        </div>
    `;
}

function toggleBlockUser(index) {
    const users = getDB('school_users');
    users[index].blocked = !users[index].blocked;
    setDB('school_users', users);
    renderAdminUsers();
}

function deleteUser(index) {
    if(!confirm('هل أنت متأكد من الحذف؟')) return;
    const users = getDB('school_users');
    users.splice(index, 1);
    setDB('school_users', users);
    renderAdminUsers();
}

// --- Resource System ---
function renderAddResource() {
    const content = document.getElementById('dashboard-content');
    
    // Check limits (3 per day)
    const today = new Date().toISOString().split('T')[0];
    const resources = getDB('school_resources');
    const myToday = resources.filter(r => r.authorId === currentUser.id && r.date === today);
    
    if (myToday.length >= 3) {
        content.innerHTML = `<div class="bg-red-50 p-8 rounded-xl text-center text-red-600 font-bold">لقد تجاوزت الحد المسموح (3 موارد) لهذا اليوم.</div>`;
        return;
    }

    content.innerHTML = `
        <div class="bg-white p-8 rounded-2xl shadow-sm max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold mb-6">إضافة مورد جديد</h2>
            <form onsubmit="handleResourceSubmit(event)" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">عنوان المورد</label>
                    <input type="text" id="res-title" class="w-full border rounded-lg px-4 py-2" required>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                         <label class="block text-sm font-medium mb-1">المرحلة</label>
                         <select id="res-stage" class="w-full border rounded-lg px-4 py-2">
                            <option value="primary">ابتدائي</option>
                            <option value="middle">متوسط</option>
                            <option value="secondary">ثانوي</option>
                         </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">النوع</label>
                        <select id="res-type" class="w-full border rounded-lg px-4 py-2">
                           <option value="image">صورة / انفوجراف</option>
                           <option value="video">فيديو</option>
                           <option value="file">ملف</option>
                           <option value="interactive">درس تفاعلي</option>
                           <option value="game">لعبة رياضيات</option>
                        </select>
                   </div>
                </div>
                <div>
                     <label class="block text-sm font-medium mb-1">المادة</label>
                     <select id="res-subject" class="w-full border rounded-lg px-4 py-2">
                        <option value="math">رياضيات</option>
                        <option value="science">علوم</option>
                        <option value="arabic">لغة عربية</option>
                        <option value="english">لغة إنجليزية</option>
                        <option value="islamic">دراسات إسلامية</option>
                        <option value="art">تربية فنية</option>
                        <option value="pe">تربية بدنية</option>
                        <option value="computer">حاسب آلي</option>
                     </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">رابط المورد أو تحميل ملف</label>
                    <div class="flex gap-2">
                         <input type="text" id="res-url" placeholder="رابط خارجي..." class="flex-1 border rounded-lg px-4 py-2">
                         <label class="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                            <i class="fas fa-upload"></i>
                            <input type="file" class="hidden" onchange="handleFileUpload(this, (url) => document.getElementById('res-url').value = url)">
                         </label>
                    </div>
                </div>
                <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">إرسال للمراجعة</button>
            </form>
        </div>
    `;
}

function handleResourceSubmit(e) {
    e.preventDefault();
    const resources = getDB('school_resources');
    const newRes = {
        id: Date.now(),
        title: document.getElementById('res-title').value,
        stage: document.getElementById('res-stage').value,
        type: document.getElementById('res-type').value,
        subject: document.getElementById('res-subject').value,
        url: document.getElementById('res-url').value,
        authorId: currentUser.id,
        authorName: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        status: 'pending_supervisor' // pending_supervisor -> pending_admin -> approved
    };
    resources.push(newRes);
    setDB('school_resources', resources);
    alert('تم إرسال المورد للمشرف للموافقة');
    renderDashboard();
}

function renderSupervisorApprovals() {
    const resources = getDB('school_resources');
    const pending = resources.filter(r => r.status === 'pending_supervisor');
    renderApprovalList(pending, 'approveBySupervisor');
}

function renderAdminApprovals() {
    const resources = getDB('school_resources');
    const pending = resources.filter(r => r.status === 'pending_admin');
    renderApprovalList(pending, 'approveByAdmin');
}

function renderApprovalList(list, actionName) {
    const content = document.getElementById('dashboard-content');
    if (list.length === 0) {
        content.innerHTML = `<div class="text-center text-gray-500 py-10">لا يوجد موارد معلقة للموافقة</div>`;
        return;
    }
    content.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <h2 class="p-6 text-xl font-bold border-b">طلبات الموافقة</h2>
            <div class="divide-y">
                ${list.map(r => `
                    <div class="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                            <h4 class="font-bold">${r.title}</h4>
                            <p class="text-sm text-gray-500">${r.authorName} - ${r.subject} - ${r.type}</p>
                        </div>
                        <div class="flex gap-2">
                             <a href="${r.url}" target="_blank" class="px-3 py-1 bg-gray-100 rounded text-sm">معاينة</a>
                             <button onclick="${actionName}(${r.id})" class="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-bold">موافقة</button>
                             <button onclick="deleteResource(${r.id})" class="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-bold">رفض</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function approveBySupervisor(id) {
    const resources = getDB('school_resources');
    const res = resources.find(r => r.id === id);
    if (res) {
        res.status = 'pending_admin';
        setDB('school_resources', resources);
        renderSupervisorApprovals();
    }
}

function approveByAdmin(id) {
    const resources = getDB('school_resources');
    const res = resources.find(r => r.id === id);
    if (res) {
        res.status = 'approved';
        setDB('school_resources', resources);
        renderAdminApprovals();
    }
}

function deleteResource(id) {
    if(!confirm('حذف المورد؟')) return;
    const resources = getDB('school_resources');
    const idx = resources.findIndex(r => r.id === id);
    if (idx > -1) {
        resources.splice(idx, 1);
        setDB('school_resources', resources);
        // Refresh current view
        renderDashboard();
    }
}

function renderBrowseResources() {
    const resources = getDB('school_resources').filter(r => r.status === 'approved');
    const content = document.getElementById('dashboard-content');
    
    content.innerHTML = `
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">المكتبة الرقمية</h2>
                <select onchange="filterResources(this.value)" class="border rounded-lg px-4 py-2">
                    <option value="all">الكل</option>
                    <option value="math">رياضيات</option>
                    <option value="science">علوم</option>
                    <option value="english">لغة إنجليزية</option>
                </select>
            </div>
            <div id="resources-grid" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${resources.map(r => createResourceCard(r)).join('')}
            </div>
        </div>
    `;
}

function filterResources(subject) {
    const resources = getDB('school_resources').filter(r => r.status === 'approved');
    const filtered = subject === 'all' ? resources : resources.filter(r => r.subject === subject);
    const grid = document.getElementById('resources-grid');
    grid.innerHTML = filtered.map(r => createResourceCard(r)).join('');
}

function createResourceCard(r) {
    let icon = 'fa-file';
    let color = 'bg-gray-100';
    if (r.type === 'video') { icon = 'fa-video'; color = 'bg-red-100 text-red-600'; }
    if (r.type === 'image') { icon = 'fa-image'; color = 'bg-blue-100 text-blue-600'; }
    if (r.type === 'interactive') { icon = 'fa-hand-pointer'; color = 'bg-purple-100 text-purple-600'; }

    // Handle display based on type
    let mediaDisplay = '';
    if (r.type === 'image' && r.url.startsWith('data:')) {
        mediaDisplay = `<img src="${r.url}" class="w-full h-32 object-cover rounded-t-xl">`;
    } else {
        mediaDisplay = `<div class="w-full h-32 flex items-center justify-center ${color} rounded-t-xl"><i class="fas ${icon} text-3xl"></i></div>`;
    }

    const target = (r.type === 'video' || r.type === 'file' || r.type === 'game' || r.type === 'interactive') ? '_blank' : '_self';

    return `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            ${mediaDisplay}
            <div class="p-4">
                <h4 class="font-bold text-gray-800 mb-1 truncate">${r.title}</h4>
                <p class="text-xs text-gray-500 mb-3">${r.subject} | ${r.authorName}</p>
                <a href="${r.url}" target="${target}" class="block text-center w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors text-sm font-bold">
                    فتح المورد
                </a>
            </div>
        </div>
    `;
}

function renderProfile() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
        <div class="bg-white p-8 rounded-2xl shadow-sm max-w-lg mx-auto text-center">
            <div class="relative inline-block">
                 <img id="profile-img-large" src="${currentUser.avatar}" class="w-32 h-32 rounded-full border-4 border-indigo-50 object-cover mb-4">
                 <label class="absolute bottom-4 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg">
                    <i class="fas fa-camera"></i>
                    <input type="file" class="hidden" onchange="handleFileUpload(this, updateProfilePic)">
                 </label>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">${currentUser.name}</h2>
            <p class="text-indigo-500 font-semibold mb-6">${getRoleName(currentUser.role)}</p>
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                <div class="text-right">رقم الهوية: <span class="font-bold">${currentUser.id}</span></div>
                <div class="text-right">البريد: <span class="font-bold">${currentUser.email}</span></div>
            </div>
        </div>
    `;
}

function updateProfilePic(url) {
    currentUser.avatar = url;
    localStorage.setItem('current_session', JSON.stringify(currentUser));
    
    // Update main user list
    const users = getDB('school_users');
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx > -1) {
        users[idx].avatar = url;
        setDB('school_users', users);
    }
    
    // Refresh UI
    checkSession();
    renderProfile();
}