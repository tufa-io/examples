# Tufa nodejs examples

Before running any project go to the specific folder and run  

``npm install``

### Invoice service example
The example is a simple cloud application, accepting REST calls with invoice data for processing.
The service reads data from a PostgreSQL DB and store a JSON invoice file on AWS S3 Bucket.

For component testing run:  
``npm run test``

For End to End test run  
`npm run test:e2e`
