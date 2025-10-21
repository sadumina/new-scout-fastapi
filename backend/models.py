from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import uuid

class Opportunity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    source: str
    url: Optional[str]
    category: str
    date: datetime
    summary: Optional[str]
