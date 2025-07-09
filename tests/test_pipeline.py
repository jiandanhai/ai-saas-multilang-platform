import os
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_and_login():
    username = "user_test"
    password = "pass_test"
    # 注册
    resp = client.post("/api/register", json={"username": username, "password": password})
    assert resp.status_code == 200
    # 登录
    resp = client.post("/api/login", data={"username": username, "password": password})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    return data["access_token"]

def test_upload_and_status(monkeypatch):
    token = test_register_and_login()
    # 创建虚拟音频文件
    tmp = "test.wav"
    with open(tmp, "wb") as f:
        f.write(os.urandom(1024))
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.post("/api/upload", files={"file": open(tmp, "rb")}, headers=headers)
    assert resp.status_code == 200
    task_id = resp.json()["task_id"]
    # 查询任务状态
    resp = client.get(f"/api/task/{task_id}", headers=headers)
    assert resp.status_code == 200