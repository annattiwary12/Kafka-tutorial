const { kafka } = require('./client');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  const producer = kafka.producer();
  console.log("Connecting producer...");
  await producer.connect();
  console.log("Producer connected successfully");

  rl.setPrompt('> ');
  rl.prompt();

  rl.on('line', async (line) => {
    // Split by space to separate riderName and location
    const [riderName, location] = line.split(' ');

    if (!riderName || !location) {
      console.log("Please enter input as: <riderName> <location>");
      rl.prompt();
      return;
    }

    // Determine partition based on location (trim spaces and lowercase)
    const partition = location.trim().toLowerCase() === 'north' ? 0 : 1;

    await producer.send({
      topic: 'rider-updates',
      messages: [
        {
          partition,
          key: 'location-update',
          value: JSON.stringify({ name: riderName, loc: location }),
        },
      ],
    });

    console.log("Message sent successfully");
    rl.prompt();
  }).on('close', async () => {
    console.log("Closing producer...");
    await producer.disconnect();
    process.exit(0);
  });
}

init().catch(console.error);
