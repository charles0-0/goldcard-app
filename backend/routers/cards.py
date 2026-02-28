from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random
import models, schemas, database, dependencies

router = APIRouter()

@router.get("/cards", response_model=List[schemas.Card])
def read_cards(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    cards = db.query(models.Card).filter(models.Card.user_id == current_user.id).all()
    return cards

@router.post("/cards", response_model=schemas.Card)
def create_card(
    card: schemas.CardCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    # Generate random card details
    # In a real app, this would call an issuer API
    prefix = '4242' if card.type.lower() == 'visa' else '5500'
    number = prefix + str(random.randint(100000000000, 999999999999))
    expiry = '12/28'
    cvv = str(random.randint(100, 999))
    
    new_card = models.Card(
        type=card.type,
        number=number,
        holder_name=card.holder_name,
        expiry=expiry,
        cvv=cvv,
        limit=card.limit,
        currency=card.currency,
        label=card.label,
        user_id=current_user.id,
        balance=0.0 # Initial balance
    )
    
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card
