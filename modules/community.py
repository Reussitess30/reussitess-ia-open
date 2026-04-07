
import json

def track_user(country):
    try:
        data = json.load(open("users.json"))
    except:
        data = {}

    data[country] = data.get(country, 0) + 1

    json.dump(data, open("users.json","w"))

