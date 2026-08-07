from __future__ import annotations

import aioboto3
from botocore.exceptions import ClientError

from shared.config import settings


async def upload_bytes(
    data: bytes,
    key: str,
    *,
    bucket: str | None = None,
    content_type: str = "application/octet-stream",
) -> str:
    bucket = bucket or settings.minio_bucket
    session = aioboto3.Session(
        aws_access_key_id=settings.minio_root_user,
        aws_secret_access_key=settings.minio_root_password,
        region_name="us-east-1",
    )
    async with session.client("s3", endpoint_url=settings.minio_endpoint) as client:
        await client.put_object(Bucket=bucket, Key=key, Body=data, ContentType=content_type)
    return key


async def download_bytes(key: str, *, bucket: str | None = None) -> bytes:
    bucket = bucket or settings.minio_bucket
    session = aioboto3.Session(
        aws_access_key_id=settings.minio_root_user,
        aws_secret_access_key=settings.minio_root_password,
        region_name="us-east-1",
    )
    async with session.client("s3", endpoint_url=settings.minio_endpoint) as client:
        response = await client.get_object(Bucket=bucket, Key=key)
        body = await response["Body"].read()
        return bytes(body)


async def delete_object(key: str, *, bucket: str | None = None) -> None:
    bucket = bucket or settings.minio_bucket
    session = aioboto3.Session(
        aws_access_key_id=settings.minio_root_user,
        aws_secret_access_key=settings.minio_root_password,
        region_name="us-east-1",
    )
    async with session.client("s3", endpoint_url=settings.minio_endpoint) as client:
        try:
            await client.delete_object(Bucket=bucket, Key=key)
        except ClientError:
            return


async def ensure_bucket(*, bucket: str | None = None) -> None:
    bucket = bucket or settings.minio_bucket
    session = aioboto3.Session(
        aws_access_key_id=settings.minio_root_user,
        aws_secret_access_key=settings.minio_root_password,
        region_name="us-east-1",
    )
    async with session.client("s3", endpoint_url=settings.minio_endpoint) as client:
        try:
            await client.head_bucket(Bucket=bucket)
        except ClientError:
            await client.create_bucket(Bucket=bucket)
