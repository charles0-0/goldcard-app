from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..main import app
from ..database import Base, get_db
import pytest

# Setup Test Database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    # Drop tables
    Base.metadata.drop_all(bind=engine)

def test_read_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to GoldCard Pay API"}

def test_register_user(client):
    response = client.post(
        "/api/register",
        json={"username": "testuser", "password": "testpassword", "email": "test@example.com"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["username"] == "testuser"
    assert "access_token" in data

def test_login_user(client):
    # Register first (if not dependent on previous test order, but pytest execution order is usually sequential in file)
    # Better to rely on fixture or isolated tests, but for simplicity here we assume sequential
    
    response = client.post(
        "/api/login",
        data={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    return data["access_token"]

def test_get_me(client):
    token = test_login_user(client)
    response = client.get(
        "/api/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

def test_create_card(client):
    token = test_login_user(client)
    response = client.post(
        "/api/cards",
        json={
            "type": "virtual",
            "holder_name": "Test Holder",
            "limit": 1000,
            "currency": "USD",
            "label": "Test Card"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["holder_name"] == "Test Holder"
    assert data["balance"] == 0.0

def test_get_cards(client):
    token = test_login_user(client)
    response = client.get(
        "/api/cards",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_topup_account(client):
    token = test_login_user(client)
    response = client.post(
        "/api/account/topup",
        json={"amount": 500.0, "method": "crypto"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Pending" # Initially pending

def test_get_transactions(client):
    token = test_login_user(client)
    # The topup should have created a transaction (simulated mostly, but current logic creates it after delay in background or immediate if sync)
    # Our implementation in transactions.py creates it immediately for "simulated success" in the same request?
    # Checking implementation: transactions.py logic actually does:
    # new_order.status = 'Success' -> commit -> Transaction.create -> commit.
    # So it is synchronous in my python implementation!
    
    response = client.get(
        "/api/transactions",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert response.json()[0]["type"] == "Top Up"
