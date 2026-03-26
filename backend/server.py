from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import asyncio
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup (optional - only if API key provided)
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Define Models
class GameScore(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_name: str
    score: int
    wickets: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GameScoreCreate(BaseModel):
    player_name: str
    score: int
    wickets: int

class Feedback(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FeedbackCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "Cricket Game API is running!"}

@api_router.post("/save-score", response_model=GameScore)
async def save_score(input: GameScoreCreate):
    """Save game score to database"""
    score_dict = input.model_dump()
    score_obj = GameScore(**score_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = score_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.game_scores.insert_one(doc)
    return score_obj

@api_router.get("/scores", response_model=List[GameScore])
async def get_scores(limit: int = 10):
    """Get top scores from database"""
    # Get top scores sorted by score descending
    scores = await db.game_scores.find(
        {}, 
        {"_id": 0}
    ).sort("score", -1).limit(limit).to_list(limit)
    
    # Convert ISO string timestamps back to datetime objects
    for score in scores:
        if isinstance(score['timestamp'], str):
            score['timestamp'] = datetime.fromisoformat(score['timestamp'])
    
    return scores

@api_router.post("/send-feedback")
async def send_feedback(input: FeedbackCreate):
    """Save feedback and send email notification"""
    try:
        # Save feedback to database
        feedback_dict = input.model_dump()
        feedback_obj = Feedback(**feedback_dict)
        
        doc = feedback_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        
        await db.feedback.insert_one(doc)
        
        # Send email if Resend is configured
        if RESEND_API_KEY:
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #1a1a1a; color: #ffffff;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #2a2a2a; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #4ade80;">🏏 New Cricket Game Feedback</h2>
                        <div style="margin: 20px 0; padding: 15px; background-color: #1a1a1a; border-radius: 5px;">
                            <p><strong>Name:</strong> {input.name}</p>
                            <p><strong>Email:</strong> {input.email}</p>
                            <p><strong>Message:</strong></p>
                            <p style="padding: 10px; background-color: #3a3a3a; border-radius: 5px;">{input.message}</p>
                            <p style="color: #888; font-size: 12px; margin-top: 20px;">Received at: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": ["hari.darshini.612@gmail.com"],
                "subject": f"Cricket Game Feedback from {input.name}",
                "html": html_content
            }
            
            # Run sync SDK in thread to keep FastAPI non-blocking
            email_result = await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Feedback email sent: {email_result}")
            
            return {
                "status": "success",
                "message": "Feedback saved and email sent successfully!",
                "email_sent": True
            }
        else:
            logger.warning("Resend API key not configured, email not sent")
            return {
                "status": "success",
                "message": "Feedback saved successfully!",
                "email_sent": False
            }
            
    except Exception as e:
        logger.error(f"Error processing feedback: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing feedback: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
