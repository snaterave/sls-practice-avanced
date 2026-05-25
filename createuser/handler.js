const aws = require("aws-sdk");
const { randomUUID } = require("crypto");
// import aws from "aws-sdk";
// import { randomUUID } from "crypto";
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

const createUsers = async (event, context) => {


    const userId = randomUUID();
    const userBody = JSON.parse(event.body);
    // Setea el userId
    userBody.pk = userId;

    let params = {
        TableName: 'UserStable',
        Item: userBody
    };

    console.log(' params = ', params.Item)
    return dynamoDB.put(params).promise().then(res => {
        console.log(res);
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': params.Item })
        }
    });

}

module.exports = {
    createUsers
}
