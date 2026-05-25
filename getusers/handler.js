const aws = require("aws-sdk");
// import aws from "aws-sdk";
// para ver que lee las variables del serverless
console.log('IS_OFFLINE =>', process.env.IS_OFFLINE);
// Hablar con la BD
// const dynamoDB = new aws.DynamoDB.DocumentClient({
//     region: 'localhost',
//     endpoint: 'http://localhost:8000',
//     accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
//     secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
// });

// verificar si esta apuntando a la nube o al local
let dynamoDBClienteParams = {}; //cuando esta vacia pega a la BD en la nube
if (process.env.IS_OFFLINE) {
    dynamoDBClienteParams = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        credentials: {
            accessKeyId: 'fakeMyKeyId',
            secretAccessKey: 'fakeSecretAccessKey',
        },
    }
}

const dynamoDB = new aws.DynamoDB.DocumentClient(dynamoDBClienteParams);

console.log('ENDPOINT =>', dynamoDB.service.endpoint.href);

const getUsers = async (event, context) => {
    // obtener parametros, viene del serverless.yml:
    // get-users:
    // handler: handler.getUsers
    // events:
    //   - http:
    //       path: users/{id}
    //       method: GET

    let userId = event.pathParameters.id;

    let params = {
        ExpressionAttributeValues: { ':pk': userId },
        KeyConditionExpression: 'pk = :pk',
        TableName: 'UserStable'
    };

    // const hour = new Date().getHours();
    // const min = new Date().getMinutes();
    // const seg = new Date().getSeconds();

    return dynamoDB.query(params).promise().then(res => {
        console.log(res);
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': res })
        }
    });

}

module.exports = {
    getUsers
}
