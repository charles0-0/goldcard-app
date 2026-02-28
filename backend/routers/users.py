from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, schemas, database, dependencies

router = APIRouter()

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(dependencies.get_current_user)):
    return current_user

@router.get("/stats")
def read_dashboard_stats(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    total_balance = current_user.balance
    active_cards = db.query(models.Card).filter(
        models.Card.user_id == current_user.id, 
        models.Card.status == 'Active'
    ).count()
    
    # Calculate total spending (Expense transactions)
    total_spending = 0
    expenses = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.type == 'Expense'
    ).all()
    for txn in expenses:
        total_spending += txn.amount
        
    return {
        "totalBalance": total_balance,
        "activeCards": active_cards,
        "totalSpending": total_spending,
        "totalCompanies": 1 # Mock
    }

@router.get("/dashboard/chart")
def read_dashboard_chart(current_user: models.User = Depends(dependencies.get_current_user)):
    # Mock data for chart, consistent with previous backend
    data = [
        {"name": "Mon", "value": 4000},
        {"name": "Tue", "value": 3000},
        {"name": "Wed", "value": 2000},
        {"name": "Thu", "value": 2780},
        {"name": "Fri", "value": 1890},
        {"name": "Sat", "value": 2390},
        {"name": "Sun", "value": 3490},
    ]
    return data
