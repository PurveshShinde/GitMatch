import mongoose from 'mongoose';

const uri = 'mongodb+srv://gitmatchdev_db_user:bRIWOciUZyfFZqgS@cluster0.jmsiike.mongodb.net/?appName=Cluster0';
const directUri = 'mongodb://gitmatchdev_db_user:bRIWOciUZyfFZqgS@ac-2bxlv86-shard-00-00.jmsiike.mongodb.net:27017,ac-2bxlv86-shard-00-01.jmsiike.mongodb.net:27017,ac-2bxlv86-shard-00-02.jmsiike.mongodb.net:27017/?ssl=true&replicaSet=atlas-2bxlv86-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

async function test() {
  try {
    console.log('Testing with family: 4...');
    await mongoose.connect(uri, { family: 4 });
    console.log('SUCCESS with family: 4!');
    await mongoose.disconnect();
  } catch (err) {
    console.log('FAILED with family: 4:', err.message);
  }

  try {
    console.log('\nTesting with Direct URI...');
    await mongoose.connect(directUri);
    console.log('SUCCESS with Direct URI!');
    await mongoose.disconnect();
  } catch (err) {
    console.log('FAILED with Direct URI:', err.message);
  }
}

test();
