import time
from typing import Dict

import jwt


class AuthHandler:
    DEFAULT_ALGORITHM = "HS256"
    KEY = "3446cd54863e398f2fd9ad60404df193"
    EXPIRATION_DURATION = 900

    def __init__(self, algorithm=None, secret=None, expire_duration=None):
        self.__algorithm = algorithm or self.DEFAULT_ALGORITHM
        self.__secret = secret or self.KEY
        self.__expire_duration = expire_duration or self.EXPIRATION_DURATION

    def decode_jwt(self, token: str) -> dict:
        try:
            decoded_token = jwt.decode(token, self.__secret, algorithms=[self.__algorithm])
            return decoded_token if decoded_token["expires"] >= time.time() else None
        except:
            return {}

    def sign_jwt(self, user_id: str) -> Dict[str, str]:
        payload = {
            "user_id": user_id,
            "expires": time.time() + self.__expire_duration
        }
        token = jwt.encode(payload, self.__secret, algorithm=self.__algorithm)
        return dict(access_token=token)


auth_handler = AuthHandler()
