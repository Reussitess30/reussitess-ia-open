
import requests

def get_weather_simple(city="Guadeloupe"):
    try:
        url = f"https://wttr.in/{city}?format=3"
        return requests.get(url).text
    except:
        return "Météo indisponible"

