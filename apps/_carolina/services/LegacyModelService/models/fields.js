
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

class IdField extends StringField {
  constructor(obj, n) {

    super(obj, n);
  }
}

class StringEnumField extends StringField {

  constructor(obj, n) {

    super(obj, n);
    if (!obj.hasOwnProperty('default')) {
      this.default = obj.choices[i];
    }
  }

  toJSON() {
    var j = super.toJSON();
    j.choices = this.choices;
    return j;
  }

}

class EmailAddressField extends StringField {

  constructor(obj, n) {
    super(obj, n);
  }

  toInsertObj(v) {
    return { S: String(v) };
  }
}

class RegularExpressionField extends StringField {
  constructor(obj, n) {
    super(obj, n);
  }
}

class TextField extends StringField {
  constructor(obj, n) {
    super(obj, n);
  }
}

class FileField extends StringField {
  constructor(obj, n) {
    super(obj, n);
  }
}

class CodeField extends TextField {

  constructor(obj, n) {

    super(obj, n);

    if (obj.hasOwnProperty('lang')) {
      this.lang = obj.lang;
    }
    else {
      this.lang = 'text';
    }
  }

  toJSON() {
    var j = super.toJSON();
    j.lang = this.lang;
    return j;
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

class NumberField extends Field {

  constructor(obj, n) {
    super(obj, n);
  }

  toAttributeDefinition() {
    return {
      AttributeName: this.name,
      AttributeType: 'N'
    }
  }

  toInsertObj(v) {
    return { N: String(v) }
  }
  fromDB(o) {
    return Number(o['N']);
  }
}

class IntegerField extends Field {

  constructor(obj, n) {
    super(obj, n);
  }

  fromDB(o) {
    return parseInt(o['N']);
  }
}

class ListField extends Field {

  constructor(obj,n, SubtypeClass) {
    super(obj, n)
    this.subtypeClass = new SubtypeClass(obj.subSchema, 'item');
    if (obj.hasOwnProperty('limit')) this.limit = obj.limit;
    else this.limit = 0;
  }

  toJSON() {
    j = super.toJSON();
    j.limit = this.limit;
    j.subtypeClass = this.subtypeClass.toJSON();
    return j;
  }

  toAttributeDefinition() {
    return {
      AttributeName: this.name,
      AttributeType: 'L'
    }
  }
  toInsertObj(v) {
    return { 'L': v };
  }
  fromDB(o) {
    return o['L'];
  }
}

class FileListField extends ListField {
  constructor(obj, n) {
    super(obj, n, FileField);
  }
}

class StringListField extends ListField {

  constructor(obj, n) {
    super(obj, n, StringField);
  }

  toAttributeDefinition() {
    return {
      AttributeName: this.name,
      AttributeType: 'SS'
    }
  }

  toInsertObj(vs) {

    var v = [];

    for (var i = 0; i < vs.length; ++i) {
      v.push(String(vs[i]));
    }

    return { 'SS': v };
  }
  fromDB(o) {
    return o['SS'];
  }
}

function getFieldClass(name) {
  switch(name) {
    case 'Boolean':
      return BooleanClass;
    case 'Code':
      return CodeClass;
    case 'EmailAddress':
      return EmailAddressField;
    case 'ListField':
      return ListField;
    case 'StringEnum':
      return StringEnumField;
    case 'String':
      return StringField;
    case 'StringList':
      return StringListField;
    case 'TextField':
      return TextField;
    default:
      return StringField;
  }
}

this.BooleanField = BooleanField;
this.CodeField = CodeField;
this.EmailAddressField = EmailAddressField;
this.FileField = FileField;
this.IdField = IdField;
this.ListField = ListField;
this.StringEnumField = StringEnumField;
this.StringField = StringField;
this.StringListField = StringListField;
this.TextField = TextField;
