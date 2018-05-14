// ============================================
// ============================================
// Import modules

const initState = {
  inputvalue: 0, // 主页中决定显示哪一个子页
  inputvalue2: 0, // 主页中决定显示哪一个子页
  fetchvalue: [],
};

// ============================================
// action handling function

const actDefault = (state) => state;

const testAdd = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    inputvalue: payload,
  });
};

const testAdd2 = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    inputvalue2: payload,
  });
};

const testFetch = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    fetchvalue: payload,
  });
};
// ============================================
// reducer function

const reducerFn = (state = initState, action) => {
  switch (action.type) {
  // 进入主页时，初始化左边box数据
  case 'TEST::add':
    return testAdd(state, action);
  case 'TEST::add2':
    return testAdd2(state, action);
  case 'TEST::testFetch':
    return testFetch(state, action);
  default:
    return actDefault(state, action);
  }
};

export default reducerFn;
