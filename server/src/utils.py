import string
import random
import secrets


def generate_random_password(length):
    chars = list(string.digits + string.ascii_lowercase + string.ascii_uppercase + string.punctuation)
    random.shuffle(chars)
    return "".join(chars[:length])
