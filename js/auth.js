// ==========================================
// College Market — Auth System (auth.js)
// ==========================================

const AUTH_STORAGE_KEY = 'college_market_auth_v1';
const USERS_STORAGE_KEY = 'college_market_users_v1';

// Default demo accounts (pre-seeded)
const DEMO_ACCOUNTS = {
  student: { username: '66001234', password: 'student123', role: 'student', name: 'สมชาย ใจดี', dept: 'คอมพิวเตอร์ธุรกิจ', phone: '089-123-4567' },
  teacher: { username: 'T001', password: 'teacher123', role: 'teacher', name: 'อาจารย์สมหญิง มีสุข', dept: 'บุคลากร/ครูผู้สอน', phone: '081-234-5678' }
};

// ---- Utilities ----
function getUsers() {
  try {
    const u = localStorage.getItem(USERS_STORAGE_KEY);
    const users = u ? JSON.parse(u) : [];
    // Ensure demo accounts always exist
    const hasDemoStudent = users.some(x => x.username === DEMO_ACCOUNTS.student.username);
    const hasDemoTeacher = users.some(x => x.username === DEMO_ACCOUNTS.teacher.username);
    if (!hasDemoStudent) users.push({ ...DEMO_ACCOUNTS.student, id: 'demo-student' });
    if (!hasDemoTeacher) users.push({ ...DEMO_ACCOUNTS.teacher, id: 'demo-teacher' });
    return users;
  } catch { return [{ ...DEMO_ACCOUNTS.student, id: 'demo-student' }, { ...DEMO_ACCOUNTS.teacher, id: 'demo-teacher' }]; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)); } catch { return null; }
}

function saveSession(user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...user, loginAt: Date.now() }));
}

function clearSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// ---- Tab Switching ----
function switchTab(tab) {
  const loginSection = document.getElementById('loginSection');
  const registerSection = document.getElementById('registerSection');
  const loginTab = document.getElementById('loginTabBtn');
  const registerTab = document.getElementById('registerTabBtn');
  const loginErr = document.getElementById('loginError');
  const regErr = document.getElementById('registerError');

  if (tab === 'login') {
    loginSection.style.display = '';
    registerSection.style.display = 'none';
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    if (loginErr) loginErr.style.display = 'none';
  } else {
    loginSection.style.display = 'none';
    registerSection.style.display = '';
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
    if (regErr) regErr.style.display = 'none';
  }
}

// ---- Toggle Password ----
function togglePassword(inputId, eyeId) {
  const input = document.getElementById(inputId);
  const eye = document.getElementById(eyeId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (eye) eye.className = 'fa-regular fa-eye-slash';
  } else {
    input.type = 'password';
    if (eye) eye.className = 'fa-regular fa-eye';
  }
}

// ---- Fill Demo ----
function fillDemo(role) {
  const demo = DEMO_ACCOUNTS[role];
  if (!demo) return;
  const roleInputs = document.querySelectorAll('input[name="loginRole"]');
  roleInputs.forEach(r => { r.checked = (r.value === role); });
  document.getElementById('loginUsername').value = demo.username;
  document.getElementById('loginPassword').value = demo.password;
  document.getElementById('loginError').style.display = 'none';
  // Briefly flash the inputs
  ['loginUsername', 'loginPassword'].forEach(id => {
    const el = document.getElementById(id);
    el.style.borderColor = '#4f46e5';
    setTimeout(() => el.style.borderColor = '', 700);
  });
}

// ---- Password Strength ----
function checkPasswordStrength(pw) {
  const fill = document.getElementById('pwStrengthFill');
  const label = document.getElementById('pwStrengthLabel');
  if (!fill || !label) return;

  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  const levels = [
    { w: '20%', color: '#ef4444', text: 'อ่อนมาก' },
    { w: '40%', color: '#f97316', text: 'อ่อน' },
    { w: '60%', color: '#eab308', text: 'ปานกลาง' },
    { w: '80%', color: '#84cc16', text: 'แข็งแกร่ง' },
    { w: '100%', color: '#22c55e', text: 'แข็งแกร่งมาก' },
  ];
  const lvl = levels[Math.min(score - 1, 4)] || { w: '0%', color: '#e2e8f0', text: '' };
  fill.style.width = pw ? lvl.w : '0%';
  fill.style.background = lvl.color;
  label.textContent = pw ? lvl.text : '';
  label.style.color = lvl.color;
}

