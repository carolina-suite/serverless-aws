
class Field {

  constructor(obj, n) {

    this.name = n;
    this.type = obj.type;

    if (obj.hasOwnProperty('default')) this.default = obj.default;
    if (obj.hasOwnProperty('description')) this.description = obj.description;
    else this.description = '';
    if (obj.hasOwnProperty('edit')) this.edit = obj.edit;
    else this.edit = true;
    if (obj.hasOwnProperty('required')) this.required = obj.required;
    else this.required = false;
    if (obj.hasOwnProperty('secret')) this.secret = obj.secret;
    else this.secret = false;
    if (obj.hasOwnProperty('unique')) this.unique = obj.unique;
    else this.unique = false;
    if (obj.hasOwnProperty('verbose')) this.verbose = obj.verbose
    else this.verbose = this.name;
  }

  fromDB(o) {
    return o['S'];
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      description: this.description,
      edit: this.edit,
      required: this.required,
      secret: this.secret,
      unique: this.unique,
      verbose: this.verbose
    };
  }
}

class StringField extends Field {

  constructor(obj, n) {
    super(obj, n);
  }

  toAttributeDefinition() {
    return {
      AttributeName: this.name,
      AttributeType: 'S'
    }
  }
  toInsertObj(v) {
    return { S: String(v) };
  }
};

class EmailAddressField extends StringField {

  constructor(obj, n) {
    super(obj, n);
  }

  toInsertObj(v) {
    return { S: String(v) };
  }
}

class BooleanField extends Field {

  constructor(obj, n) {
    super(obj, n);
  }

  toAttributeDefinition() {
    return {
      AttributeName: this.name,
      AttributeType: 'BOOL'
    }
  }
  toInsertObj(v) {
    return { BOOL: Boolean(v) };
  }
  fromDB(o) {
    return o['BOOL'];
  }
}

this.StringField = StringField;
this.EmailAddressField = EmailAddressField;
this.BooleanField = BooleanField;
