import { Model } from '../../../src/db';

const User = Model('user', {
  uname: {
    type: 'str',
    required: true,
  },
});

export { User };
