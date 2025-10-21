from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

main3 = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

main3.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Changes are here ---

# 1. Add '{x}' to the URL path
@main3.get("/{x}") 
# 2. Make 'x' a required argument (remove the default value)
async def read_root(x: int):
    message = f"hello {100 + x}"
    return {"message": message}

# --- End of changes ---


if __name__ == "__main__":
    uvicorn.run(
        "main3:main3",
        host="127.0.0.1",
        port=8002,
        reload=True
    )