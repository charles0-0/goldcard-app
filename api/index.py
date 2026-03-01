"""
GoldCard Pay API - Vercel Serverless Version
Entry point for all API requests
"""

import os
import sys
import json
from datetime import datetime, timedelta
from urllib.parse import quote_plus

# Database setup
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship, declarative_base

# Authentication
from passlib.context import CryptContext
from jose import JWTError, jwt

# Database URL - Direct PostgreSQL connection to Supabase
JWT_SECRET = os.getenv("JWT_SECRET", "goldcard_secret_key_change_in_prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

# Database URL - Direct PostgreSQL connection to Supabase
# Password: 8NcawxMvx0FPMePa
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:8NcawxMvx0FPMePa@db.aahqejldfvcyxqwixkcp.supabase.co:5432/postgres"
print(f"DEBUG: Using PostgreSQL", file=sys.stderr)
print(f"DEBUG: URL={SQLALCHEMY_DATABASE_URL[:50]}...", file=sys.stderr)

# Create engine and session
try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    print(f"DEBUG: Engine created", file=sys.stderr)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    print(f"DEBUG: Session created", file=sys.stderr)
except Exception as e:
    print(f"DEBUG ERROR: {str(e)}", file=sys.stderr)
    raise

# Password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ============== Models ==============

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    password = Column(String)
    role = Column(String, default="user")
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    cards = relationship("Card", back_populates="owner")
    transactions = relationship("Transaction", back_populates="user")
    top_up_orders = relationship("TopUpOrder", back_populates="user")


class Card(Base):
    __tablename__ = "cards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String)
    number = Column(String, unique=True, index=True)
    holder_name = Column(String)
    expiry = Column(String)
    cvv = Column(String)
    status = Column(String, default="Active")
    limit = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    balance = Column(Float, default=0.0)
    label = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="cards")
    transactions = relationship("Transaction", back_populates="card")


class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=True)
    amount = Column(Float)
    type = Column(String)
    status = Column(String)
    description = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="transactions")
    card = relationship("Card", back_populates="transactions")


class TopUpOrder(Base):
    __tablename__ = "top_up_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    method = Column(String)
    status = Column(String, default="Pending")
    voucher_url = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="top_up_orders")


# Create tables
Base.metadata.create_all(bind=engine)


# ============== Helper Functions ==============

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta=None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(authorization: str):
    if not authorization:
        return None
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        return user
    finally:
        db.close()


# ============== API Handlers ==============

def handler(request):
    """Main handler for Vercel Serverless"""
    
    method = request.method
    path = request.path
    headers = dict(request.headers)
    
    # Get body for POST/PUT
    body = None
    if method in ["POST", "PUT"]:
        try:
            body = request.get_json(silent=True) or {}
        except:
            pass
    
    # CORS headers
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
    
    # Handle OPTIONS request
    if method == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}
    
    # Route handling
    response = None
    
    # Auth endpoints
    if path == "/api/register" or path == "/api/login":
        if method == "POST":
            response = handle_auth(path, body, headers)
        else:
            response = {"statusCode": 405, "body": json.dumps({"detail": "Method not allowed"})}
    
    # User endpoints
    elif path == "/api/me":
        response = handle_me(method, headers)
    elif path == "/api/stats":
        response = handle_stats(method, headers)
    elif path == "/api/dashboard/chart":
        response = handle_dashboard_chart(method, headers)
    
    # Card endpoints
    elif path == "/api/cards":
        response = handle_cards(method, body, headers)
    
    # Transaction endpoints
    elif path == "/api/transactions":
        response = handle_transactions(method, body, headers)
    elif path == "/api/account/topup":
        response = handle_topup(method, body, headers)
    
    # Root
    elif path == "/" or path == "/api":
        response = {"statusCode": 200, "body": json.dumps({"message": "Welcome to GoldCard Pay API"})}
    
    # 404
    else:
        response = {"statusCode": 404, "body": json.dumps({"detail": "Not found"})}
    
    # Add CORS headers
    if response:
        response["headers"] = {**cors_headers, **response.get("headers", {})}
        if isinstance(response.get("body"), dict):
            response["body"] = json.dumps(response["body"])
    
    return response


# ============== Route Handlers ==============

