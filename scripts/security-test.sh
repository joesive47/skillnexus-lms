#!/bin/bash

echo "🔒 SkillNexus Security Penetration Test"
echo "========================================"
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Rate Limiting
echo "Test 1: Rate Limiting (DDoS Protection)"
echo "Sending 150 requests to test rate limit..."
for i in {1..150}; do
  response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/health)
  if [ "$response" == "429" ]; then
    echo "✅ Rate limit working! Blocked at request $i"
    break
  fi
done
echo ""

# Test 2: Test Endpoint Blocking
echo "Test 2: Test Endpoint Protection"
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/test)
if [ "$response" == "404" ]; then
  echo "✅ /test endpoint blocked in production"
else
  echo "⚠️  /test endpoint still accessible: $response"
fi
echo ""

# Test 3: Password Hash Exposure
echo "Test 3: Password Hash Exposure Check"
response=$(curl -s $BASE_URL/api/test-users)
if [[ $response == *"password"* ]]; then
  echo "⚠️  CRITICAL: Password hashes exposed!"
else
  echo "✅ Password hashes protected"
fi
echo ""

# Test 4: SQL Injection Attempt
echo "Test 4: SQL Injection Protection"
response=$(curl -s -X POST $BASE_URL/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com'\'' OR '\''1'\''='\''1","password":"test"}')
if [[ $response == *"error"* ]]; then
  echo "✅ SQL injection blocked"
else
  echo "⚠️  Potential SQL injection vulnerability"
fi
echo ""

# Test 5: XSS Attempt
echo "Test 5: XSS Protection"
response=$(curl -s -X POST $BASE_URL/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>"}')
if [[ $response == *"<script>"* ]]; then
  echo "⚠️  XSS vulnerability detected!"
else
  echo "✅ XSS protection working"
fi
echo ""

# Test 6: Brute Force Protection
echo "Test 6: Brute Force Protection"
echo "Attempting 10 failed logins..."
for i in {1..10}; do
  curl -s -X POST $BASE_URL/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@test.com","password":"wrong'$i'"}' > /dev/null
done
echo "✅ Brute force test completed (check audit logs)"
echo ""

# Test 7: Security Headers
echo "Test 7: Security Headers Check"
headers=$(curl -s -I $BASE_URL)
if [[ $headers == *"X-Content-Type-Options"* ]]; then
  echo "✅ Security headers present"
else
  echo "⚠️  Missing security headers"
fi
echo ""

echo "========================================"
echo "🎯 Security Test Complete!"
echo "Check /api/security/audit for detailed logs"
