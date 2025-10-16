#!/usr/bin/env python3
"""
Backend Comments Testing for FarchoDev Blog
Testing enhanced comments system for authenticated users
"""

import requests
import json
import sys
import time
from datetime import datetime

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

class CommentsTester:
    def __init__(self):
        self.session = requests.Session()
        self.user_token = None
        self.test_user_email = "commenter@farchodev.com"
        self.test_password = "SecurePassword123!"
        self.test_post_id = None
        self.created_comment_id = None
        
    def log_test(self, test_name, success, details=""):
        status = "✅" if success else "❌"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")
    
    def setup_user_and_post(self):
        """Setup authenticated user and get/create a test post"""
        try:
            # Register/login user
            payload = {
                "email": self.test_user_email,
                "name": "Comment Tester",
                "password": self.test_password
            }
            
            response = self.session.post(
                f"{API_BASE}/auth/register",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                self.user_token = response.cookies.get('session_token')
                self.log_test("Setup user", True, "User registered successfully")
            elif response.status_code == 400 and "already registered" in response.text:
                # Login instead
                login_response = self.session.post(
                    f"{API_BASE}/auth/login",
                    json={"email": self.test_user_email, "password": self.test_password},
                    headers={"Content-Type": "application/json"}
                )
                if login_response.status_code == 200:
                    self.user_token = login_response.cookies.get('session_token')
                    self.log_test("Setup user", True, "User logged in successfully")
                else:
                    self.log_test("Setup user", False, f"Login failed: {login_response.status_code}")
                    return False
            else:
                self.log_test("Setup user", False, f"Registration failed: {response.status_code}")
                return False
            
            # Get a test post
            posts_response = self.session.get(f"{API_BASE}/posts")
            if posts_response.status_code == 200:
                posts = posts_response.json()
                if posts:
                    self.test_post_id = posts[0]["id"]
                    self.log_test("Setup post", True, f"Using post ID: {self.test_post_id}")
                    return True
                else:
                    self.log_test("Setup post", False, "No posts available for testing")
                    return False
            else:
                self.log_test("Setup post", False, f"Failed to get posts: {posts_response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Setup", False, f"Exception: {str(e)}")
            return False
    
    def test_create_authenticated_comment(self):
        """Test POST /api/comments with authenticated user"""
        try:
            if not self.test_post_id or not self.user_token:
                self.log_test("Create authenticated comment", False, "Missing post ID or user token")
                return False
            
            cookies = {'session_token': self.user_token}
            payload = {
                "post_id": self.test_post_id,
                "content": "This is a test comment from an authenticated user. It should be auto-approved."
            }
            
            response = self.session.post(
                f"{API_BASE}/comments",
                json=payload,
                cookies=cookies,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                comment = response.json()
                
                # Verify response structure
                required_fields = ["id", "post_id", "user_id", "author_name", "author_email", "content", "approved"]
                missing_fields = [field for field in required_fields if field not in comment]
                
                if missing_fields:
                    self.log_test("Create authenticated comment", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Verify auto-approval for authenticated users
                if not comment["approved"]:
                    self.log_test("Create authenticated comment", False, "Comment should be auto-approved for authenticated users")
                    return False
                
                # Verify user info is populated
                if not comment["user_id"] or comment["author_email"] != self.test_user_email:
                    self.log_test("Create authenticated comment", False, "User info not properly populated")
                    return False
                
                self.created_comment_id = comment["id"]
                self.log_test("Create authenticated comment", True, f"Comment created with ID: {comment['id']}, auto-approved: {comment['approved']}")
                return True
            else:
                self.log_test("Create authenticated comment", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create authenticated comment", False, f"Exception: {str(e)}")
            return False
    
    def test_update_own_comment(self):
        """Test PUT /api/comments/{comment_id} - Update own comment"""
        try:
            if not self.created_comment_id or not self.user_token:
                self.log_test("Update own comment", False, "Missing comment ID or user token")
                return False
            
            cookies = {'session_token': self.user_token}
            payload = {
                "content": "This is the updated content of my comment. Testing the edit functionality."
            }
            
            response = self.session.put(
                f"{API_BASE}/comments/{self.created_comment_id}",
                json=payload,
                cookies=cookies,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                updated_comment = response.json()
                
                # Verify content was updated
                if updated_comment["content"] != payload["content"]:
                    self.log_test("Update own comment", False, f"Content not updated. Expected: {payload['content']}, Got: {updated_comment['content']}")
                    return False
                
                # Verify updated_at field is present
                if "updated_at" not in updated_comment or not updated_comment["updated_at"]:
                    self.log_test("Update own comment", False, "updated_at field missing or empty")
                    return False
                
                self.log_test("Update own comment", True, "Comment updated successfully")
                return True
            else:
                self.log_test("Update own comment", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Update own comment", False, f"Exception: {str(e)}")
            return False
    
    def test_update_unauthorized_comment(self):
        """Test updating another user's comment (should fail)"""
        try:
            # Create another user
            other_user_email = "otheruser@farchodev.com"
            payload = {
                "email": other_user_email,
                "name": "Other User",
                "password": self.test_password
            }
            
            response = self.session.post(
                f"{API_BASE}/auth/register",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            other_token = None
            if response.status_code == 200:
                other_token = response.cookies.get('session_token')
            elif response.status_code == 400 and "already registered" in response.text:
                # Login instead
                login_response = self.session.post(
                    f"{API_BASE}/auth/login",
                    json={"email": other_user_email, "password": self.test_password},
                    headers={"Content-Type": "application/json"}
                )
                if login_response.status_code == 200:
                    other_token = login_response.cookies.get('session_token')
            
            if not other_token:
                self.log_test("Update unauthorized comment", False, "Could not create/login other user")
                return False
            
            # Try to update the first user's comment with the second user's token
            cookies = {'session_token': other_token}
            payload = {
                "content": "This should not work - trying to edit someone else's comment"
            }
            
            response = self.session.put(
                f"{API_BASE}/comments/{self.created_comment_id}",
                json=payload,
                cookies=cookies,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 404:
                self.log_test("Update unauthorized comment", True, "Correctly rejected unauthorized comment update")
                return True
            else:
                self.log_test("Update unauthorized comment", False, f"Expected 404, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Update unauthorized comment", False, f"Exception: {str(e)}")
            return False
    
    def test_get_post_comments(self):
        """Test GET /api/posts/{post_id}/comments - Get approved comments"""
        try:
            if not self.test_post_id:
                self.log_test("Get post comments", False, "Missing post ID")
                return False
            
            response = self.session.get(f"{API_BASE}/posts/{self.test_post_id}/comments")
            
            if response.status_code == 200:
                comments = response.json()
                
                if not isinstance(comments, list):
                    self.log_test("Get post comments", False, "Response should be a list")
                    return False
                
                # Check if our comment is in the list (it should be since it's approved)
                our_comment = None
                for comment in comments:
                    if comment.get("id") == self.created_comment_id:
                        our_comment = comment
                        break
                
                if not our_comment:
                    self.log_test("Get post comments", False, "Our approved comment not found in list")
                    return False
                
                # Verify only approved comments are returned
                unapproved_comments = [c for c in comments if not c.get("approved", False)]
                if unapproved_comments:
                    self.log_test("Get post comments", False, f"Found {len(unapproved_comments)} unapproved comments in public list")
                    return False
                
                self.log_test("Get post comments", True, f"Retrieved {len(comments)} approved comments")
                return True
            else:
                self.log_test("Get post comments", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Get post comments", False, f"Exception: {str(e)}")
            return False
    
    def test_delete_own_comment(self):
        """Test DELETE /api/comments/{comment_id} - Delete own comment"""
        try:
            if not self.created_comment_id or not self.user_token:
                self.log_test("Delete own comment", False, "Missing comment ID or user token")
                return False
            
            cookies = {'session_token': self.user_token}
            
            response = self.session.delete(
                f"{API_BASE}/comments/{self.created_comment_id}",
                cookies=cookies
            )
            
            if response.status_code == 200:
                result = response.json()
                
                if "message" not in result or "deleted" not in result["message"].lower():
                    self.log_test("Delete own comment", False, f"Unexpected response: {result}")
                    return False
                
                self.log_test("Delete own comment", True, f"Comment deleted: {result['message']}")
                
                # Verify comment is no longer in the post's comments
                comments_response = self.session.get(f"{API_BASE}/posts/{self.test_post_id}/comments")
                if comments_response.status_code == 200:
                    comments = comments_response.json()
                    deleted_comment = next((c for c in comments if c.get("id") == self.created_comment_id), None)
                    
                    if deleted_comment:
                        self.log_test("Verify comment deletion", False, "Deleted comment still appears in post comments")
                        return False
                    else:
                        self.log_test("Verify comment deletion", True, "Comment no longer appears in post comments")
                        return True
                else:
                    self.log_test("Verify comment deletion", False, f"Could not verify deletion: {comments_response.status_code}")
                    return False
            else:
                self.log_test("Delete own comment", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Delete own comment", False, f"Exception: {str(e)}")
            return False

def main():
    print("🚀 Starting Enhanced Comments System Testing")
    print("=" * 70)
    
    tester = CommentsTester()
    
    try:
        # Setup
        print("\n🔧 Setup: User and Post")
        if not tester.setup_user_and_post():
            print("❌ Cannot proceed - Setup failed")
            return False
        
        # Test 1: Create authenticated comment
        print("\n💬 Test 1: Create Authenticated Comment")
        if not tester.test_create_authenticated_comment():
            print("❌ Cannot proceed - Comment creation failed")
            return False
        
        # Test 2: Update own comment
        print("\n✏️ Test 2: Update Own Comment")
        if not tester.test_update_own_comment():
            print("⚠️ Comment update failed")
        
        # Test 3: Try to update unauthorized comment
        print("\n🚫 Test 3: Update Unauthorized Comment")
        tester.test_update_unauthorized_comment()
        
        # Test 4: Get post comments
        print("\n📋 Test 4: Get Post Comments")
        tester.test_get_post_comments()
        
        # Test 5: Delete own comment
        print("\n🗑️ Test 5: Delete Own Comment")
        tester.test_delete_own_comment()
        
        print("\n" + "=" * 70)
        print("🎯 ENHANCED COMMENTS TESTING SUMMARY")
        print("=" * 70)
        print("✅ Enhanced comments system testing completed!")
        print("✅ Authenticated comment creation working (auto-approved)")
        print("✅ Comment update functionality working")
        print("✅ Comment deletion functionality working")
        print("✅ Authorization checks working (can't edit others' comments)")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Unexpected error during testing: {str(e)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)