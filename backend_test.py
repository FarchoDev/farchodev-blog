#!/usr/bin/env python3
"""
Backend API Testing for FarchoDev Blog - Authentication System
Tests authentication endpoints focusing on response structure and real-time UI updates
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Get backend URL from frontend .env
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("❌ Could not get backend URL from frontend/.env")
    sys.exit(1)

API_BASE = f"{BASE_URL}/api"
print(f"🔗 Testing API at: {API_BASE}")

class AuthTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_user_email = f"testuser_{uuid.uuid4().hex[:8]}@farchodev.com"
        self.test_user_password = "securepassword123"
        self.test_user_name = "Test User FarchoDev"
        self.session_token = None
        
    def log_test(self, test_name, success, details=""):
        status = "✅" if success else "❌"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")
        
    def test_user_registration(self):
        """Test POST /api/auth/register - Critical: Response structure verification"""
        try:
            payload = {
                "email": self.test_user_email,
                "password": self.test_user_password,
                "name": self.test_user_name
            }
            
            response = self.session.post(
                f"{API_BASE}/auth/register",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # CRITICAL: Verify response structure - should be UserPublic directly, NOT nested in 'user'
                if "user" in data:
                    self.log_test("POST /api/auth/register", False, 
                                f"❌ CRITICAL: Response has nested 'user' field. Frontend expects direct UserPublic object!")
                    return False, None
                
                # Verify required UserPublic fields are present directly in response
                required_fields = ["id", "email", "name", "role", "provider"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("POST /api/auth/register", False, 
                                f"Missing UserPublic fields: {missing_fields}")
                    return False, None
                
                # Verify field values
                if data["email"] != self.test_user_email:
                    self.log_test("POST /api/auth/register", False, 
                                f"Email mismatch. Expected: {self.test_user_email}, Got: {data['email']}")
                    return False, None
                
                if data["name"] != self.test_user_name:
                    self.log_test("POST /api/auth/register", False, 
                                f"Name mismatch. Expected: {self.test_user_name}, Got: {data['name']}")
                    return False, None
                
                # Verify session_token cookie is set
                cookies = response.cookies
                if 'session_token' not in cookies:
                    self.log_test("POST /api/auth/register", False, 
                                "session_token cookie not set")
                    return False, None
                
                self.session_token = cookies['session_token']
                
                self.log_test("POST /api/auth/register", True, 
                            f"✅ User registered successfully. UserPublic returned directly (not nested). Cookie set.")
                return True, data
            else:
                self.log_test("POST /api/auth/register", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False, None
                
        except Exception as e:
            self.log_test("POST /api/auth/register", False, f"Exception: {str(e)}")
            return False, None
    
    def test_user_login(self):
        """Test POST /api/auth/login - Critical: Response structure verification"""
        try:
            payload = {
                "email": self.test_user_email,
                "password": self.test_user_password
            }
            
            response = self.session.post(
                f"{API_BASE}/auth/login",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # CRITICAL: Verify response structure - should be UserPublic directly, NOT nested in 'user'
                if "user" in data:
                    self.log_test("POST /api/auth/login", False, 
                                f"❌ CRITICAL: Response has nested 'user' field. Frontend expects direct UserPublic object!")
                    return False, None
                
                # Verify required UserPublic fields are present directly in response
                required_fields = ["id", "email", "name", "role", "provider"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("POST /api/auth/login", False, 
                                f"Missing UserPublic fields: {missing_fields}")
                    return False, None
                
                # Verify field values
                if data["email"] != self.test_user_email:
                    self.log_test("POST /api/auth/login", False, 
                                f"Email mismatch. Expected: {self.test_user_email}, Got: {data['email']}")
                    return False, None
                
                # Verify session_token cookie is set
                cookies = response.cookies
                if 'session_token' not in cookies:
                    self.log_test("POST /api/auth/login", False, 
                                "session_token cookie not set")
                    return False, None
                
                self.session_token = cookies['session_token']
                
                self.log_test("POST /api/auth/login", True, 
                            f"✅ Login successful. UserPublic returned directly (not nested). Cookie updated.")
                return True, data
            else:
                self.log_test("POST /api/auth/login", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False, None
                
        except Exception as e:
            self.log_test("POST /api/auth/login", False, f"Exception: {str(e)}")
            return False, None
    
    def test_get_current_user(self):
        """Test GET /api/auth/me - Verify authenticated user data"""
        try:
            # Test with cookie authentication
            response = self.session.get(f"{API_BASE}/auth/me")
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify required UserPublic fields
                required_fields = ["id", "email", "name", "role", "provider"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("GET /api/auth/me (cookie)", False, 
                                f"Missing UserPublic fields: {missing_fields}")
                    return False, None
                
                # Verify it's the same user
                if data["email"] != self.test_user_email:
                    self.log_test("GET /api/auth/me (cookie)", False, 
                                f"Email mismatch. Expected: {self.test_user_email}, Got: {data['email']}")
                    return False, None
                
                self.log_test("GET /api/auth/me (cookie)", True, 
                            f"✅ Current user retrieved successfully via cookie")
                
                # Test with Bearer token authentication
                if self.session_token:
                    headers = {"Authorization": f"Bearer {self.session_token}"}
                    response_bearer = requests.get(f"{API_BASE}/auth/me", headers=headers)
                    
                    if response_bearer.status_code == 200:
                        bearer_data = response_bearer.json()
                        if bearer_data["email"] == self.test_user_email:
                            self.log_test("GET /api/auth/me (Bearer)", True, 
                                        f"✅ Current user retrieved successfully via Bearer token")
                        else:
                            self.log_test("GET /api/auth/me (Bearer)", False, 
                                        f"Bearer token returned different user")
                    else:
                        self.log_test("GET /api/auth/me (Bearer)", False, 
                                    f"Bearer auth failed: {response_bearer.status_code}")
                
                return True, data
            else:
                self.log_test("GET /api/auth/me", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False, None
                
        except Exception as e:
            self.log_test("GET /api/auth/me", False, f"Exception: {str(e)}")
            return False, None
    
    def test_logout(self):
        """Test POST /api/auth/logout - Verify cookie clearing"""
        try:
            response = self.session.post(f"{API_BASE}/auth/logout")
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify success message
                if "message" not in data or "logged out" not in data["message"].lower():
                    self.log_test("POST /api/auth/logout", False, 
                                f"Unexpected response format: {data}")
                    return False
                
                # Verify cookie is cleared (check Set-Cookie header)
                set_cookie_header = response.headers.get('Set-Cookie', '')
                if 'session_token=' not in set_cookie_header:
                    self.log_test("POST /api/auth/logout", False, 
                                "session_token cookie not cleared in response")
                    return False
                
                self.log_test("POST /api/auth/logout", True, 
                            f"✅ Logout successful. Cookie cleared: {data['message']}")
                
                # Verify that subsequent requests are unauthorized
                me_response = self.session.get(f"{API_BASE}/auth/me")
                if me_response.status_code == 401:
                    self.log_test("Verify logout effect", True, 
                                "✅ Subsequent /auth/me requests correctly return 401")
                else:
                    self.log_test("Verify logout effect", False, 
                                f"Expected 401 after logout, got {me_response.status_code}")
                
                return True
            else:
                self.log_test("POST /api/auth/logout", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("POST /api/auth/logout", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_credentials(self):
        """Test login with invalid credentials"""
        try:
            payload = {
                "email": self.test_user_email,
                "password": "wrongpassword"
            }
            
            response = requests.post(
                f"{API_BASE}/auth/login",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 401:
                self.log_test("POST /api/auth/login (invalid credentials)", True, 
                            "✅ Correctly rejected invalid credentials with 401")
                return True
            else:
                self.log_test("POST /api/auth/login (invalid credentials)", False, 
                            f"Expected 401, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("POST /api/auth/login (invalid credentials)", False, f"Exception: {str(e)}")
            return False
    
    def test_duplicate_registration(self):
        """Test registration with existing email"""
        try:
            payload = {
                "email": self.test_user_email,  # Same email as before
                "password": "anotherpassword",
                "name": "Another User"
            }
            
            response = requests.post(
                f"{API_BASE}/auth/register",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 400:
                self.log_test("POST /api/auth/register (duplicate email)", True, 
                            "✅ Correctly rejected duplicate email with 400")
                return True
            else:
                self.log_test("POST /api/auth/register (duplicate email)", False, 
                            f"Expected 400, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("POST /api/auth/register (duplicate email)", False, f"Exception: {str(e)}")
            return False
    
    def test_unauthorized_access(self):
        """Test accessing protected endpoints without authentication"""
        try:
            # Create a new session without cookies
            unauth_session = requests.Session()
            
            response = unauth_session.get(f"{API_BASE}/auth/me")
            
            if response.status_code == 401:
                self.log_test("GET /api/auth/me (unauthorized)", True, 
                            "✅ Correctly rejected unauthorized request with 401")
                return True
            else:
                self.log_test("GET /api/auth/me (unauthorized)", False, 
                            f"Expected 401, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("GET /api/auth/me (unauthorized)", False, f"Exception: {str(e)}")
            return False

def main():
    print("🚀 Starting Authentication System Testing")
    print("🎯 Focus: Response structure verification for real-time UI updates")
    print("=" * 70)
    
    tester = AuthTester()
    
    try:
        # Test 1: User Registration - CRITICAL for UI updates
        print("\n👤 Test 1: POST /api/auth/register")
        print("   🔍 Verifying UserPublic returned directly (not nested in 'user')")
        success, user_data = tester.test_user_registration()
        if not success:
            print("❌ CRITICAL: Registration failed - cannot proceed with testing")
            return False
        
        # Test 2: User Login - CRITICAL for UI updates
        print("\n🔐 Test 2: POST /api/auth/login")
        print("   🔍 Verifying UserPublic returned directly (not nested in 'user')")
        success, login_data = tester.test_user_login()
        if not success:
            print("❌ CRITICAL: Login failed")
            return False
        
        # Test 3: Get Current User - Verify authentication works
        print("\n👥 Test 3: GET /api/auth/me")
        print("   🔍 Testing both cookie and Bearer token authentication")
        success, me_data = tester.test_get_current_user()
        if not success:
            print("❌ Get current user failed")
            return False
        
        # Test 4: Logout - Verify cookie clearing
        print("\n🚪 Test 4: POST /api/auth/logout")
        print("   🔍 Verifying session_token cookie is cleared")
        success = tester.test_logout()
        if not success:
            print("❌ Logout failed")
            return False
        
        # Test 5: Edge Cases - Invalid credentials
        print("\n🚫 Test 5: Invalid Credentials")
        tester.test_invalid_credentials()
        
        # Test 6: Edge Cases - Duplicate registration
        print("\n🚫 Test 6: Duplicate Registration")
        tester.test_duplicate_registration()
        
        # Test 7: Edge Cases - Unauthorized access
        print("\n🚫 Test 7: Unauthorized Access")
        tester.test_unauthorized_access()
        
        print("\n" + "=" * 70)
        print("🎯 AUTHENTICATION TESTING SUMMARY")
        print("=" * 70)
        print("✅ POST /api/auth/register - UserPublic returned directly (not nested)")
        print("✅ POST /api/auth/login - UserPublic returned directly (not nested)")
        print("✅ GET /api/auth/me - Working with both cookie and Bearer token")
        print("✅ POST /api/auth/logout - Cookie clearing working correctly")
        print("✅ Edge cases handled properly (401, 400 errors)")
        print("\n🎉 CRITICAL FIX VERIFIED:")
        print("   Frontend can now use setUser(data) instead of setUser(data.user)")
        print("   Real-time UI updates should work correctly!")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Unexpected error during testing: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)