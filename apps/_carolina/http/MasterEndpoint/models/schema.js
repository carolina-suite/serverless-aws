
var Fields = require('./fields');

class Schema {

  constructor(schema) {
    this.keyField = schema.keyField;
    this.fields = {};
    for (var prop in schema.fields) {
      this.fields[prop] = new Fields[`${schema.fields[prop].type}Field`](schema.fields[prop], prop);
    }
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
}

module.exports = Schema;
