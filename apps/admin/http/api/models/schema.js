
var Fields = require('./fields');

class Schema {

  constructor(schema) {

    this.keyField = schema.keyField;
    this.singleton = false;
    if (schema.singleton) this.singleton = true;
    this.fields = {};

    for (var prop in schema.fields) {
      this.fields[prop] = new Fields[`${schema.fields[prop].type}Field`](schema.fields[prop], prop);
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
  newSingleton() {
    return this.fromDB({});
  }
}

module.exports = Schema;
