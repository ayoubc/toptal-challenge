import uvicorn
from fastapi import FastAPI, Body, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import db
from src.auth.auth_bearer import JWTBearer
from src.auth.auth_handler import auth_handler
from src.models import Food, User, UserLogin, Role, Friend
from src.utils import generate_random_password

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# testing
@app.get("/")
def greet():
    return {"version": "0.0.1"}


@app.get("/foods/{user_id}", ) # dependencies=[Depends(JWTBearer())]
def get_foods(user_id: int):
    user: User = db.find_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == Role.ADMIN:
        return dict(data=db.find_foods_by_user())

    return dict(data=db.find_foods_by_user(user_id))


@app.post("/foods", dependencies=[Depends(JWTBearer())])
def add_food(food: Food):
    db.add_food(food)
    return dict(data=food)


@app.put("/foods", dependencies=[Depends(JWTBearer())])
def update_food(food: Food):
    db.update_food(food)
    return dict(data=food)


@app.delete("/foods/{food_id}")
def delete_food(food_id: int):
    db.delete_food(food_id)
    return dict(data=food_id)


@app.post("/login")
def user_login(user: UserLogin = Body(...)):
    user_info = db.get_user_info(user)
    if user_info:
        return {**user_info.dict(), **auth_handler.sign_jwt(user.email)}

    raise HTTPException(status_code=500, detail="Wrong login details!")


@app.get("/stats/{user_id}")
def get_stats(user_id: int):
    return db.get_stats_by_user(user_id)


@app.get("/stats")
def get_stats_for_admin():
    return {
        "added_entries": db.get_number_of_added_entries(),
        "average_calories_per_user": db.get_average_calories_per_user()
    }


@app.get("/meals")
def get_meals():
    return db.get_meals()


@app.post("/invitation")
def send_invite(friend: Friend):
    return {
        "password": generate_random_password(12),
        **auth_handler.sign_jwt(friend.email)
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, debug=True)
