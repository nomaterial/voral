from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import boto3, uuid, os, time
from app.db import table

# ──────────────────────── FastAPI + CORS ────────────────────────
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # ← TOUTES les origines (dev). Restreins en prod !
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────── MinIO (S3) ────────────────────────────
s3 = boto3.client(
    "s3",
    endpoint_url=os.getenv("S3_ENDPOINT"),
    aws_access_key_id=os.getenv("S3_KEY"),
    aws_secret_access_key=os.getenv("S3_SECRET"),
)
BUCKET = os.getenv("S3_BUCKET", "voral")

# ──────────────────────── LocalStack SQS ────────────────────────
sqs = boto3.client(
    "sqs",
    endpoint_url=os.getenv("AWS_ENDPOINT"),
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name="us-east-1",
)
# crée la queue automatiquement si elle n’existe pas
try:
    QUEUE_URL = sqs.get_queue_url(QueueName="voral-jobs")["QueueUrl"]
except sqs.exceptions.QueueDoesNotExist:
    sqs.create_queue(QueueName="voral-jobs")
    QUEUE_URL = sqs.get_queue_url(QueueName="voral-jobs")["QueueUrl"]

# ──────────────────────── ROUTES ────────────────────────────────
@app.post("/jobs/swap")
async def create_swap_job(src: UploadFile = File(...), ref: UploadFile = File(...)):
    job_id = str(uuid.uuid4())

    # 1) Upload fichiers
    s3.upload_fileobj(src.file, BUCKET, f"{job_id}/src.wav")
    s3.upload_fileobj(ref.file, BUCKET, f"{job_id}/ref.wav")

    # 2) DynamoDB
    table.put_item(Item={
        "jobId": job_id,
        "type": "swap",
        "status": "queued",
        "resultUrl": None,
        "createdAt": int(time.time())
    })

    # 3) SQS
    sqs.send_message(
        QueueUrl=QUEUE_URL,
        MessageBody="voice_swap",
        MessageAttributes={
            "jobId": {"DataType": "String", "StringValue": job_id},
            "type": {"DataType": "String", "StringValue": "swap"}
        },
    )

    return {"jobId": job_id, "status": "queued"}


@app.post("/jobs/tts")
async def create_tts_clone_job(text: str = Form(...), ref: UploadFile = File(...)):
    job_id = str(uuid.uuid4())

    # Upload référence
    s3.upload_fileobj(ref.file, BUCKET, f"{job_id}/ref.wav")

    # Enregistre texte
    s3.put_object(Body=text.encode(), Bucket=BUCKET, Key=f"{job_id}/text.txt")

    table.put_item(Item={
        "jobId": job_id,
        "type": "tts_clone",
        "status": "queued",
        "resultUrl": None,
        "createdAt": int(time.time())
    })

    sqs.send_message(
        QueueUrl=QUEUE_URL,
        MessageBody="tts_clone",
        MessageAttributes={
            "jobId": {"DataType": "String", "StringValue": job_id},
            "type": {"DataType": "String", "StringValue": "tts_clone"}
        },
    )

    return {"jobId": job_id, "status": "queued"}

@app.post("/jobs/tts/stock")
async def create_tts_stock_job(text: str = Form(...), voiceId: str = Form(...), language: str = Form(...)):
    job_id = str(uuid.uuid4())

    # Enregistre les métadonnées
    meta = f"{voiceId}\n{language}\n{text}"
    s3.put_object(Body=meta.encode(), Bucket=BUCKET, Key=f"{job_id}/tts_stock.txt")

    table.put_item(Item={
        "jobId": job_id,
        "type": "tts_stock",
        "status": "queued",
        "resultUrl": None,
        "createdAt": int(time.time())
    })

    sqs.send_message(
        QueueUrl=QUEUE_URL,
        MessageBody="tts_stock",
        MessageAttributes={
            "jobId": {"DataType": "String", "StringValue": job_id},
            "type": {"DataType": "String", "StringValue": "tts_stock"}
        },
    )

    return {"jobId": job_id, "status": "queued"}



@app.get("/jobs/{job_id}") # GET /jobs/{job_id} → permet au Front de voir le statut et l’URL quand done
async def job_status(job_id: str):
    resp = table.get_item(Key={"jobId": job_id})
    if "Item" not in resp:
        raise HTTPException(status_code=404, detail="Job not found")
    item = resp["Item"]

    # Génère une URL signée si le job est terminé
    presigned = None
    if item["status"] == "done" and item.get("resultUrl"):
        presigned = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": BUCKET, "Key": item["resultUrl"]},
            ExpiresIn=3600,            # 1 h
        )

    return {"jobId": job_id, "status": item["status"], "url": presigned}