def handle_auth(path, body, headers):
    """Handle /api/register and /api/login"""
    db = SessionLocal()
    try:
        if path == "/api/register":
            # Register
            username = body.get("username")
            email = body.get("email")
            password = body.get("password")
            
            if not username or not password:
                return {"statusCode": 400, "body": json.dumps({"detail": "Username and password required"})}
            
            existing = db.query(User).filter(User.username == username).first()
            if existing:
                return {"statusCode": 400, "body": json.dumps({"detail": "Username already registered"})}
            
            hashed_password = get_password_hash(password)
            new_user = User(
                username=username,
                email=email,
                password=hashed_password,
                role="user",
                balance=0.0
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": new_user.username, "role": new_user.role},
                expires_delta=access_token_expires
            )
            
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "access_token": access_token,
                    "token_type": "bearer",
                    "user": {
                        "username": new_user.username,
                        "email": new_user.email,
                        "id": new_user.id,
                        "role": new_user.role,
                        "balance": new_user.balance
                    }
                })
            }
        
        elif path == "/api/login":
            # Login
            # Handle form data
            content_type = headers.get("content-type", "")
            if "application/x-www-form-urlencoded" in content_type:
                # Parse form data
                import urllib.parse
                body_str = body if isinstance(body, str) else str(body)
                parsed = urllib.parse.parse_qs(body_str)
                username = parsed.get("username", [None])[0]
                password = parsed.get("password", [None])[0]
            else:
                username = body.get("username")
                password = body.get("password")
            
            user = db.query(User).filter(User.username == username).first()
            if not user or not verify_password(password, user.password):
                return {"statusCode": 401, "body": json.dumps({"detail": "Incorrect username or password"})}
            
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user.username, "role": user.role},
                expires_delta=access_token_expires
            )
            
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "access_token": access_token,
                    "token_type": "bearer",
                    "user": {
                        "username": user.username,
                        "email": user.email,
                        "id": user.id,
                        "role": user.role,
                        "balance": user.balance
                    }
                })
            }
    finally:
        db.close()


def handle_me(method, headers):
    """Handle /api/me"""
    auth = headers.get("authorization", "")
    user = get_current_user(auth)
    
    if not user:
        return {"statusCode": 401, "body": json.dumps({"detail": "Not authenticated"})}
    
    if method == "GET":
        return {
            "statusCode": 200,
            "body": json.dumps({
                "username": user.username,
                "email": user.email,
                "id": user.id,
                "role": user.role,
                "balance": user.balance,
                "created_at": user.created_at.isoformat() if user.created_at else None
            })
        }
    
    return {"statusCode": 405, "body": json.dumps({"detail": "Method not allowed"})}


def handle_stats(method, headers):
    """Handle /api/stats"""
    auth = headers.get("authorization", "")
    user = get_current_user(auth)
    
    if not user:
        return {"statusCode": 401, "body": json.dumps({"detail": "Not authenticated"})}
    
    if method == "GET":
        db = SessionLocal()
        try:
            total_balance = user.balance
            active_cards = db.query(Card).filter(
                Card.user_id == user.id,
                Card.status == "Active"
            ).count()
            
            total_spending = 0
            expenses = db.query(Transaction).filter(
                Transaction.user_id == user.id,
                Transaction.type == "Expense"
            ).all()
            for txn in expenses:
                total_spending += txn.amount
            
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "totalBalance": total_balance,
                    "activeCards": active_cards,
                    "totalSpending": total_spending,
                    "totalCompanies": 1
                })
            }
        finally:
            db.close()
    
    return {"statusCode": 405, "body": json.dumps({"detail": "Method not allowed"})}


def handle_dashboard_chart(method, headers):
    """Handle /api/dashboard/chart"""
    # Mock data for chart
    data = [
        {"name": "Mon", "value": 4000},
        {"name": "Tue", "value": 3000},
        {"name": "Wed", "value": 2000},
        {"name": "Thu", "value": 2780},
        {"name": "Fri", "value": 1890},
        {"name": "Sat", "value": 2390},
        {"name": "Sun", "value": 3490},
    ]
    return {"statusCode": 200, "body": json.dumps(data)}


