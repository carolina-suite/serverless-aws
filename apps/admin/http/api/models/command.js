
var Fields = require('./fields');

class Command {

  constructor(schema) {

    this.name = schema.name;
    if (schema.hasOwnProperty('description'))
      this.description = schema.description;
    else this.description = schema.name;

    this.fields = {};
    for (var prop in schema.fields) {
      this.fields[prop] = new Fields[`${schema.fields[prop].type}Field`](schema.fields[prop], prop);
    }
    this.execute = schema.execute;
  }

  toJSON() {

    var o = {
      name: this.name,
      description: this.description,
      execute: this.execute,
      fields: {}
    };

    for (var prop in this.fields) {
      o.fields[prop] = this.fields[prop].toJSON()
    };

    return o;
  }
}

module.exports = Command;
