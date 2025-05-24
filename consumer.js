const { kafka } = require('./client');
const group = process.argv[2];

if (!group) {
  console.error('Error: Please provide a consumer group ID as a command-line argument.');
  process.exit(1);
}

async function init() {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();

  await consumer.subscribe({ topics: ['rider-updates'] });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`[${group}]: PART:${partition}: ${message.value.toString()}`);
    },
  });
}

init().catch(console.error);
