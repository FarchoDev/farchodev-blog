#!/usr/bin/env python3
"""
Script para promover usuarios a admin
Usage: python promote_admin.py <email>
"""
import sys
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

async def promote_to_admin(email: str):
    """Promote a user to admin role"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Find user
    user = await db.users.find_one({"email": email.lower().strip()})
    
    if not user:
        print(f"❌ Usuario no encontrado: {email}")
        return False
    
    # Update role to admin
    result = await db.users.update_one(
        {"email": email.lower().strip()},
        {"$set": {"role": "admin"}}
    )
    
    if result.modified_count > 0:
        print(f"✅ Usuario {email} promovido a admin exitosamente!")
        print(f"   Nombre: {user.get('name')}")
        print(f"   Provider: {user.get('provider')}")
        return True
    else:
        print(f"ℹ️  Usuario {email} ya era admin")
        return True
    
    await client.close()

async def list_users():
    """List all users"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    users = await db.users.find({}, {"_id": 0, "email": 1, "name": 1, "role": 1, "provider": 1}).to_list(100)
    
    if not users:
        print("❌ No hay usuarios en la base de datos")
        client.close()
        return
    
    print("\n📋 USUARIOS REGISTRADOS:")
    print("-" * 80)
    for user in users:
        role_icon = "👑" if user.get("role") == "admin" else "👤"
        print(f"{role_icon} {user.get('name'):30} | {user.get('email'):35} | {user.get('role'):5} | {user.get('provider')}")
    print("-" * 80)
    
    client.close()

async def main():
    if len(sys.argv) < 2:
        print("📖 USO:")
        print("  python promote_admin.py <email>          - Promover usuario a admin")
        print("  python promote_admin.py --list           - Listar todos los usuarios")
        print("")
        print("📝 EJEMPLOS:")
        print("  python promote_admin.py admin@example.com")
        print("  python promote_admin.py --list")
        return
    
    if sys.argv[1] == "--list":
        await list_users()
    else:
        email = sys.argv[1]
        await promote_to_admin(email)

if __name__ == "__main__":
    asyncio.run(main())
