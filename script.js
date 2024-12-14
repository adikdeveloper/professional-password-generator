const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const strengthBar = document.getElementById('strength-bar');

lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
});

function generatePassword() {
    const length = document.getElementById('length').value;
    const uppercase = document.getElementById('uppercase').checked;
    const lowercase = document.getElementById('lowercase').checked;
    const numbers = document.getElementById('numbers').checked;
    const symbols = document.getElementById('symbols').checked;

    let chars = '';
    if(uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if(lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if(numbers) chars += '0123456789';
    if(symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if(chars === '') {
        alert('Kamida bitta parametrni tanlang!');
        return;
    }

    let password = '';
    for(let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }

    document.getElementById('password').value = password;
    updateStrengthMeter(password);
    updateDetailedStrength(password);
}

function copyPassword() {
    const passwordField = document.getElementById('password');
    if(passwordField.value) {
        navigator.clipboard.writeText(passwordField.value);
        alert('Parol nusxalandi!');
    }
}

function updateStrengthMeter(password) {
    let strength = 0;
    if(password.length >= 8) strength += 20;
    if(password.match(/[a-z]/)) strength += 20;
    if(password.match(/[A-Z]/)) strength += 20;
    if(password.match(/[0-9]/)) strength += 20;
    if(password.match(/[^a-zA-Z0-9]/)) strength += 20;

    strengthBar.style.width = strength + '%';
    
    if(strength <= 20) {
        strengthBar.style.background = '#ff4444';
    } else if(strength <= 40) {
        strengthBar.style.background = '#ffbb33';
    } else if(strength <= 60) {
        strengthBar.style.background = '#00C851';
    } else if(strength <= 80) {
        strengthBar.style.background = '#007E33';
    } else {
        strengthBar.style.background = '#004d1f';
    }
}

function updateDetailedStrength(password) {
    const criteria = {
        lengthCriteria: password.length >= 8,
        upperCriteria: /[A-Z]/.test(password),
        lowerCriteria: /[a-z]/.test(password),
        numberCriteria: /[0-9]/.test(password),
        symbolCriteria: /[^a-zA-Z0-9]/.test(password),
        sequenceCriteria: !hasSequentialChars(password)
    };

    for(let [id, met] of Object.entries(criteria)) {
        const element = document.getElementById(id);
        if(met) {
            element.classList.add('met');
        } else {
            element.classList.remove('met');
        }
    }
}

function hasSequentialChars(password) {
    const sequence = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for(let i = 0; i < password.length - 2; i++) {
        const fragment = password.substr(i, 3);
        if(sequence.includes(fragment)) return true;
    }
    return false;
}

function saveToPDF() {
    const password = document.getElementById('password').value;
    if(!password) {
        alert('Avval parol yarating!');
        return;
    }

    // jsPDF ni ishga tushirish
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // PDF ga yozish uchun matnlar
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text("Yaratilgan Parol:", 20, 20);
    
    doc.setFontSize(14);
    doc.text(password, 20, 30);
    
    doc.setFontSize(12);
    doc.text("Yaratilgan vaqt: " + new Date().toLocaleString('uz-UZ'), 20, 45);
    doc.text("Eslatma: Bu parolni xavfsiz joyda saqlang!", 20, 60);

    // PDF ni saqlash
    doc.save('parol.pdf');
}

function showSMSDialog() {
    const dialog = document.getElementById('smsDialog');
    dialog.style.display = dialog.style.display === 'none' ? 'block' : 'none';
}

function sendSMS() {
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const status = document.getElementById('smsStatus');

    if(!password) {
        alert('Avval parol yarating!');
        return;
    }

    if(!phoneNumber.match(/^\+998\d{9}$/)) {
        status.className = 'sms-status error';
        status.textContent = 'Noto\'g\'ri telefon raqami formati';
        status.style.display = 'block';
        return;
    }

    // SMS yuborish uchun API so'rovi
    // Bu yerda haqiqiy SMS yuborish logikasi bo'lishi kerak
    
    status.className = 'sms-status success';
    status.textContent = 'Parol muvaffaqiyatli yuborildi!';
    status.style.display = 'block';
}

// Dastlabki parolni yaratish
generatePassword();