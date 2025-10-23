"""
Script para ver estadísticas de la base de datos
Ejecutar: python db_stats.py
"""
import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

async def show_db_stats():
    """Show database statistics"""
    print("=" * 60)
    print(f"📊 ESTADÍSTICAS DE BASE DE DATOS: {db_name}")
    print("=" * 60)
    print()
    
    # Users
    users_count = await db.users.count_documents({})
    admin_count = await db.users.count_documents({"role": "admin"})
    print(f"👥 Usuarios:")
    print(f"   Total: {users_count}")
    print(f"   Admins: {admin_count}")
    print(f"   Usuarios normales: {users_count - admin_count}")
    
    # List admins
    if admin_count > 0:
        print(f"\n   Administradores:")
        async for user in db.users.find({"role": "admin"}, {"email": 1, "name": 1, "_id": 0}):
            print(f"      - {user['name']} ({user['email']})")
    print()
    
    # Posts
    posts_count = await db.posts.count_documents({})
    published_count = await db.posts.count_documents({"published": True})
    draft_count = posts_count - published_count
    print(f"📝 Posts:")
    print(f"   Total: {posts_count}")
    print(f"   Publicados: {published_count}")
    print(f"   Borradores: {draft_count}")
    print()
    
    # Categories
    categories_count = await db.categories.count_documents({})
    print(f"🏷️  Categorías: {categories_count}")
    if categories_count > 0:
        print(f"   Lista:")
        async for cat in db.categories.find({}, {"name": 1, "slug": 1, "_id": 0}):
            print(f"      - {cat['name']} ({cat['slug']})")
    print()
    
    # Comments
    comments_count = await db.comments.count_documents({})
    approved_comments = await db.comments.count_documents({"approved": True})
    pending_comments = comments_count - approved_comments
    print(f"💬 Comentarios:")
    print(f"   Total: {comments_count}")
    print(f"   Aprobados: {approved_comments}")
    print(f"   Pendientes: {pending_comments}")
    print()
    
    # Newsletter
    newsletter_count = await db.newsletter.count_documents({})
    active_subs = await db.newsletter.count_documents({"active": True})
    print(f"📧 Newsletter:")
    print(f"   Suscriptores: {newsletter_count}")
    print(f"   Activos: {active_subs}")
    print()
    
    # Likes
    likes_count = await db.post_likes.count_documents({})
    print(f"❤️  Likes: {likes_count}")
    print()
    
    # Bookmarks
    bookmarks_count = await db.bookmarks.count_documents({})
    print(f"🔖 Bookmarks: {bookmarks_count}")
    print()
    
    # User Profiles
    profiles_count = await db.user_profiles.count_documents({})
    print(f"👤 Perfiles de usuario: {profiles_count}")
    print()
    
    # Sessions
    sessions_count = await db.sessions.count_documents({})
    print(f"🔐 Sesiones activas: {sessions_count}")
    print()
    
    print("=" * 60)
    print("✅ Para ver más detalles, usa MongoDB Compass o mongosh")
    print("=" * 60)

async def show_recent_activity():
    """Show recent activity"""
    print("\n" + "=" * 60)
    print("📈 ACTIVIDAD RECIENTE")
    print("=" * 60)
    print()
    
    # Recent users
    print("👥 Últimos 5 usuarios registrados:")
    async for user in db.users.find({}, {"email": 1, "name": 1, "created_at": 1, "_id": 0}).sort("created_at", -1).limit(5):
        created = user.get('created_at', 'N/A')
        if isinstance(created, datetime):
            created = created.strftime("%Y-%m-%d %H:%M")
        print(f"   - {user['name']} ({user['email']}) - {created}")
    print()
    
    # Recent posts
    print("📝 Últimos 5 posts creados:")
    async for post in db.posts.find({}, {"title": 1, "published": 1, "created_at": 1, "_id": 0}).sort("created_at", -1).limit(5):
        status = "✅ Publicado" if post.get('published') else "📝 Borrador"
        created = post.get('created_at', 'N/A')
        if isinstance(created, datetime):
            created = created.strftime("%Y-%m-%d %H:%M")
        print(f"   - {post['title'][:50]}... - {status} - {created}")
    print()
    
    # Recent comments
    print("💬 Últimos 5 comentarios:")
    async for comment in db.comments.find({}, {"author_name": 1, "content": 1, "approved": 1, "created_at": 1, "_id": 0}).sort("created_at", -1).limit(5):
        status = "✅ Aprobado" if comment.get('approved') else "⏳ Pendiente"
        content = comment.get('content', '')[:40]
        created = comment.get('created_at', 'N/A')
        if isinstance(created, datetime):
            created = created.strftime("%Y-%m-%d %H:%M")
        print(f"   - {comment['author_name']}: \"{content}...\" - {status} - {created}")
    print()
    
    print("=" * 60)
    
    # Close connection after all operations
    client.close()

async def main():
    """Main function"""
    await show_db_stats()
    await show_recent_activity()

if __name__ == "__main__":
    print("\n🔍 Analizando base de datos...\n")
    asyncio.run(main())
