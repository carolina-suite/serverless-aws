
import json, os
import boto3

from model_schema import Schema

boto3.setup_default_session(region_name=os.environ['awsRegion'])
DYNAMODB = boto3.client('dynamodb')
S3 = boto3.client('s3')

PRIVATE_BUCKET_NAME = "{}-{}-private".format(os.environ['slug'], os.environ['siteSuffix'])

def list_models():

  model_file_listing = S3.list_objects(
    Bucket= PRIVATE_BUCKET_NAME,
    Prefix='_carolina/models'
  )

  models = {}

  for model_file in model_file_listing['Contents']:

    split_file_name = model_file['Key'].split('/')
    app_name = split_file_name[2]
    file_name = split_file_name[3]

    model_name = file_name[:-4]

    if app_name not in models:
      models[app_name] = []
    models[app_name].append(model_name)

  return models

def get_model_schema(app, model, as_dict=True):

  schema_key = "_carolina/models/{}/{}.yml".format(app, model)
  schema_file = S3.get_object(
    Bucket=PRIVATE_BUCKET_NAME,
    Key=schema_key
  )

  schema = Schema(json.loads(schema_file['Body'].read().decode('utf-8')))
  if as_dict:
    return schema.to_dict()
  else:
    return schema

def create_object(app, model, obj):

  schema = get_model_schema(app, model, False)
  if schema.singleton:
    raise Exception("Singletons cannot be created nor destroyed.")

  data = DYNAMODB.get_item(
    Key=schema.get_lookup_key(obj[schema.key_field]),
    TableName= "{}_{}_{}_{}".format(os.environ['slug'], os.environ['siteSuffix'], app, model)
  )
  if 'Item' in data:
    raise Exception("{}_{} with that key already exists.".format(app, model))
  else:
    data = DYNAMODB.put_item(
      Item= schema.to_insert_obj(obj),
      TableName= "{}_{}_{}_{}".format(os.environ['slug'], os.environ['siteSuffix'], app, model)
    )
    return data

def list_objects(app, model, page_size, page):

  schema = get_model_schema(app, model, False)

  current_page = 0
  last_evaluated_key = None

  while True:
    if last_evaluated_key:
      data = DYNAMODB.scan(
        ExclusiveStartKey= last_evaluated_key,
        Limit=page_size,
        TableName= "{}_{}_{}_{}".format(os.environ['slug'], os.environ['siteSuffix'], app, model)
      )
    else:
      data = DYNAMODB.scan(
        Limit=page_size,
        TableName= "{}_{}_{}_{}".format(os.environ['slug'], os.environ['siteSuffix'], app, model)
      )

    if current_page == page:
      return [schema.from_db(item) for item in data['Items']]
    else:
      current_page += 1
      last_evaluated_key = data['LastEvaluatedKey']

def lookup(app, model, value):

  schema = get_model_schema(app, model, False)

  data = DYNAMODB.get_item(
    Key= schema.get_lookup_key(value),
    TableName= "{}_{}_{}_{}".format(os.environ['slug'], os.environ['siteSuffix'], app, model)
  )
  if 'Item' in data:
    return schema.from_db(data['Item'])
  elif schema.singleton:
    return schema.new_singleton()
  else:
    return None

def query(app, model, query):

  schema = get_model_schema(app, model, False)

  last_evaluated_key = None

  results = []

  while True:
    if last_evaluated_key:
      data = DYNAMODB.scan(
        ExclusiveStartKey= last_evaluated_key,
        Limit=page_size,
        TableName= "{}_{}_{}_{}".format(os.environ['slug'], os.environ['siteSuffix'], app, model)
      )
    else:
      data = DYNAMODB.scan(
        Limit=page_size,
        TableName= "{}_{}_{}_{}".format(os.environ['slug'], os.environ['siteSuffix'], app, model)
      )

    if len(data['Items']) < 1:
      return results
    else:
      pass

def upsert_object(app, model, obj):

  schema = get_model_schema(app, model, False)

  data = DYNAMODB.put_item(
    Item= schema.to_insert_obj(obj),
    TableName= "{}_{}_{}_{}".format(os.environ['slug'], os.environ['siteSuffix'], app, model)
  )
  return data

def delete_object(app, model, value):

  schema = get_model_schema(app, model, False)

  data = DYNAMODB.put_item(
    Key= schema.get_lookup_key(value),
    TableName= "{}_{}_{}_{}".format(os.environ['slug'], os.environ['siteSuffix'], app, model)
  )
  return data

def handler(event, context):
  if not 'action' in event:
    raise Exception("No action specified.")
  elif event['action'] == 'list-models':
    return list_models()
  elif event['action'] == 'get-model-schema':
    return get_model_schema(event['app'], event['model'])
  elif event['action'] == 'create':
    return create_object(event['app'], event['model'], event['obj'])
  elif event['action'] == 'list':
    return list_objects(event['app'], event['model'], event['pageSize'], event['page'])
  elif event['action'] == 'lookup':
    return lookup(event['app'], event['model'], event['value'])
  elif event['action'] == 'query':
    # querying is not yet supported
    return query(event['app'], event['model'], event['query'])
  elif event['action'] == 'upsert':
    return upsert_object(event['app'], event['model'], event['query'])
  elif event['action'] == 'delete':
    return delete_object(event['app'], event['model'], event['value'])
  else:
    raise Exception("Invalid action provided.")
