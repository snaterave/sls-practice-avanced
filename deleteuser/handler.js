const aws = require("aws-sdk");
// import aws from "aws-sdk";
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

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClienteParams);

const deleteUser = async (event, context) => {
    let id = event.pathParameters.id;
    console.log('EL ID = ', id)
    let params = {
        TableName: "UserStable",
        Key: { pk: id },
    };

    return dynamodb
        .delete(params)
        .promise()
        .then((response) => {
            return {
                statusCode: 200,
                body: JSON.stringify({ id: id }),
            };
        });
};

module.exports = {
    deleteUser,
};
