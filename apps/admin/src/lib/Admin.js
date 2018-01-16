
class AdminLib {

  constructor() {

  }

  getStarterObjectFromSchema(s) {

    var starterObject = {};

    for (var property in s.fields) {
      if (s.fields[property].hasOwnProperty('default')) {
        starterObject[property] = s.fields[property].default;
      }
      else {
        if (s.fields[property].type == 'Boolean') {
          starterObject[property] = false;
        }
        if (s.fields[property].type == 'EmailAddress') {
          starterObject[property] = '';
        }
        if (s.fields[property].type == 'Integer' || s.fields[property].type == 'Number') {
          starterObject[property] = 0;
        }
        if (s.fields[property].type == 'String') {
          starterObject[property] = '';
        }
      }
    }

    return starterObject;
  }
}

var Admin = new AdminLib();
export default Admin;
