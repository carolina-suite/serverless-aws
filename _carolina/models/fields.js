
class Field {

  constructor(obj) {
    if (obj.hasOwnProperty('required')) this.required = obj.required;
    else this.required = false;
    if (obj.hasOwnProperty('unique')) this.unique = obj.unique;
    else this.unique = false;
  }
}

class StringField extends Field {

  constructor(obj) {
    super(obj);
  }

  toInsertObj(v) {
    return { S: String(v) };
  }
};

class EmailAddressField extends StringField {

  constructor(obj) {
    super(obj);
  }

  toInsertObj(v) {
    return { S: String(v) };
  }
}

class BooleanField extends Field {

  consructor(obj) {
    super(obj);
  }

  toInsertObj(v) {
    return { BOOL: Boolean(v) };
  }
}

this.StringField = StringField;
this.EmailAddressField = EmailAddressField;
this.BooleanField = BooleanField;
