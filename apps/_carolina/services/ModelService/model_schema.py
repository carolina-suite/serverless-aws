
import base64, datetime, os, secrets
import boto3

boto3.setup_default_session(region_name=os.environ['awsRegion'])
DYNAMODB = boto3.client('dynamodb')
S3 = boto3.client('s3')

PRIVATE_BUCKET_NAME = "{}-{}-private".format(os.environ['slug'], os.environ['siteSuffix'])
PUBLIC_BUCKET_NAME = "{}-{}-public".format(os.environ['slug'], os.environ['siteSuffix'])

class Field:

  def __init__(self, obj, n):

    self.name = n
    self.type = obj['type']

    if 'default' in obj:
      self.default = obj['default']

    if 'description' in obj:
      self.description = obj['description']
    else:
      self.description = ''

    if 'edit' in obj:
      self.edit = obj['edit']
    else:
      self.edit = True

    if 'required' in obj:
      self.required = obj['required']
    else:
      self.required = False

    if 'unique' in obj:
      self.unique = obj['unique']
    else:
      self.unique = False

    if 'verbose' in obj:
      self.verbose = obj['verbose']
    else:
      self.verbose = self.name

  def to_dict(self):
    j = {
      'name': self.name,
      'type': self.type,
      'description': self.description,
      'edit': self.edit,
      'required': self.required,
      'unique': self.unique,
      'verbose': self.verbose
    }
    if hasattr(self, 'default'):
      j['default'] = self.default
    return j

  def from_db(self, o):
    return o['S']

class StringField(Field):

  def __init__(self, obj, n):
    super(StringField, self).__init__(obj, n)

  def to_attribute_definition(self):
    return {
      'AttributeName': self.name,
      'AttributeType': 'S'
    }

  def to_insert_obj(self, v):
    return { 'S': str(v) }

class StringEnumField(StringField):

  def __init__(self, obj, n):
    super(StringEnumField, self).__init__(obj, n)
    self.choices = obj['choices']
    if 'default' not in obj:
      self.default = self.choices[0]

  def to_dict(self):
    j = super(StringEnumField, self).to_dict()
    j['choices'] = self.choices
    return j

class IdField(StringField):

  def __init__(self, obj, n):
    super(IdField, self).__init__(obj, n)
    self.default = datetime.datetime.now().strftime('%Y%m%d%H%M%S') + secrets.token_hex(8)
    self.edit = False

class EmailAddressField(StringField):

  def __init__(self, obj, n):
    super(EmailAddressField, self).__init__(obj, n)

class RegularExpressionField(StringField):

  def __init__(self, obj, n):
    super(RegularExpressionField, self).__init__(obj, n)

class TextField(StringField):

  def __init__(self, obj, n):
    super(TextField, self).__init__(obj, n)

class CodeField(TextField):

  def __init__(self, obj, n):
    super(CodeField, self).__init__(obj, n)
    if 'lang' in obj:
      self.lang = obj['lang']
    else:
      self.lang = 'text'

  def to_dict(self):
    j = super(CodeField, self).to_dict()
    j['lang'] = self.lang
    return j

class BooleanField(Field):

  def __init__(self, obj, n):
    super(BooleanField, self).__init__(obj, n)

  def to_attribute_definition(self):
    return {
      'AttributeName': self.name,
      'AttributeType': 'BOOL'
    }

  def to_insert_obj(self, v):
    return { 'BOOL': bool(v) }
  def from_db(self, o):
    return o['BOOL']

class NumberField(Field):

  def __init__(self, obj, n):
    super(NumberField, self).__init__(obj, n)
    if 'default' not in obj:
      self.default = 0
    if 'min' in obj:

      self.min = obj['min']

      if 'default' not in obj:
        self.default = self.min
    else:
      self.min = None
    if 'max' in obj:
      self.max = obj['max']
    else:
      self.max = None

  def to_attribute_definition(self):
    return { 'AttributeName': self.name, 'AttributeType': 'N' }

  def to_dict(self):
    j = super(NumberField, self).to_dict()
    j['min'] = self.min
    j['max'] = self.max
    return j

  def to_insert_obj(self, v):
    return { 'N': str(float(v)) }
  def from_db(self, o):
    return float(o['N'])

class IntegerField(NumberField):

  def __init__(self, obj, n):
    super(IntegerField, self).__init__(obj, n)

  def to_insert_obj(self, v):
    return { 'N': str(int(v)) }
  def from_db(self, o):
    return int(o['N'])

