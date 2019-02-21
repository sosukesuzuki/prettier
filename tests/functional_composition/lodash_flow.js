import { flow } from "lodash";

const foo = flow(
  x => x + 1,
  x => x * 3,
  x => x - 6,
);

foo(6);

import * as _ from "lodash";

const foo = _.flow(
  x => x + 1,
  x => x * 3,
  x => x - 6,
);

foo(6);
