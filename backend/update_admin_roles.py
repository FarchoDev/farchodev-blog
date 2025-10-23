"""
Script to update admin roles based on ADMIN_EMAILS in .env
Run this script whenever you add new emails to ADMIN_EMAILS
"""
import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Get admin emails from .env
ADMIN_EMAILS_STR = os.environ.get('ADMIN_EMAILS', '')
ADMIN_EMAILS = [email.strip().lower() for email in ADMIN_EMAILS_STR.split(',') if email.strip()]

async def update_admin_roles():
    """Update user roles based on ADMIN_EMAILS"""
    print(f"📧 Admin emails configured: {ADMIN_EMAILS}")
    print(f"\n🔄 Updating admin roles...\n")
    
    # Update users who should be admin
    for email in ADMIN_EMAILS:
        result = await db.users.update_one(
            {"email": email},
            {"$set": {"role": "admin"}}
        )
        if result.matched_count > 0:
            print(f"✅ Updated {email} to admin role")
        else:
            print(f"⚠️  User {email} not found in database")
    
    # Optionally: Demote users who are admin but not in ADMIN_EMAILS
    # (uncomment if you want this behavior)
    # result = await db.users.update_many(
    #     {"email": {"$nin": ADMIN_EMAILS}, "role": "admin"},
    #     {"$set": {"role": "user"}}
    # )
    # if result.modified_count > 0:
    #     print(f"\n⬇️  Demoted {result.modified_count} user(s) from admin to user")
    
    print(f"\n✨ Done! Users need to log out and log back in for changes to take effect.")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    asyncio.run(update_admin_roles())
