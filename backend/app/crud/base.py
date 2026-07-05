from typing import Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.base import Base

ModelT = TypeVar("ModelT", bound=Base)
CreateT = TypeVar("CreateT", bound=BaseModel)
UpdateT = TypeVar("UpdateT", bound=BaseModel)


class CRUDBase(Generic[ModelT, CreateT, UpdateT]):
    """Generic list/get/create/update/delete — a new domain subclasses this
    with zero extra code unless it needs custom queries."""

    def __init__(self, model: type[ModelT]):
        self.model = model

    def get(self, db: Session, id: int) -> ModelT | None:
        return db.get(self.model, id)

    def get_multi(self, db: Session) -> list[ModelT]:
        stmt = select(self.model)
        if hasattr(self.model, "sort_order"):
            stmt = stmt.order_by(self.model.sort_order, self.model.id)
        return list(db.scalars(stmt))

    def create(self, db: Session, obj_in: CreateT) -> ModelT:
        obj = self.model(**obj_in.model_dump())
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    def update(self, db: Session, db_obj: ModelT, obj_in: UpdateT) -> ModelT:
        for field, value in obj_in.model_dump().items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, db_obj: ModelT) -> None:
        db.delete(db_obj)
        db.commit()
