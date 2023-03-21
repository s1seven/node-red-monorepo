const { asClass, createContainer, InjectionMode, Lifetime } = require('awilix');
const {
  GLOBAL_ACCESS_TOKEN_KEY,
  GLOBAL_COMPANY_ID_KEY,
} = require('../lib/utils/keys');

describe('AxiosHelpers', function () {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
  });

  /** @returns {import('../lib/utils/axios-helpers')} */
  function getAxiosHelpers() {
    return container.resolve('axiosHelpers');
  }

  /** @type {import('../lib/utils/async-local-storage')} */
  let asyncLocalStorage;

  beforeEach(() => {
    container.register({
      getters: asClass(require('../lib/utils/getters'), {
        lifetime: Lifetime.SINGLETON,
      }),
      asyncLocalStorage: asClass(require('./async-local-storage.mock'), {
        lifetime: Lifetime.SINGLETON,
      }),
      axiosHelpers: asClass(require('../lib/utils/axios-helpers')),
    });
    asyncLocalStorage = container.resolve('asyncLocalStorage');
    asyncLocalStorage.init({
      apiConfig: {
        apiVersion: 1,
        environment: 'production',
      },
      msg: {},
      globalContext: new Map(),
    });
  });

  afterEach(async () => {
    await container.dispose();
  });

  it('createAxiosInstance() - should provide valid axios instance', async () => {
    const axiosHelpers = getAxiosHelpers();
    const axios = axiosHelpers.createAxiosInstance();
    //
    const response = await axios.get('https://google.com');
    expect(response).toHaveProperty('data');
  });

  it('createAxiosInstance() - should set headers based on implicit context store', async () => {
    asyncLocalStorage.exit();
    const globalContext = new Map();
    const apiConfig = {
      name: 'test',
      apiVersion: 1,
      environment: 'production',
    };
    asyncLocalStorage.init({
      apiConfig,
      msg: {},
      globalContext,
    });
    globalContext.set(GLOBAL_ACCESS_TOKEN_KEY(apiConfig), 'jwt');
    globalContext.set(GLOBAL_COMPANY_ID_KEY(apiConfig), 'companyId');
    const axiosHelpers = getAxiosHelpers();
    const axios = axiosHelpers.createAxiosInstance();
    //
    expect(axios.defaults).toHaveProperty(
      'headers.Authorization',
      'Bearer jwt'
    );
    expect(axios.defaults).toHaveProperty('headers.company', 'companyId');
    expect(axios.defaults).toHaveProperty('headers.x-version', '1');
    expect(axios.defaults).toHaveProperty(
      'headers.user-agent',
      expect.stringContaining('node-red-s1seven-api/')
    );
  });

  it('requestHandler() - should return success response data and call send function', async () => {
    const axiosHelpers = getAxiosHelpers();
    const axios = axiosHelpers.createAxiosInstance();
    const axiosResponse = {
      data: {
        hello: 'world',
      },
      headers: {},
    };
    axios.get = jest.fn().mockResolvedValueOnce(axiosResponse);
    const requestPromise = axios.get('/');
    const sendFn = jest.fn();
    //
    const response = await axiosHelpers.requestHandler(requestPromise, sendFn);
    expect(sendFn).toHaveBeenCalledWith([
      {
        payload: axiosResponse.data,
        headers: axiosResponse.headers,
      },
      null,
    ]);
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('success', true);
  });

  it('requestHandler() - should return error response data and call send function', async () => {
    const axiosHelpers = getAxiosHelpers();
    const axios = axiosHelpers.createAxiosInstance();
    const axiosResponse = {
      data: {
        hello: 'world',
      },
      headers: {},
    };
    axios.get = jest.fn().mockRejectedValueOnce({
      response: axiosResponse,
      isAxiosError: true,
    });
    const requestPromise = axios.get('/');
    const sendFn = jest.fn();
    //
    const response = await axiosHelpers.requestHandler(requestPromise, sendFn);
    expect(sendFn).toHaveBeenCalledWith([
      null,
      {
        payload: axiosResponse.data,
        headers: axiosResponse.headers,
      },
    ]);
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('success', false);
  });
});
