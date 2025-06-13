import Structure from 'structure-ts';

const main = async () => {
  const app = await Structure();

  const close = app.listen((port) => {
    // eslint-disable-next-line no-console
    console.log(`server running on port : ${port}`);
  });

  process.on('SIGINT', close).on('SIGTERM', close);
};

export default main;
