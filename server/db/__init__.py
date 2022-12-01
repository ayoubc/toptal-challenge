from datetime import date, datetime, timedelta
from typing import List
from json import load
from os.path import dirname, join

from fastapi import HTTPException

from src.models import Food, User, UserLogin, Role, TotalCaloriesPerDay, Meal

foods: List[Food] = []

users: List[User] = [
    User(id=1, email="user1@gmail.com", password="qwerty", threshold=50),
    User(id=3, email="user2@gmail.com", password="abc"),
    User(id=2, email="admin@gmail.com", password="azerty", role=Role.ADMIN)
]

total_calories_per_user: List[TotalCaloriesPerDay] = []

meals: List[Meal] = [
    Meal(id=1, name="Breakfast", max_foods=3),
    Meal(id=2, name="Launch", max_foods=5),
    Meal(id=3, name="Dinner", max_foods=2)
]


def get_user_info(data: UserLogin):
    for user in users:
        if user.email == data.email and user.password == data.password:
            return user
    return None


def find_food(food: [Food, int]):
    compare_to = food if isinstance(food, int) else food.id
    for index, f in enumerate(foods):
        if f.id == compare_to:
            return index

    return -1


def find_user(user: [User, int]):
    compare_to = user if isinstance(user, int) else user.id
    for u in users:
        if u.id == compare_to:
            return u

    return None


def find_foods_by_user(user_id: int = None):
    if user_id is None:
        return foods

    return [food for food in foods if food.created_by == user_id]


def add_food(food: Food):
    food.id = len(foods) + 1
    foods.append(food)
    update_total_calories_per_user(food)
    return True


def update_food(food: Food):
    food_index = find_food(food)
    if food_index == -1:
        raise HTTPException(status_code=404, detail="Food not found")

    food.created_at = foods[food_index].created_at
    foods[food_index] = food
    return True


def delete_food(food_id: int):
    food_index = find_food(food_id)
    if food_index == -1:
        raise HTTPException(status_code=404, detail="Food not found")

    foods.pop(food_index)
    return True


def add_tcu(user_id: int, calories, day: datetime = None):
    if day is None:
        day = datetime.now()

    tcu = TotalCaloriesPerDay(user_id=user_id, day=day.date(), calories=calories)
    tcu.id = len(total_calories_per_user) + 1
    total_calories_per_user.append(tcu)
    return True


def find_total_calories_by_user_day(user_id: int, day: [date, datetime]):
    if isinstance(day, datetime):
        day = day.date()

    for tcu in total_calories_per_user:
        if tcu.user_id == user_id and tcu.day == day:
            return tcu

    return None


def update_total_calories_per_user(food: Food):
    tcu = find_total_calories_by_user_day(food.created_by, food.created_at)
    if tcu is None:
        add_tcu(food.created_by, food.calories, food.created_at)

    else:
        tcu.calories += food.calories
    return True


def get_stats_by_user(user_id: int):
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=7)
    return [tcu for tcu in total_calories_per_user
            if tcu.user_id == user_id and start_date <= tcu.day <= end_date]


def get_number_of_added_entries():
    today = datetime.now().date()
    last_seven_days = today - timedelta(days=7)
    last_fourteen_days = last_seven_days - timedelta(days=7)
    res = {"today": 0, "last_7": 0, "last_14": 0}
    for food in foods:
        food_date = food.created_at.date()
        if food_date == today:
            res["today"] += 1
        if last_seven_days <= food_date <= today:
            res["last_7"] += 1
        if last_fourteen_days <= food_date < last_seven_days:
            res["last_14"] += 1
    return res


def get_average_calories_per_user():
    today = datetime.now().date()
    last_seven_days = today - timedelta(days=7)

    user_map = {user.id: user.email for user in users}

    result = {}
    for tcu in total_calories_per_user:
        if last_seven_days <= tcu.day <= today:
            result[user_map[tcu.user_id]] = result.get(user_map[tcu.user_id], 0) + tcu.calories

    return [{"email": k, "calories": round(v / 7, 2)} for k, v in result.items()]


def get_meals():
    return meals


with open(join(dirname(__file__), "foods.json")) as fp:
    data = load(fp)
    for d in data:
        if "created_at" in d:
            d["created_at"] = datetime.strptime(d["created_at"], "%Y-%m-%d")
        add_food(Food(**d))
