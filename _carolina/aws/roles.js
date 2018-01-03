
this.lambdaRole = {
  Version: "2012-10-17",
  Statement: {
    Effect: 'Allow',
    Principal: { Service: 'lambda.amazonaws.com' },
    Action: 'sts:AssumeRole'
  }
};

this.lambdaRoleDocument = JSON.stringify(this.lambdaRole);
