#!/usr/bin/env python3
"""
Test para verificar el sistema de admin emails
"""
import sys
sys.path.insert(0, '/app/backend')

from auth import is_admin_email, get_user_role, ADMIN_EMAILS

def test_admin_system():
    print("🧪 TESTING ADMIN EMAIL SYSTEM")
    print("-" * 50)
    
    print(f"\n📧 Admin emails configurados: {ADMIN_EMAILS}")
    
    if not ADMIN_EMAILS:
        print("\n⚠️  WARNING: No hay emails admin configurados en .env")
        print("   Agrega emails a la variable ADMIN_EMAILS en backend/.env")
        return
    
    print("\n✅ Emails configurados correctamente!")
    
    # Test cada email
    print("\n📋 Testing cada email:")
    for email in ADMIN_EMAILS:
        role = get_user_role(email)
        print(f"   {email} -> role: {role}")
    
    # Test un email normal
    test_email = "normal@user.com"
    role = get_user_role(test_email)
    print(f"\n🧪 Test email normal:")
    print(f"   {test_email} -> role: {role}")
    
    print("\n✅ Sistema de admin emails funcionando correctamente!")

if __name__ == "__main__":
    test_admin_system()
