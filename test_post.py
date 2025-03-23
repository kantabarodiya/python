import requests

url = "http://127.0.0.1:5000/your_route"
response = requests.post(url)
print(response.json())  # Output: {"message": "This is a POST request!"}
