from datetime import datetime, date
from typing import List

from pydantic import BaseModel, Field, EmailStr


class Role:
    NORMAL = "normal"
    ADMIN = "admin"


class Meal(BaseModel):
    id: int = Field(default=None)
    name: str = Field(...)
    max_foods: int = Field(default=2)


class Food(BaseModel):
    id: int = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    created_by: int = Field(...)
    name: str = Field(...)
    calories: int = Field(...)
    tags: List[Meal] = Field(default=[])


# Reel user in the database
class User(BaseModel):
    id: int = Field(default=None)
    email: EmailStr = Field(...)
    password: str = Field(...)
    role: str = Field(default=Role.NORMAL)
    threshold: int = Field(default=2100)


class TotalCaloriesPerDay(BaseModel):
    id: int = Field(default=None)
    user_id: int = Field(...)
    day: date = Field(...)
    calories: int = Field(default=0)


# User to login
class UserLogin(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)


class Friend(BaseModel):
    name: str = Field(...)
    email: EmailStr = Field(...)
