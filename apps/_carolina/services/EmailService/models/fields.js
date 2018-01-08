
class Field {

  constructor(obj, n) {

    this.name = n;

    if (obj.hasOwnProperty('required')) this.required = obj.required;
    else this.required = false;
    if (obj.hasOwnProperty('secret')) this.secret = obj.secret;
    else this.secret = false;
    if (obj.hasOwnProperty('unique')) this.unique = obj.unique;
    else this.unique = false;
  }

  fromDB(o) {
    return o['S'];
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
