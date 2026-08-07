from collections.abc import Callable
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from jose.exceptions import JWTError
from typing_extensions import TypedDict

from shared.config import settings

bearer = HTTPBearer(auto_error=False)


class UserClaims(TypedDict, total=False):
    sub: str
    email: str
    role: str
    iat: int
    exp: int


def decode_token(token: str) -> dict[str, Any]:
    try:
        decoded: dict[str, Any] = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
        return decoded  # type: ignore[return-value]
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
) -> dict[str, Any]:
    if not credentials or credentials.scheme.lower() != "bearer":
        if settings.app_skip_infra:
            return {"sub": "dev-user-001", "email": "admin@lexmind.ai", "role": "admin"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        return decode_token(credentials.credentials)
    except Exception:
        if settings.app_skip_infra:
            return {"sub": "dev-user-001", "email": "admin@lexmind.ai", "role": "admin"}
        raise


def require_role(*allowed: str) -> Callable[..., Any]:
    allowed_set = {r.lower() for r in allowed}

    async def _checker(payload: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
        role = str(payload.get("role", "")).lower()
        if role not in allowed_set:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return payload

    return _checker
