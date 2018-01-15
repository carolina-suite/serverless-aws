
var Fields = require('./fields');
var Command = require('./command');

class Schema {

  constructor(schema) {

    this.keyField = schema.keyField;

    this.singleton = false;
    if (schema.singleton) this.singleton = true;

    this.description = '';
    if (schema.description) this.description = schema.description;

    if (schema.adminFields) {
      this.adminFields = schema.adminFields;
    }
    else {
      this.adminFields = [this.keyField];
    }
    this.fields = {};
    for (var prop in schema.fields) {
      this.fields[prop] = new Fields[`${schema.fields[prop].type}Field`](schema.fields[prop], prop);
    }

    this.fields[this.keyField].edit = false;
    this.fields[this.keyField].required = true;
    this.fields[this.keyField].unique = true;

    this.commands = [];
    if (schema.hasOwnProperty('commands')) {
      for (var i = 0; i < schema.commands.length; ++i) {
        this.commands.push(new Command(schema.commands[i]));
      }
    }
  }

  getLookupKey(v) {
    var k = {};
    k[this.keyField] = this.fields[this.keyField].toInsertObj(v);
    return k;
  }

  toKeySchema() {
    return [
      {
        AttributeName: this.keyField,
        KeyType: 'HASH'
      }
    ];
  }
  toAttributeDefinitions() {
    var definitions = [];
    definitions.push(this.fields[this.keyField].toAttributeDefinition());
    return definitions;
  }
  toInsertObj(obj) {
    var insert = {};
    for (var prop in this.fields) {
      if (obj.hasOwnProperty(prop)) {
        insert[prop] = this.fields[prop].toInsertObj(obj[prop]);
      }
      else if (this.fields[prop].hasOwnProperty('default')) {
        insert[prop] = this.fields[prop].toInsertObj(this.fields[prop].default);
      }
    }
    return insert;
  }
  fromDB(obj) {

    var o = {};
    for (var prop in this.fields) {
      if (obj.hasOwnProperty(prop)) {
        o[prop] = this.fields[prop].fromDB(obj[prop]);
      }
      else if (this.fields[prop].hasOwnProperty('default')) {
        o[prop] = this.fields[prop].default;
      }
    }

    return o;
  }
  toJSON() {

    var o = {
      keyField: this.keyField,
      adminFields: this.adminFields,
      singleton: this.singleton,
      fields: {},
      commands: []
    };

    for (var prop in this.fields) {
      o.fields[prop] = this.fields[prop].toJSON()
    };

    for (var i = 0; i < this.commands.length; ++i) {
      o.commands.push(this.commands[i].toJSON());
    }

    return o;
  }
  newSingleton() {
    return this.fromDB({});
  }
}

module.exports = Schema;
