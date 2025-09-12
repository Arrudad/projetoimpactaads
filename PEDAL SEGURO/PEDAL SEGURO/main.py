from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from db import init_db
from api.bikers import router as bikers_router

app = FastAPI(
    title="Gestão de Pedal - Emergência",
    version="2.0.0",
    description="API para gerenciar ciclistas e seus contatos de emergência, com frontend integrado."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(bikers_router, prefix="/api")

app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

@app.get("/", include_in_schema=False)
async def read_index():
    return FileResponse('frontend/index.html')

@app.get("/{page_name}", include_in_schema=False)
async def read_page(page_name: str):
    file_path = f"frontend/{page_name}.html"
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return FileResponse('frontend/index.html')