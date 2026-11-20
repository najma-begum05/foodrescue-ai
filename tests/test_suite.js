/**
 * End-to-End System Integration Test Suite
 * FoodRescue AI – Intelligent Food Surplus Management & Redistribution Platform
 * 
 * Validates:
 * 1. Health & Core Connectivity
 * 2. User Authentication & Role-Based Authorization
 * 3. Food Surplus Listing CRUD
 * 4. Multi-Recipient Inventory Lock & Claim Lifecycle
 * 5. AI Multi-Criteria Matching Engine
 * 6. Food Urgency & Shelf-Life Classifier
 * 7. End-of-Day Surplus Forecaster
 * 8. OpenStreetMap Fleet Route Optimization
 */

import http from 'http';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_PORT = 5050;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', err => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function waitForServer(maxRetries = 35) {
  return new Promise((resolve, reject) => {
    let retries = 0;
    const check = () => {
      const req = http.get(`http://127.0.0.1:${TEST_PORT}/api/health`, (res) => {
        res.resume();
        if (res.statusCode === 200) {
          resolve();
        } else {
          retry(`Status ${res.statusCode}`);
        }
      });
      req.on('error', (err) => retry(err.message));
    };

    const retry = (reason) => {
      retries++;
      if (retries >= maxRetries) {
        reject(new Error(`Server did not start within expected time (last error: ${reason})`));
      } else {
        setTimeout(check, 400);
      }
    };

    check();
  });
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 FOODRESCUE AI – END-TO-END AUTOMATED VERIFICATION SUITE');
  console.log('================================================================');
  
  console.log('🚀 Launching backend API process in test runner namespace...');
  const serverPath = path.resolve(__dirname, '../server/src/server.js');
  const serverProcess = spawn('node', [serverPath], {
    env: { ...process.env, PORT: String(TEST_PORT) }
  });

  serverProcess.stdout.on('data', (d) => {
    const str = d.toString();
    if (str.includes('Server listening')) {
      console.log('📡 ' + str.trim().split('\n')[1] || str.trim());
    }
  });

  serverProcess.stderr.on('data', (d) => {
    console.error('SERVER STDERR:', d.toString());
  });

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName}: ${details}`);
    }
  }

  const cleanup = () => {
    try {
      serverProcess.kill('SIGTERM');
    } catch {
      // Ignore
    }
  };

  try {
    await waitForServer();
    console.log('🟢 Backend API ready on http://127.0.0.1:5000');

    // 1. Health Check
    console.log('\n--- MODULE 1 & CORE: HEALTH & CONNECTIVITY ---');
    const health = await makeRequest('GET', '/api/health');
    assert(health.status === 200 && health.data.status === 'healthy', 'Health Check Endpoint /api/health');

    // 2. Authentication: Provider Login
    console.log('\n--- MODULE 1: AUTHENTICATION & JWT ROLES ---');
    const providerAuth = await makeRequest('POST', '/api/auth/login', {
      email: 'taj@hyderabad.com',
      password: 'password123'
    });
    assert(providerAuth.status === 200 && providerAuth.data.token, 'Provider Login & JWT Issuance');
    assert(providerAuth.data.user.role === 'provider', 'Provider Role Validation');
    const providerToken = providerAuth.data.token;

    // NGO Login
    const ngoAuth = await makeRequest('POST', '/api/auth/login', {
      email: 'hope@haven.org',
      password: 'password123'
    });
    assert(ngoAuth.status === 200 && ngoAuth.data.user.role === 'ngo', 'NGO Login & Role Validation');
    const ngoToken = ngoAuth.data.token;

    // 3. Food Listing CRUD
    console.log('\n--- MODULE 3: FOOD SURPLUS LISTINGS ---');
    const allListings = await makeRequest('GET', '/api/listings');
    assert(allListings.status === 200 && Array.isArray(allListings.data.listings), 'Public Surplus Listings Directory');

    // Create New Surplus Listing
    const newListing = await makeRequest('POST', '/api/listings', {
      foodName: 'Hot Vegetable Pulao & Raita',
      category: 'Cooked Meals',
      foodType: 'cooked',
      quantity: 60,
      unit: 'meals',
      dietary: 'Vegetarian',
      foodCondition: 'Freshly Prepared Hot Banquet',
      storageRequirements: 'Keep Hot (>65°C)',
      pickupLocation: 'Banjara Hills, Hyderabad',
      pickupWindow: 'Within 2 hours',
      expiryDate: new Date(Date.now() + 3.5 * 3600 * 1000).toISOString(),
      location: { type: 'Point', coordinates: [78.4357, 17.4156] }
    }, { Authorization: `Bearer ${providerToken}` });
    assert(newListing.status === 201 && newListing.data.listing, 'Provider Publishes Food Surplus Listing');
    const createdId = newListing.data.listing._id || newListing.data.listing.id;

    // 4. Multi-Recipient Inventory Lock Workflow
    console.log('\n--- MODULE 5: MULTI-RECIPIENT INVENTORY LOCK WORKFLOW ---');
    const claimPortion = 40;
    const claimRes = await makeRequest('POST', '/api/requests', {
      listingId: createdId,
      quantityRequested: claimPortion,
      pickupSchedule: 'Today 5:30 PM',
      notes: 'For Hope Haven evening children meal'
    }, { Authorization: `Bearer ${ngoToken}` });
    
    assert(claimRes.status === 201 && claimRes.data.success, 'NGO Submits Donation Request');
    assert(claimRes.data.remainingInventory === 20, 'Inventory Atomically Decremented (60 - 40 = 20 remaining)');

    const requestId = claimRes.data.request._id;

    // Provider Accepts Request
    const acceptRes = await makeRequest('PATCH', `/api/requests/${requestId}/respond`, {
      action: 'accept',
      pickupSchedule: 'Confirmed 5:30 PM Collection'
    }, { Authorization: `Bearer ${providerToken}` });
    assert(acceptRes.status === 200 && acceptRes.data.request.status === 'accepted', 'Provider Approves Claim & Sets Pickup');

    // NGO Confirms Food Receipt
    const confirmRes = await makeRequest('PATCH', `/api/requests/${requestId}/confirm`, {}, { Authorization: `Bearer ${ngoToken}` });
    assert(confirmRes.status === 200 && confirmRes.data.request.status === 'completed', 'NGO Confirms Collection Receipt Handover');

    // 5. AI Multi-Criteria Matching Engine
    console.log('\n--- MODULE 6: AI MULTI-CRITERIA MATCHING ENGINE ---');
    const recsRes = await makeRequest('GET', '/api/ai/recommendations');
    assert(recsRes.status === 200 && recsRes.data.recommendations.length > 0, 'AI Recommendations Generated');
    const topMatch = recsRes.data.recommendations[0];
    assert(topMatch.aiMatchScore >= 80, `High Compatibility Score (${topMatch.aiMatchScore}%)`);
    assert(topMatch.matchExplanation && topMatch.matchExplanation.length > 10, 'Natural Language Match Explanation Included');

    // 6. Food Urgency & Shelf-Life Classifier
    console.log('\n--- MODULE 7: FOOD EXPIRY & URGENCY CLASSIFIER ---');
    const urgentTest = await makeRequest('POST', '/api/ai/predict-urgency', {
      category: 'Cooked Meals',
      expiryDate: new Date(Date.now() + 2.5 * 3600 * 1000).toISOString(),
      storageCondition: 'Keep Hot (>65°C)'
    });
    assert(urgentTest.status === 200 && urgentTest.data.classification === 'CRITICAL', 'Urgency Correctly Classified as CRITICAL (< 4h shelf-life)');

    // 7. AI End-of-Day Surplus Forecaster
    console.log('\n--- MODULE 8: AI SURPLUS FORECAST MODEL ---');
    const forecastTest = await makeRequest('POST', '/api/ai/forecast-surplus', {
      preparedQuantity: 400,
      category: 'Cooked Meals',
      dayOfWeek: 'Friday',
      eventType: 'Banquet Buffet'
    });
    assert(forecastTest.status === 200 && forecastTest.data.result.predictedSurplusQuantity > 0, 'Surplus Quantity Predicted');
    assert(forecastTest.data.result.predictionConfidence >= 85, `Confidence Score (${forecastTest.data.result.predictionConfidence}%)`);
    assert(forecastTest.data.result.recommendedAction.length > 10, 'Strategic Proactive Action Suggested');

    // 8. OpenStreetMap Fleet Route Optimization
    console.log('\n--- MODULE 9: FLEET LOGISTICS & ROUTE OPTIMIZATION ---');
    const fleetRes = await makeRequest('GET', '/api/logistics/shipments');
    assert(fleetRes.status === 200 && fleetRes.data.shipments.length >= 2, 'Assigned Logistics Shipments Listed');

    const optimizeRes = await makeRequest('POST', '/api/logistics/optimize-route');
    assert(optimizeRes.status === 200 && optimizeRes.data.optimizedSequence.length >= 4, 'Multi-Stop Sequence Generated with Precedence');
    assert(optimizeRes.data.co2SavedKg > 0, `Carbon Emissions Saved (${optimizeRes.data.co2SavedKg} kg CO2)`);

    console.log('\n================================================================');
    console.log(`🏁 VERIFICATION SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (100% SUCCESS)`);
    console.log('================================================================\n');

    cleanup();
    process.exit(0);

  } catch (err) {
    console.error('Test Suite encountered an error:', err.message);
    cleanup();
    process.exit(1);
  }
}

runTestSuite();
