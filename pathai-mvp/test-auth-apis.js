const { hashPassword, verifyPassword, validateEmail, normalizeEmail } = require('./src/lib/auth');

async function runTests() {
  console.log('--- STARTING AUTH API & UTILITY TESTS ---');

  // Test 1: Email Validation
  console.log('\nTesting email validation...');
  const validEmail = 'test@pathai.com';
  const invalidEmail = 'testpathai.com';
  console.log(`validateEmail("${validEmail}"):`, validateEmail(validEmail) === true ? 'PASS' : 'FAIL');
  console.log(`validateEmail("${invalidEmail}"):`, validateEmail(invalidEmail) === false ? 'PASS' : 'FAIL');

  // Test 2: Email Normalization
  console.log('\nTesting email normalization...');
  const dirtyEmail = '  TeSt@PaThAI.cOm  ';
  console.log(`normalizeEmail("${dirtyEmail}"):`, normalizeEmail(dirtyEmail) === 'test@pathai.com' ? 'PASS' : 'FAIL');

  // Test 3: Password Hashing
  console.log('\nTesting password hashing...');
  const password = 'test123';
  const hash = hashPassword(password);
  console.log('Generated Hash:', hash);
  console.log('Verify correct password:', verifyPassword(password, hash) === true ? 'PASS' : 'FAIL');
  console.log('Verify incorrect password:', verifyPassword('wrongpass', hash) === false ? 'PASS' : 'FAIL');

  // Test 4: Integration with API Endpoints
  console.log('\nTesting API routes via fetch...');
  const baseUrl = 'http://localhost:3000';

  try {
    // 4.1 Check duplicate registration error
    console.log('\nTesting Registration API...');
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@pathai.com',
        password: 'test123',
        name: 'Ravi Kumar',
        trade: 'Welder',
        state: 'Maharashtra',
        district: 'Pune',
        language: 'en',
        qualification: 'ITI',
        experience_years: 0,
        consent_given: true
      })
    });
    const regData = await regRes.json();
    console.log('Register Response Status:', regRes.status);
    console.log('Register Response Body:', regData);

    // 4.2 Login with correct password
    console.log('\nTesting Login API (Correct Credentials)...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@pathai.com',
        password: 'test123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response Status:', loginRes.status);
    console.log('Login User Name:', loginData.user ? loginData.user.name : 'null');
    const cookieHeader = loginRes.headers.get('set-cookie');
    console.log('Has Session Cookie:', !!cookieHeader ? 'PASS' : 'FAIL');

    // 4.3 Login with incorrect password
    console.log('\nTesting Login API (Incorrect Password)...');
    const wrongLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@pathai.com',
        password: 'wrongpassword'
      })
    });
    const wrongLoginData = await wrongLoginRes.json();
    console.log('Wrong Login Response Status:', wrongLoginRes.status);
    console.log('Wrong Login Error Message:', wrongLoginData.error);
    console.log('Expected incorrect password error:', wrongLoginData.error === 'Incorrect password. Please try again.' ? 'PASS' : 'FAIL');

    // 4.4 Me API endpoint
    console.log('\nTesting Me API...');
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: cookieHeader ? { 'Cookie': cookieHeader.split(';')[0] } : {}
    });
    const meData = await meRes.json();
    console.log('Me Response Status:', meRes.status);
    console.log('Me User Email:', meData.user ? meData.user.email : 'null');

    // 4.5 Logout API
    console.log('\nTesting Logout API...');
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: cookieHeader ? { 'Cookie': cookieHeader.split(';')[0] } : {}
    });
    console.log('Logout Response Status:', logoutRes.status);

  } catch (err) {
    console.error('Fetch error during API testing:', err.message);
    console.log('Make sure the dev server is running on http://localhost:3000');
  }

  console.log('\n--- VERIFICATION COMPLETED ---');
}

runTests();
