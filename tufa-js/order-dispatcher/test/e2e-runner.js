import  {Tufa, utils} from 'tufa-js';
import concurrently from 'concurrently';

const tufa  = new Tufa(
    {
        request: {
            resources: [
                {
                    id: 'inItemsQueue',
                    type: 'SQS'
                },
                {
                    id: 'outItemsQueue',
                    type: 'SQS'
                },
                {
                    id: 'dispatcher',
                    type: 'SNS'
                },
                {
                    id: 'itemsDb',
                    type: 'PostgreSQL'
                }
            ],
        }
    });

(async function(){
    const  response = await tufa.connect();
    const env = { ...utils.awsEnvs(response),
        ...utils.pgEnvs(response.resources.itemsDb),
        IN_ITEMS_QUEUE_URL: response.resources.inItemsQueue.url,
        IN_ITEMS_QUEUE_ARN: response.resources.inItemsQueue.arn,
        OUT_ITEMS_QUEUE_URL: response.resources.outItemsQueue.url,
        DISPATCHER_TOPIC: response.resources.dispatcher.arn
        };

    try {
        concurrently([
            { command: 'node src/index.js --inspect', name: 'dispatcher', env  },
            { command: 'jest --config=jest.e2e.config.json ', name: 'test runner', env },
        ], {
            prefix: '',
            killOthers: ['failure', 'success']
        }).then(() => {
            tufa.end();
        } , () => {
            tufa.end();
        });
    } catch (err) {
        await tufa.end();
    }
})();





