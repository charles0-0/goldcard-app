from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True) # Added email based on PRD
    phone = Column(String, unique=True, index=True, nullable=True) # Added phone based on PRD
    password = Column(String)
    role = Column(String, default="user") # 'user' or 'admin'
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    cards = relationship("Card", back_populates="owner")
    transactions = relationship("Transaction", back_populates="user")
    top_up_orders = relationship("TopUpOrder", back_populates="user")

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String) # 'virtual' | 'physical'
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
    type = Column(String) # 'Credit' | 'Expense' | 'Top Up'
    status = Column(String) # 'Success' | 'Pending' | 'Failed'
    description = Column(String)
    date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")
    card = relationship("Card", back_populates="transactions")

class TopUpOrder(Base):
    __tablename__ = "top_up_orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    method = Column(String) # 'crypto' | 'bank'
    status = Column(String, default="Pending")
    voucher_url = Column(String, nullable=True) # Proof of payment
    date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="top_up_orders")
