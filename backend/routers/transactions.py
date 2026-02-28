from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import models, schemas, database, dependencies

router = APIRouter()

@router.get("/transactions", response_model=List[schemas.Transaction])
def read_transactions(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id
    ).order_by(models.Transaction.date.desc()).all()
    return transactions

@router.post("/account/topup")
def top_up_account(
    order: schemas.TopUpCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    # Create TopUp Order
    new_order = models.TopUpOrder(
        amount=order.amount,
        method=order.method,
        status='Pending',
        user_id=current_user.id
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    # Simulate Instant Success for Demo (matching previous logic)
    # In production, this would be a webhook callback
    new_order.status = 'Success'
    current_user.balance += order.amount
    
    # Create Transaction Record
    trx = models.Transaction(
        amount=order.amount,
        type='Top Up',
        status='Success',
        description='Wallet Top Up',
        user_id=current_user.id
    )
    db.add(trx)
    db.commit()
    
    return new_order
