
# The Deploy Process #

The following steps are taken when you run `node deploy`:

* DynamoDB tables are created for all your models if they don't already exist.
* An IAM role is created if one doesn't exist.
* An APIGateway API is created if one doesn't exist.
* The public S3 bucket is created as a website, if it doesn't exist.
* The private S3 bucket is created if it doesn't exist.
* All public files are placed in the public bucket.
* All private files are placed in the private bucket.
* Lambda functions are created if they don't exist, linking to built zip files in the private bucket.
* The state is saved to the private bucket as `.site/state.json`.
* The state is saved to a local file, `.state`.
* You will be informed of where the site is currently running.
