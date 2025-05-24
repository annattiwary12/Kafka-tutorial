const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
 clientId: 'mp-application',
  brokers: ['192.168.29.68:9092']  // <-- no spaces
});