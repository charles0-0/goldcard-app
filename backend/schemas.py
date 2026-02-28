from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str
    balance: float
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# Card Schemas
class CardBase(BaseModel):
    type: str
    holder_name: str
    currency: str = "USD"
    limit: float
    label: Optional[str] = None

class CardCreate(CardBase):
    pass

class Card(CardBase):
    id: int
    number: str
    expiry: str
    cvv: str
    status: str
    balance: float
    created_at: datetime
    last_used_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Transaction Schemas
class TransactionBase(BaseModel):
    amount: float
    type: str
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    status: str
    date: datetime
    card_id: Optional[int] = None

    class Config:
        orm_mode = True

# TopUp Schemas
class TopUpCreate(BaseModel):
    amount: float
    method: str
