from fastapi import FastAPI
from app.apis import router
from app.config.db import engine, Base
from sqlalchemy import text
import pathlib

app = FastAPI(title="Event Manager")
app.include_router(router)

# Path to seeds folder
SEED_DIR = pathlib.Path(__file__).resolve().parent.parent / "seeds"

async def seed_db(conn):
    # Seed order: events first, then attendees (because of FK)
    for table, file in [("attendees", "attendees.sql"), ("events", "events.sql")][::-1]:
        sql_file = SEED_DIR / file
        if sql_file.exists():
            print(f"🧹 Clearing {table} table...")
            await conn.execute(text(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE"))

    # Now insert fresh data
    for table, file in [("events", "events.sql"), ("attendees", "attendees.sql")]:
        sql_file = SEED_DIR / file
        if sql_file.exists():
            print(f"🌱 Seeding {table} from {file}")
            with open(sql_file, "r") as f:
                sql_content = f.read()

            # Split into individual statements
            statements = [stmt.strip() for stmt in sql_content.split(";") if stmt.strip()]
            for stmt in statements:
                await conn.execute(text(stmt))
    await conn.execute(text("SELECT setval('events_id_seq', (SELECT COALESCE(MAX(id), 1) FROM events) + 1, false)"))
    await conn.execute(text("SELECT setval('attendees_id_seq', (SELECT COALESCE(MAX(id), 1) FROM attendees) + 1, false)"))
    await conn.commit()
    print("✅ Database reseeded.")
    

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        # Create tables
        await conn.run_sync(Base.metadata.create_all)
        # Always reseed
        await seed_db(conn)