// ---- Login Handler ----
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const role = document.querySelector('input[name="loginRole"]:checked')?.value || 'student';
  const errBox = document.getElementById('loginError');
  const errMsg = document.getElementById('loginErrorMsg');
  const btnText = document.getElementById('loginBtnText');
  const btnLoad = document.getElementById('loginBtnLoading');

  errBox.style.display = 'none';
  btnText.style.display = 'none';
  btnLoad.style.display = '';

  setTimeout(() => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password && u.role === role);

    btnText.style.display = '';
    btnLoad.style.display = 'none';

    if (user) {
      saveSession(user);
      // Redirect to marketplace
      showSuccessAnimation(() => {
        window.location.href = 'index.html';
      });
    } else {
      errBox.style.display = 'flex';
      errMsg.textContent = 'รหัสผู้ใช้, รหัสผ่าน หรือประเภทสมาชิกไม่ถูกต้อง';
      // Shake effect
      const card = document.querySelector('.auth-card');
      card.style.animation = 'shake 0.4s ease';
      setTimeout(() => card.style.animation = '', 400);
    }
  }, 900);
}

// ---- Register Handler ----
function handleRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('regFirstName').value.trim();
  const lastName = document.getElementById('regLastName').value.trim();
  const username = document.getElementById('regUsername').value.trim();
  const dept = document.getElementById('regDept').value;
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirmPassword').value;
  const role = document.querySelector('input[name="registerRole"]:checked')?.value || 'student';
  const errBox = document.getElementById('registerError');
  const errMsg = document.getElementById('registerErrorMsg');
  const btnText = document.getElementById('registerBtnText');
  const btnLoad = document.getElementById('registerBtnLoading');

  errBox.style.display = 'none';

  // Validation
  if (password !== confirm) {
    errBox.style.display = 'flex';
    errMsg.textContent = 'รหัสผ่านทั้งสองช่องไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง';
    return;
  }
  if (password.length < 6) {
    errBox.style.display = 'flex';
    errMsg.textContent = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    return;
  }

  const users = getUsers();
  if (users.find(u => u.username === username)) {
    errBox.style.display = 'flex';
    errMsg.textContent = `รหัสประจำตัว "${username}" ถูกใช้งานแล้ว กรุณาใช้รหัสอื่น`;
    return;
  }

  btnText.style.display = 'none';
  btnLoad.style.display = '';

  setTimeout(() => {
    const newUser = {
      id: 'u_' + Date.now(),
      username,
      password,
      role,
      name: firstName + ' ' + lastName,
      dept,
      phone,
      joinedAt: Date.now()
    };
    users.push(newUser);
    saveUsers(users);
    saveSession(newUser);

    btnText.style.display = '';
    btnLoad.style.display = 'none';

    showSuccessAnimation(() => {
      window.location.href = 'index.html';
    });
  }, 1000);
}

// ---- Success Animation before redirect ----
function showSuccessAnimation(callback) {
  const card = document.querySelector('.auth-card');
  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <div style="
      position:fixed; inset:0; z-index:9999;
      display:flex; align-items:center; justify-content:center;
      background:rgba(10,15,30,0.7); backdrop-filter:blur(6px);
      animation: fadeIn 0.3s ease;
    ">
      <div style="
        background:white; border-radius:20px; padding:2.5rem 3rem;
        text-align:center; box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        animation: scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
      ">
        <div style="
          width:72px; height:72px; background:linear-gradient(135deg,#4f46e5,#7c3aed);
          border-radius:50%; display:flex; align-items:center; justify-content:center;
          margin:0 auto 1rem; font-size:2rem; color:white;
          box-shadow: 0 8px 24px rgba(79,70,229,0.4);
        ">
          <i class="fa-solid fa-check"></i>
        </div>
        <h3 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin-bottom:0.3rem;">เข้าสู่ระบบสำเร็จ!</h3>
        <p style="color:#64748b; font-size:0.9rem;">กำลังพาคุณไปยังหน้าตลาดสินค้า...</p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(callback, 1400);
}

// ---- Theme Toggle ----
function toggleAuthTheme() {
  const html = document.documentElement;
  const icon = document.getElementById('authThemeIcon');
  if (html.getAttribute('data-theme') === 'dark') {
    html.setAttribute('data-theme', 'light');
    icon.className = 'fa-solid fa-moon';
    localStorage.setItem('college_market_theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    icon.className = 'fa-solid fa-sun';
    localStorage.setItem('college_market_theme', 'dark');
  }
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  // If already logged in → redirect
  const session = getSession();
  if (session) {
    window.location.href = 'index.html';
    return;
  }

  // Apply saved theme
  const savedTheme = localStorage.getItem('college_market_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const icon = document.getElementById('authThemeIcon');
  if (icon) icon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

  // Ensure demo users exist
  const users = getUsers();
  saveUsers(users);

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes scaleIn { from { transform:scale(0.7); opacity:0; } to { transform:scale(1); opacity:1; } }
  `;
  document.head.appendChild(style);
});
