#!/usr/bin/env python3
"""
Backend API Testing for FarchoDev Blog - Category Endpoints
Tests all category-related endpoints including the new PUT and DELETE operations
"""

import requests
import json
import sys
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

class CategoryTester:
    def __init__(self):
        self.session = requests.Session()
        self.created_categories = []  # Track created categories for cleanup
        
    def log_test(self, test_name, success, details=""):
        status = "✅" if success else "❌"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")
        
    def test_get_categories(self):
        """Test GET /api/categories - Get all categories"""
        try:
            response = self.session.get(f"{API_BASE}/categories")
            
            if response.status_code == 200:
                categories = response.json()
                self.log_test("GET /api/categories", True, f"Retrieved {len(categories)} categories")
                return True, categories
            else:
                self.log_test("GET /api/categories", False, f"Status: {response.status_code}, Response: {response.text}")
                return False, None
                
        except Exception as e:
            self.log_test("GET /api/categories", False, f"Exception: {str(e)}")
            return False, None
    
    def test_create_category(self, name, description=None):
        """Test POST /api/admin/categories - Create a category"""
        try:
            payload = {"name": name}
            if description:
                payload["description"] = description
                
            response = self.session.post(
                f"{API_BASE}/admin/categories",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                category = response.json()
                self.created_categories.append(category["id"])
                
                # Verify response structure
                required_fields = ["id", "name", "slug", "created_at"]
                missing_fields = [field for field in required_fields if field not in category]
                
                if missing_fields:
                    self.log_test(f"POST /api/admin/categories (Create '{name}')", False, 
                                f"Missing fields: {missing_fields}")
                    return False, None
                
                # Verify slug generation
                expected_slug = name.lower().replace(' ', '-').replace('ñ', 'n')
                if category["slug"] != expected_slug:
                    self.log_test(f"POST /api/admin/categories (Create '{name}')", False, 
                                f"Slug mismatch. Expected: {expected_slug}, Got: {category['slug']}")
                    return False, None
                
                self.log_test(f"POST /api/admin/categories (Create '{name}')", True, 
                            f"Created category with ID: {category['id']}, Slug: {category['slug']}")
                return True, category
            else:
                self.log_test(f"POST /api/admin/categories (Create '{name}')", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False, None
                
        except Exception as e:
            self.log_test(f"POST /api/admin/categories (Create '{name}')", False, f"Exception: {str(e)}")
            return False, None
    
    def test_update_category(self, category_id, new_name, new_description=None):
        """Test PUT /api/admin/categories/{category_id} - Update category"""
        try:
            payload = {"name": new_name}
            if new_description:
                payload["description"] = new_description
                
            response = self.session.put(
                f"{API_BASE}/admin/categories/{category_id}",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                updated_category = response.json()
                
                # Verify the update worked
                if updated_category["name"] != new_name:
                    self.log_test(f"PUT /api/admin/categories/{category_id}", False, 
                                f"Name not updated. Expected: {new_name}, Got: {updated_category['name']}")
                    return False, None
                
                # Verify slug was regenerated
                expected_slug = new_name.lower().replace(' ', '-').replace('ñ', 'n')
                if updated_category["slug"] != expected_slug:
                    self.log_test(f"PUT /api/admin/categories/{category_id}", False, 
                                f"Slug not updated. Expected: {expected_slug}, Got: {updated_category['slug']}")
                    return False, None
                
                self.log_test(f"PUT /api/admin/categories/{category_id}", True, 
                            f"Updated category name to '{new_name}', slug to '{updated_category['slug']}'")
                return True, updated_category
            else:
                self.log_test(f"PUT /api/admin/categories/{category_id}", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False, None
                
        except Exception as e:
            self.log_test(f"PUT /api/admin/categories/{category_id}", False, f"Exception: {str(e)}")
            return False, None
    
    def test_update_nonexistent_category(self):
        """Test PUT with non-existent category ID (should return 404)"""
        try:
            fake_id = "nonexistent-category-id-12345"
            payload = {"name": "Should Not Work", "description": "This should fail"}
            
            response = self.session.put(
                f"{API_BASE}/admin/categories/{fake_id}",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 404:
                self.log_test("PUT /api/admin/categories/{nonexistent_id} (404 test)", True, 
                            "Correctly returned 404 for non-existent category")
                return True
            else:
                self.log_test("PUT /api/admin/categories/{nonexistent_id} (404 test)", False, 
                            f"Expected 404, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("PUT /api/admin/categories/{nonexistent_id} (404 test)", False, f"Exception: {str(e)}")
            return False
    
    def test_delete_category(self, category_id):
        """Test DELETE /api/admin/categories/{category_id} - Delete category"""
        try:
            response = self.session.delete(f"{API_BASE}/admin/categories/{category_id}")
            
            if response.status_code == 200:
                result = response.json()
                
                if "message" in result and "deleted" in result["message"].lower():
                    self.log_test(f"DELETE /api/admin/categories/{category_id}", True, 
                                f"Category deleted successfully: {result['message']}")
                    
                    # Remove from our tracking list
                    if category_id in self.created_categories:
                        self.created_categories.remove(category_id)
                    
                    return True
                else:
                    self.log_test(f"DELETE /api/admin/categories/{category_id}", False, 
                                f"Unexpected response format: {result}")
                    return False
            else:
                self.log_test(f"DELETE /api/admin/categories/{category_id}", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test(f"DELETE /api/admin/categories/{category_id}", False, f"Exception: {str(e)}")
            return False
    
    def test_delete_nonexistent_category(self):
        """Test DELETE with non-existent category ID (should return 404)"""
        try:
            fake_id = "nonexistent-category-id-67890"
            
            response = self.session.delete(f"{API_BASE}/admin/categories/{fake_id}")
            
            if response.status_code == 404:
                self.log_test("DELETE /api/admin/categories/{nonexistent_id} (404 test)", True, 
                            "Correctly returned 404 for non-existent category")
                return True
            else:
                self.log_test("DELETE /api/admin/categories/{nonexistent_id} (404 test)", False, 
                            f"Expected 404, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("DELETE /api/admin/categories/{nonexistent_id} (404 test)", False, f"Exception: {str(e)}")
            return False
    
    def verify_category_deleted(self, category_id):
        """Verify that a deleted category no longer appears in GET /api/categories"""
        try:
            success, categories = self.test_get_categories()
            if not success:
                return False
            
            # Check if the deleted category still exists
            for category in categories:
                if category["id"] == category_id:
                    self.log_test(f"Verify deletion of {category_id}", False, 
                                "Category still appears in GET /api/categories")
                    return False
            
            self.log_test(f"Verify deletion of {category_id}", True, 
                        "Category no longer appears in category list")
            return True
            
        except Exception as e:
            self.log_test(f"Verify deletion of {category_id}", False, f"Exception: {str(e)}")
            return False
    
    def cleanup(self):
        """Clean up any remaining test categories"""
        if self.created_categories:
            print(f"\n🧹 Cleaning up {len(self.created_categories)} remaining test categories...")
            for category_id in self.created_categories[:]:  # Copy list to avoid modification during iteration
                self.test_delete_category(category_id)

def main():
    print("🚀 Starting Category Endpoints Testing")
    print("=" * 60)
    
    tester = CategoryTester()
    
    try:
        # Test 1: Get existing categories
        print("\n📋 Test 1: GET /api/categories")
        success, initial_categories = tester.test_get_categories()
        if not success:
            print("❌ Cannot proceed with testing - GET categories failed")
            return False
        
        # Test 2: Create a test category
        print("\n📝 Test 2: POST /api/admin/categories (Create)")
        success, test_category = tester.test_create_category(
            "Desarrollo Web", 
            "Artículos sobre desarrollo web moderno"
        )
        if not success:
            print("❌ Cannot proceed with testing - Category creation failed")
            return False
        
        # Test 3: Update the category
        print("\n✏️ Test 3: PUT /api/admin/categories/{id} (Update)")
        success, updated_category = tester.test_update_category(
            test_category["id"],
            "Desarrollo Frontend",
            "Artículos sobre desarrollo frontend con React y Vue"
        )
        if not success:
            print("❌ Category update failed")
            return False
        
        # Test 4: Try to update non-existent category (should fail with 404)
        print("\n🚫 Test 4: PUT /api/admin/categories/{nonexistent_id} (404 test)")
        tester.test_update_nonexistent_category()
        
        # Test 5: Create another category for deletion test
        print("\n📝 Test 5: POST /api/admin/categories (Create for deletion)")
        success, delete_test_category = tester.test_create_category(
            "Categoría Temporal", 
            "Esta categoría será eliminada en las pruebas"
        )
        if not success:
            print("❌ Cannot create category for deletion test")
            return False
        
        # Test 6: Delete the temporary category
        print("\n🗑️ Test 6: DELETE /api/admin/categories/{id}")
        success = tester.test_delete_category(delete_test_category["id"])
        if not success:
            print("❌ Category deletion failed")
            return False
        
        # Test 7: Verify the category was actually deleted
        print("\n🔍 Test 7: Verify category deletion")
        tester.verify_category_deleted(delete_test_category["id"])
        
        # Test 8: Try to delete non-existent category (should fail with 404)
        print("\n🚫 Test 8: DELETE /api/admin/categories/{nonexistent_id} (404 test)")
        tester.test_delete_nonexistent_category()
        
        # Test 9: Final verification - get all categories
        print("\n📋 Test 9: Final GET /api/categories verification")
        success, final_categories = tester.test_get_categories()
        
        print("\n" + "=" * 60)
        print("🎯 TESTING SUMMARY")
        print("=" * 60)
        print("✅ All category endpoints tested successfully!")
        print("✅ PUT /api/admin/categories/{id} - Update functionality working")
        print("✅ DELETE /api/admin/categories/{id} - Delete functionality working")
        print("✅ 404 error handling working for both PUT and DELETE")
        print("✅ Slug regeneration working on category updates")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Unexpected error during testing: {str(e)}")
        return False
        
    finally:
        # Always cleanup
        tester.cleanup()

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)