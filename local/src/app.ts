import Structure from '../../src/main';

const main = async () => {
  const app = await Structure();

  const close = app.listen((port) => {
    console.log(`server running on port : ${port}`);
  });

  process
    .on('SIGINT', close)
    .on('SIGTERM', close)
    .on('SIGKILL', close);
};

export default main;
