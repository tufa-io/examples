# Tufa nodejs examples

Before running any project go to the specific folder and run  

``npm install``

### Invoice service example
The example is a simple cloud application, accepting REST calls with invoice data for processing.
The service reads data from a PostgreSQL DB and store a JSON invoice file on AWS S3 Bucket.

For component testing, run:  
``npm run test``

For End-to-End testing, run:
`npm run test:e2e`


### Orders dispatcher service
This example demonstrate event driven service. An event is sent from AWS SNS to an SQS subscription.
The service listen to the SQS, perform a DB lookup to PostgreSQL, and send a result to second SQS.

For End-to-End testing, run: 
`npm run test:e2e`
