# db.py
import boto3, os, time

dynamodb = boto3.client(
    "dynamodb",
    endpoint_url=os.getenv("AWS_ENDPOINT"),
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name="us-east-1",
)

TABLE_NAME = "voral-jobs"


def get_or_create_table():
    """
    Retourne l’objet Table ; crée la table uniquement si elle n’existe pas.
    Évite l’exception ResourceInUseException.
    """
    tables = dynamodb.list_tables()["TableNames"]
    if TABLE_NAME not in tables:
        print("⏳  Table DynamoDB absente, création en cours...")
        dynamodb.create_table(
            TableName=TABLE_NAME,
            AttributeDefinitions=[{"AttributeName": "jobId", "AttributeType": "S"}],
            KeySchema=[{"AttributeName": "jobId", "KeyType": "HASH"}],
            BillingMode="PAY_PER_REQUEST",
        )
        # attendre qu’elle passe à ACTIVE
        while True:
            status = dynamodb.describe_table(TableName=TABLE_NAME)["Table"]["TableStatus"]
            if status == "ACTIVE":
                break
            time.sleep(1)
        print("✅  Table DynamoDB prête.")

    # retourne un resource.Table high-level (optionnel mais pratique)
    resource = boto3.resource(
        "dynamodb",
        endpoint_url=os.getenv("AWS_ENDPOINT"),
        aws_access_key_id="test",
        aws_secret_access_key="test",
        region_name="us-east-1",
    )
    return resource.Table(TABLE_NAME)


# objet table accessible partout
table = get_or_create_table()
