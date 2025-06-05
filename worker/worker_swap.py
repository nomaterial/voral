import boto3, os, time, shutil
from db import table
from audio_prep import clean

# S3 client
s3 = boto3.client(
    "s3",
    endpoint_url=os.getenv("S3_ENDPOINT"),
    aws_access_key_id=os.getenv("S3_KEY"),
    aws_secret_access_key=os.getenv("S3_SECRET"),
)
BUCKET = os.getenv("S3_BUCKET", "voral")

# SQS client
sqs = boto3.client(
    "sqs",
    endpoint_url=os.getenv("AWS_ENDPOINT"),
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name="us-east-1",
)
try:
    QUEUE_URL = sqs.get_queue_url(QueueName="voral-jobs")["QueueUrl"]
except sqs.exceptions.QueueDoesNotExist:
    sqs.create_queue(QueueName="voral-jobs")
    QUEUE_URL = sqs.get_queue_url(QueueName="voral-jobs")["QueueUrl"]

print("Worker ready – waiting for messages...")

# Main loop
while True:
    msgs = sqs.receive_message(
        QueueUrl=QUEUE_URL,
        MaxNumberOfMessages=1,
        WaitTimeSeconds=5,
        MessageAttributeNames=["All"],
    )
    if "Messages" not in msgs:
        continue

    msg = msgs["Messages"][0]
    job_id = msg["MessageAttributes"]["jobId"]["StringValue"]
    job_type = msg.get("MessageAttributes", {}).get("type", {}).get("StringValue", "unknown")
    receipt = msg["ReceiptHandle"]

    print(f"[{job_id}] Processing type: {job_type}")

    if job_type == "swap":
        # Télécharge src + ref
        s3.download_file(BUCKET, f"{job_id}/src.wav", "src.wav")
        s3.download_file(BUCKET, f"{job_id}/ref.wav", "ref.wav")

        # Pré-process → clean.wav
        clean("src.wav", "clean.wav")

        # Stub modèle → pour l’instant simple copy clean.wav → result.wav
        shutil.copy("clean.wav", "result.wav")
        result_key = f"{job_id}/result.wav"

        # Upload result
        s3.upload_file("result.wav", BUCKET, result_key)

        # Update status DynamoDB
        table.update_item(
            Key={"jobId": job_id},
            UpdateExpression="SET #s=:s, resultUrl=:u",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={":s": "done", ":u": result_key},
        )

        print(f"[{job_id}] done.")

    else:
        print(f"[{job_id}] Unhandled job type: {job_type}")

    # Supprimer le message de la queue
    sqs.delete_message(QueueUrl=QUEUE_URL, ReceiptHandle=receipt)
