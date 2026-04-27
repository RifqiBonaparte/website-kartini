// ============================================
// Website Hari Kartini - JavaScript
// ============================================

// Database pengguna (simulasi dengan localStorage)
const USERS_KEY = 'kartini_users';
const CURRENT_USER_KEY = 'kartini_current_user';

// Fungsi untuk mendapatkan data pengguna
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Fungsi untuk menyimpan data pengguna
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Fungsi untuk mendapatkan pengguna saat ini
function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Fungsi untuk menyimpan pengguna saat ini
function setCurrentUser(user) {
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
}

// Fungsi untuk registrasi pengguna
function register(name, email, password) {
    const users = getUsers();
    
    // Cek apakah email sudah terdaftar
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return { success: false, message: 'Email sudah terdaftar!' };
    }
    
    // Buat pengguna baru
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // Dalam aplikasi nyata, password harus di-hash
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, message: 'Registrasi berhasil! Silakan login.' };
}

// Fungsi untuk login
function login(email, password, remember) {
    const users = getUsers();
    
    // Cek kredensial
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        return { success: true, message: 'Login berhasil!' };
    } else {
        return { success: false, message: 'Email atau password salah!' };
    }
}

// Fungsi untuk logout
function logout() {
    setCurrentUser(null);
    window.location.href = 'index.html';
}

// Fungsi untuk cek apakah pengguna sudah login
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Fungsi untuk redirect ke halaman yang sesuai
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Fungsi untuk update UI berdasarkan status login
function updateAuthUI() {
    const user = getCurrentUser();
    const loginBtn = document.querySelector('.btn-login');
    const userName = document.getElementById('userName');
    const welcomeName = document.getElementById('welcomeName');
    
    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userName) userName.textContent = user.name;
        if (welcomeName) welcomeName.textContent = user.name;
    }
}

// ============================================
// Event Listeners
// ============================================

// Registrasi
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const messageDiv = document.getElementById('registerMessage');
        
        // Validasi
        if (password !== confirmPassword) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Password tidak cocok!';
            return;
        }
        
        if (password.length < 6) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Password minimal 6 karakter!';
            return;
        }
        
        // Proses registrasi
        const result = register(name, email, password);
        
        if (result.success) {
            messageDiv.className = 'message success';
            messageDiv.textContent = result.message;
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.message;
        }
    });
}

// Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember') ? document.getElementById('remember').checked : false;
        const messageDiv = document.getElementById('loginMessage');
        
        // Proses login
        const result = login(email, password, remember);
        
        if (result.success) {
            messageDiv.className = 'message success';
            messageDiv.textContent = result.message;
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = result.message;
        }
    });
}

// Logout
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

// Update UI saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
});

// ============================================
// Inisialisasi pengguna demo (untuk testing)
// ============================================
function initDemoUser() {
    const users = getUsers();
    if (users.length === 0) {
        // Buat pengguna demo
        register('Admin Kartini', 'admin@kartini.com', 'password123');
        console.log('Pengguna demo telah dibuat: admin@kartini.com / password123');
    }
}

// Panggil fungsi init saat script dimuat
initDemoUser();