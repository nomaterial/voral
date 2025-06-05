# app/db.py

import boto3, os
import time

# Crée client DynamoDB
dynamodb = boto3.client(
    "dynamodb",
    endpoint_url=os.getenv("AWS_ENDPOINT"),
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name="us-east-1",
)

# Nom de la table
TABLE_NAME = "voral-jobs"

# Fonction : crée la table si elle n'existe pas
def get_or_create_table():
    tables = dynamodb.list_tables()["TableNames"]
    if TABLE_NAME not in tables:
        print("⏳  Table DynamoDB absente, création en cours...")
        dynamodb.create_table(
            TableName=TABLE_NAME,
            AttributeDefinitions=[{"AttributeName": "jobId", "AttributeType": "S"}],
            KeySchema=[{"AttributeName": "jobId", "KeyType": "HASH"}],
            BillingMode="PAY_PER_REQUEST",
        )
        # attend que la table soit ACTIVE
        while True:
            desc = dynamodb.describe_table(TableName=TABLE_NAME)
            status = desc["Table"]["TableStatus"]
            if status == "ACTIVE":
                break
            time.sleep(1)
        print("✅  Table DynamoDB prête.")
    else:
        print("✅  Table DynamoDB déjà existante.")
    
    # Retourne un "resource" haut niveau
    resource = boto3.resource(
        "dynamodb",
        endpoint_url=os.getenv("AWS_ENDPOINT"),
        aws_access_key_id="test",
        aws_secret_access_key="test",
        region_name="us-east-1",
    )
    return resource.Table(TABLE_NAME)

# Table = automatiquement créée au import
table = get_or_create_table()
