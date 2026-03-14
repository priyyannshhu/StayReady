import json
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from main import app, predict_price, get_model_info, get_dataset_info

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc)}
    )

@app.get("/")
async def root_handler():
    return JSONResponse({
        "message": "Stay Ready ML API",
        "version": "1.0.0",
        "status": "healthy"
    })

@app.post("/predict")
async def predict_handler(request: dict):
    try:
        result = await predict_price(request)
        return JSONResponse(result)
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"error": f"Prediction failed: {str(e)}"}
        )

@app.get("/model-info")
async def model_info_handler():
    try:
        result = await get_model_info()
        return JSONResponse(result)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Model info failed: {str(e)}"}
        )

@app.get("/health")
async def health_handler():
    return JSONResponse({
        "status": "healthy",
        "service": "ml-api",
        "version": "1.0.0"
    })
