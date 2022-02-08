const user = process.env.MONGO_CONNECT_USERNAME ?? 'root';
const pass = process.env.MONGO_CONNECT_PASSWORD ?? 'example';
const dbName = process.env.MONGO_CONNECT_DB ?? 'hotel';
const mongoHost = process.env.MONGO_CONNECT_URL ?? 'mongodb://localhost:27017/';

const connectionOption = {
  user,
  pass,
  dbName,
};

export { mongoHost, connectionOption };
