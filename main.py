from fastapi import FastAPI

# 1. Create an instance of the FastAPI application
app = FastAPI()


# 2. Define a "path operation" (an endpoint)
#    @app.get("/") tells FastAPI that the function below
#    handles GET requests for the root URL ("/").
@app.get("/")
async def read_root():
    # 3. Return the data you want to send as a JSON response
    return {"message": "Hello Andresinho"}