class FileField(StringField):

  def __init__(self, obj, n):
    super(FileField, self).__init__(obj, n)
    if 'public' in obj:
      self.public = obj['public']
    else:
      self.public = True
    self.default = {
      'fileName': 'NONE',
      's3Key': 'NONE'
    }

  def to_dict(self):
    j = super(FileField, self).to_dict()
    j['public'] = self.public
    return j

  def to_insert_obj(self, v):

    # expect { fileName, base64, s3Key }
    if 'base64' not in v:
      if 's3Key' in v:
        return { 'S': v['s3Key'] }
      else:
        return { 'S': 'NONE' }

    acl = 'private'
    bucket = PRIVATE_BUCKET_NAME

    if self.public:
      acl = 'public-read'
      bucket = PUBLIC_BUCKET_NAME

    random_string = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    key = '_files/{}/{}'.format(random_string, v['fileName'])

    data = S3.put_object(
      ACL=acl,
      Body= base64.b64decode(v['base64']),
      Bucket=bucket,
      Key= key
    )

    return { 'S': key }

  def from_db(self, o):
    s3_key = o['S']
    file_name = s3_key.split('/')[-1]
    return {
      'fileName': file_name,
      's3Key': s3_key
    }

class RefField(StringField):

  def __init__(self, obj, n):
    super(RefField, self).__init__(obj, n)
    self.ref = obj['ref']

  def to_dict(self):
    j = super(RefField, self).to_dict()
    j['ref'] = self.ref
    return j

  def to_insert_obj(self, v):
    return super(RefField, self).to_insert_obj(v['refId'])

  def from_db(self, o):
    import main

    return main.lookup(self.ref['app'], self.ref['model'], o)


FIELDS = {
  'Boolean': BooleanField,
  'Code': CodeField,
  'EmailAddress': EmailAddressField,
  'File': FileField,
  'Id': IdField,
  'List': ListField,
  'RegularExpression': RegularExpressionField,
  'StringEnum': StringEnumField,
  'String': StringField,
  'Text': TextField
}

class Command:

  def __init__(self, schema):

    self.name = schema['name']
    if 'description' in schema:
      self.description = schema['description']
    else:
      self.description = self.name

    self.fields = {}
    for key in schema['fields']:
      self.fields[key] = FIELDS[schema['fields'][key]['type']](schema['fields'][key], key)

    self.execute = schema['execute']

  def to_dict(self):

    o = {
      'name': self.name,
      'description': self.description,
      'execute': self.execute,
      'fields': {}
    }

    for key in self.fields:
      o['fields'][key] = self.fields[key].to_dict()

    return o

class Schema:

  def __init__(self, schema):

    self.key_field = schema['keyField']

    if 'description' in schema:
      self.description = schema['description']
    else:
      self.description = ''

    if 'adminFields' in schema:
      self.admin_fields = schema['adminFields']
    else:
      self.admin_fields = [self.key_field]

    if 'singleton' in schema:
      self.singleton = schema['singleton']
    else:
      self.singleton = False

    self.fields = {}
    for key in schema['fields']:
      self.fields[key] = FIELDS[schema['fields'][key]['type']](schema['fields'][key], key)

    self.fields[self.key_field].edit = False
    self.fields[self.key_field].required = True
    self.fields[self.key_field].unique = True

    self.commands = []
    if 'commands' in schema:
      for c in schema['commands']:
        self.commands.append(Command(c))

  def get_lookup_key(self, v):
    k = {}
    k[self.key_field] = self.fields[self.key_field].to_insert_obj(v)
    return k

  def to_key_schema(self):
    return [{
      'AttributeName': self.key_field,
      'KeyType': 'HASH'
    }]

  def to_attribute_definitions(self):
    definitions = []
    definitions.append(self.fields[self.key_field].to_attribute_definition())
    return definitions

  def to_dict(self):

    o = {
      'keyField': self.key_field,
      'adminFields': self.admin_fields,
      'commands': [],
      'fields': {},
      'singleton': self.singleton
    }

    for prop in self.fields:
      o['fields'][prop] = self.fields[prop].to_dict()
    for c in self.commands:
      o['commands'].append(c.to_dict())

    return o

  def new_singleton(self):
    return self.from_db({})

  def to_insert_obj(self, obj):

    insert = {}

    for prop in self.fields:
      if prop in obj:
        insert[prop] = self.fields[prop].to_insert_obj(obj[prop])
      elif hasattr(self.fields[prop], 'default'):
        insert[prop] = self.fields[prop].to_insert_obj(self.fields[prop].default)

    return insert

  def from_db(self, obj):

    o = {}

    for prop in self.fields:
      if prop in obj:
        o[prop] = self.fields[prop].from_db(obj[prop])
      elif hasattr(self.fields[prop], 'default'):
        o[prop] = self.fields[prop].default

    return o
