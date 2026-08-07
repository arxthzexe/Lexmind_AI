from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from shared.config import settings

engine = create_async_engine(
    settings.database_url,
    echo=settings.app_debug,
    pool_pre_ping=True,
    connect_args={"timeout": 2},
)
session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with session_factory() as session:
        yield session


async def init_db() -> None:
    from shared.models.base import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
