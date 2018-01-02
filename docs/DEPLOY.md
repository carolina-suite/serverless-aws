
# The Deploy Process #

The following steps are taken when you run `node deploy`:

* DynamoDB tables are created for all your models if they don't already exist.
* The public S3 bucket is created as a website, if it doesn't exist.
* The private S3 bucket is created if it doesn't exist.
* All public files are placed in the public bucket.
* The state is saved to the private bucket as `.site/state.json`.
* The state is saved to a local file, `.state`.
