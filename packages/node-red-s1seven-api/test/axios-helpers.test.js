const { asClass, createContainer, InjectionMode, Lifetime } = require('awilix');

describe('AxiosHelpers', function () {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
  });

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
    container.resolve('asyncLocalStorage').init({
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
    /** @type {import('../lib/utils/axios-helpers')} */
    const axiosHelpers = container.resolve('axiosHelpers');
    const axios = axiosHelpers.createAxiosInstance();
    //
    const response = await axios.get('https://google.com');
    expect(response).toHaveProperty('data');
  });

  it('requestHandler() - should return success response data and call send function', async () => {
    /** @type {import('../lib/utils/axios-helpers')} */
    const axiosHelpers = container.resolve('axiosHelpers');
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
    /** @type {import('../lib/utils/axios-helpers')} */
    const axiosHelpers = container.resolve('axiosHelpers');
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
