# Backend Integration Code 

## API Base URL
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

## 1. Signup Page Integration

**Add this JavaScript to your existing signup page:**

```javascript
// Signup function - call this from your existing form submit
async function signupUser(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/civix/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: formData.location // optional
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Success - user created
      alert('Account created successfully! Please login.');
      // Redirect to your login page
      window.location.href = '/login'; // or your login page path
    } else {
      // Handle errors
      handleSignupErrors(data);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error. Please try again.');
  }
}

function handleSignupErrors(data) {
  if (data.error === 'Validation failed') {
    // Show field-specific errors
    data.details.forEach(error => {
      showFieldError(error.path, error.msg);
    });
  } else if (data.error === 'Too many requests from this IP') {
    alert('Too many signup attempts. Please try again after 15 minutes.');
  } else if (data.error === 'Invalid location') {
    showFieldError('location', data.message);
  } else {
    alert(data.error || 'Signup failed');
  }
}

function showFieldError(fieldName, message) {
  // Add this to show error near your form fields
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (field) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Add new error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '14px';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }
}
```

**Call signup function from your form:**
```javascript
// Example: if your form has id="signupForm"
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = {
    name: document.querySelector('[name="name"]').value,
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value,
    location: document.querySelector('[name="location"]').value
  };
  
  signupUser(formData);
});
```

## 2. Login Page Integration

**Add this JavaScript to your existing login page:**

```javascript
// Login function - call this from your existing form submit
async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/civix/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Success - store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      alert('Login successful!');
      // Redirect to your dashboard/profile page
      window.location.href = '/dashboard'; // or your main page path
    } else {
      // Handle errors
      handleLoginErrors(data);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error. Please try again.');
  }
}

function handleLoginErrors(data) {
  if (data.error === 'Validation failed') {
    // Show field-specific errors
    data.details.forEach(error => {
      showFieldError(error.path, error.msg);
    });
  } else if (data.error === 'Too many requests from this IP') {
    alert('Too many login attempts. Please try again after 15 minutes.');
  } else {
    alert(data.error || 'Login failed');
  }
}
```

**Call login function from your form:**
```javascript
// Example: if your form has id="loginForm"
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const credentials = {
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value
  };
  
  loginUser(credentials);
});
```

## 3. User Profile Page Integration

**Add this JavaScript to your existing profile/dashboard page:**

```javascript
// Load user profile - call this when page loads
async function loadUserProfile() {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    // No token - redirect to login
    alert('Please login first');
    window.location.href = '/login'; // your login page path
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/civix/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok) {
      // Success - display user profile
      displayUserProfile(data.profile);
    } else {
      // Token invalid - redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      alert('Session expired. Please login again.');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Failed to load profile');
  }
}

function displayUserProfile(profile) {
  // Update your existing HTML elements with profile data
  // Adjust these selectors to match your HTML structure
  
  const nameElement = document.getElementById('userName') || document.querySelector('.user-name');
  const emailElement = document.getElementById('userEmail') || document.querySelector('.user-email');
  const roleElement = document.getElementById('userRole') || document.querySelector('.user-role');
  const locationElement = document.getElementById('userLocation') || document.querySelector('.user-location');
  const memberSinceElement = document.getElementById('memberSince') || document.querySelector('.member-since');
  
  if (nameElement) nameElement.textContent = profile.name;
  if (emailElement) emailElement.textContent = profile.email;
  if (roleElement) roleElement.textContent = profile.role;
  if (locationElement) locationElement.textContent = profile.location || 'Not specified';
  if (memberSinceElement) memberSinceElement.textContent = new Date(profile.memberSince).toLocaleDateString();
}

// Call this when page loads
document.addEventListener('DOMContentLoaded', loadUserProfile);
```

## 4. Logout Functionality

**Add this JavaScript to any page that has logout button:**

```javascript
// Logout function - call this from your logout button
async function logoutUser() {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    await fetch(`${API_BASE_URL}/civix/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear storage and redirect
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    alert('Logged out successfully');
    window.location.href = '/login'; // your login page path
  }
}

// Example: if your logout button has id="logoutBtn"
document.getElementById('logoutBtn').addEventListener('click', logoutUser);
```

## 5. Page Protection (Optional)

**Add this to pages that require login:**

```javascript
// Check if user is logged in - call this on protected pages
function checkAuth() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('Please login to access this page');
    window.location.href = '/login';
  }
}

// Call this when protected page loads
document.addEventListener('DOMContentLoaded', checkAuth);
```

## 6. Form Field Requirements

**Make sure your HTML forms have these field names:**

**Signup Form:**
```html
<input name="name" type="text" required>
<input name="email" type="email" required>
<input name="password" type="password" required>
<input name="location" type="text"> <!-- optional -->
```

**Login Form:**
```html
<input name="email" type="email" required>
<input name="password" type="password" required>
```

## 7. Error Display CSS

**Add this CSS for error messages:**

```css
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
```

## 8. Testing Your Integration

1. **Test Signup**: Try with valid/invalid data
2. **Test Login**: Use created account credentials
3. **Test Profile**: Should show user data after login
4. **Test Logout**: Should clear data and redirect
5. **Test Protection**: Try accessing profile without login

## 9. Quick Integration Checklist

- [ ] Add API_BASE_URL constant
- [ ] Add signup function to signup page
- [ ] Add login function to login page  
- [ ] Add profile loading to dashboard/profile page
- [ ] Add logout function to logout button
- [ ] Update HTML selectors to match your elements
- [ ] Update redirect paths to match your routes
- [ ] Test all flows work correctly

**That's it! Your existing frontend is now connected to the backend.**