def handle_cards(method, body, headers):
    """Handle /api/cards"""
    import random
    
    auth = headers.get("authorization", "")
    user = get_current_user(auth)
    
    if not user:
        return {"statusCode": 401, "body": json.dumps({"detail": "Not authenticated"})}
    
    db = SessionLocal()
    try:
        if method == "GET":
            cards = db.query(Card).filter(Card.user_id == user.id).all()
            return {
                "statusCode": 200,
                "body": json.dumps([{
                    "id": c.id,
                    "type": c.type,
                    "number": c.number,
                    "holder_name": c.holder_name,
                    "expiry": c.expiry,
                    "cvv": c.cvv,
                    "status": c.status,
                    "limit": c.limit,
                    "currency": c.currency,
                    "balance": c.balance,
                    "label": c.label,
                    "created_at": c.created_at.isoformat() if c.created_at else None
                } for c in cards])
            }
        
        elif method == "POST":
            # Create card
            card_type = body.get("type", "virtual")
            holder_name = body.get("holder_name", "")
            currency = body.get("currency", "USD")
            limit = body.get("limit", 0)
            label = body.get("label", "")
            
            prefix = "4242" if card_type.lower() == "visa" else "5500"
            number = prefix + str(random.randint(100000000000, 999999999999))
            expiry = "12/28"
            cvv = str(random.randint(100, 999))
            
            new_card = Card(
                type=card_type,
                number=number,
                holder_name=holder_name,
                expiry=expiry,
                cvv=cvv,
                limit=limit,
                currency=currency,
                label=label,
                user_id=user.id,
                balance=0.0
            )
            db.add(new_card)
            db.commit()
            db.refresh(new_card)
            
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "id": new_card.id,
                    "type": new_card.type,
                    "number": new_card.number,
                    "holder_name": new_card.holder_name,
                    "expiry": new_card.expiry,
                    "cvv": new_card.cvv,
                    "status": new_card.status,
                    "limit": new_card.limit,
                    "currency": new_card.currency,
                    "balance": new_card.balance,
                    "label": new_card.label,
                    "created_at": new_card.created_at.isoformat() if new_card.created_at else None
                })
            }
        
        return {"statusCode": 405, "body": json.dumps({"detail": "Method not allowed"})}
    finally:
        db.close()


def handle_transactions(method, body, headers):
    """Handle /api/transactions"""
    auth = headers.get("authorization", "")
    user = get_current_user(auth)
    
    if not user:
        return {"statusCode": 401, "body": json.dumps({"detail": "Not authenticated"})}
    
    db = SessionLocal()
    try:
        if method == "GET":
            transactions = db.query(Transaction).filter(
                Transaction.user_id == user.id
            ).order_by(Transaction.date.desc()).all()
            
            return {
                "statusCode": 200,
                "body": json.dumps([{
                    "id": t.id,
                    "amount": t.amount,
                    "type": t.type,
                    "status": t.status,
                    "description": t.description,
                    "date": t.date.isoformat() if t.date else None,
                    "card_id": t.card_id
                } for t in transactions])
            }
        
        return {"statusCode": 405, "body": json.dumps({"detail": "Method not allowed"})}
    finally:
        db.close()


def handle_topup(method, body, headers):
    """Handle /api/account/topup"""
    auth = headers.get("authorization", "")
    user = get_current_user(auth)
    
    if not user:
        return {"statusCode": 401, "body": json.dumps({"detail": "Not authenticated"})}
    
    if method != "POST":
        return {"statusCode": 405, "body": json.dumps({"detail": "Method not allowed"})}
    
    amount = body.get("amount", 0)
    method_type = body.get("method", "bank")
    
    if amount <= 0:
        return {"statusCode": 400, "body": json.dumps({"detail": "Invalid amount"})}
    
    db = SessionLocal()
    try:
        # Create top up order
        new_order = TopUpOrder(
            amount=amount,
            method=method_type,
            status="Success",
            user_id=user.id
        )
        db.add(new_order)
        
        # Update user balance
        user.balance += amount
        
        # Create transaction record
        trx = Transaction(
            amount=amount,
            type="Top Up",
            status="Success",
            description="Wallet Top Up",
            user_id=user.id
        )
        db.add(trx)
        db.commit()
        
        return {
            "statusCode": 200,
            "body": json.dumps({
                "id": new_order.id,
                "amount": new_order.amount,
                "status": new_order.status,
                "date": new_order.date.isoformat() if new_order.date else None
            })
        }
    finally:
        db.close()
