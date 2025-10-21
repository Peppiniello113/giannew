from fastapi import FastAPI

# Use the 'main2' app name you created
app = FastAPI()


@app.get("/")
async def read_root():
    # Use an f-string to combine the text and the formula
    message = f"I Love Andresinho {100 + 1}%"
    
    # Return the new message
    return {"message": message}