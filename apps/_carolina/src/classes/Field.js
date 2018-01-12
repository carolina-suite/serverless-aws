
class Field {
  
  constructor(obj, n) {
    this.name = n;

    if (obj.hasOwnProperty('required')) this.required = obj.required;
    else this.required = false;
    if (obj.hasOwnProperty('secret')) this.secret = obj.secret;
    else this.secret = false;
    if (obj.hasOwnProperty('unique')) this.unique = obj.unique;
    else this.unique = false;
    if (obj.hasOwnProperty('verbose')) this.verbose = obj.verbose
    else this.verbose = this.name;
  }
}
