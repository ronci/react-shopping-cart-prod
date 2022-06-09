import { products, customers } from 'mocks/mockData';
import { rest } from 'msw';

import { API_URL_PATH } from 'constants/api';

const findById = (id, array) => array.find(item => item.id === id);
const findByProuctID = (id, array) => array.find(item => item.productId === id);

export const handlers = [
  rest.get(`${API_URL_PATH.PRODUCTS}`, (req, res, ctx) => {
    const { authorization: raw } = req.headers._headers;
    const authorization = raw?.replace('Bearer', '');

    const storedProductsId = customers['abc@abc.com'].carts.map(cart => cart.productId);
    const storedProducts = products.map(product => {
      if (authorization) {
        if (storedProductsId.includes(product.id)) {
          const cart = findByProuctID(product.id, customers['abc@abc.com'].carts);
          return { ...product, quantity: cart.quantity };
        }
      }
      return { ...product, quantity: 0 };
    });
    return res(ctx.status(200), ctx.json({ products: storedProducts }));
  }),
  rest.post(`${API_URL_PATH.LOGIN}`, (req, res, ctx) => {
    const { email, password } = req.body;

    const isExist = customers[email]?.password === password;

    if (isExist) {
      return res(ctx.status(200), ctx.json({ accessToken: 1 }));
    }
    return res(ctx.status(404), ctx.json({ message: '존재하지 않는 email/password입니다.' }));
  }),
  rest.post(`${API_URL_PATH.EMAIL_VALIDATE}`, (req, res, ctx) => {
    const { email } = req.body;

    const isExist = !!customers[email];

    if (isExist) {
      return res(ctx.status(404));
    }
    return res(ctx.status(200));
  }),
  rest.get(`${API_URL_PATH.CUSTOMERS}`, (req, res, ctx) => {
    const email = 'abc@abc.com';
    const { password, ...rest } = customers[email];

    return res(ctx.status(200), ctx.json({ email, ...rest }));
  }),
  rest.post(`${API_URL_PATH.CUSTOMERS}`, (req, res, ctx) => {
    const { email, password, name, phone, address } = req.body;

    customers[email] = {
      password,
      name,
      phone,
      address,
    };

    return res(ctx.status(201), ctx.json({ email, name, phone, address }));
  }),
  rest.put(`${API_URL_PATH.CUSTOMERS}`, (req, res, ctx) => {
    const { email, password, name, phone, address } = req.body;

    customers[email] = {
      password,
      name,
      phone,
      address,
    };

    return res(ctx.status(200));
  }),
  rest.get(`${API_URL_PATH.NAME}`, (req, res, ctx) => {
    const { authorization: raw } = req.headers._headers;
    const authorization = raw.replace('Bearer', '');
    if (authorization) {
      return res(ctx.status(200), ctx.json({ name: customers['abc@abc.com'].name }));
    }
    return res(ctx.status(401));
  }),
  rest.get(`${API_URL_PATH.CARTS}`, (req, res, ctx) => {
    const { authorization: raw } = req.headers._headers;
    const authorization = raw.replace('Bearer', '');
    const carts = customers['abc@abc.com'].carts;

    const cartIds = carts.map(cart => cart.productId);
    const cartList = cartIds.map(productId => {
      const { id, ...rest } = findById(productId, products);
      return {
        productId: id,
        ...rest,
        quantity: findByProuctID(productId, carts).quantity,
      };
    });
    if (authorization) {
      return res(ctx.status(200), ctx.json({ carts: cartList }));
    } else {
      return res(ctx.status(400), ctx.json({ message: '존재하지 않는 이메일입니다.' }));
    }
  }),

  rest.post(`${API_URL_PATH.CARTS}`, (req, res, ctx) => {
    const { productId, quantity } = req.body;
    customers['abc@abc.com'].carts.push({ productId, quantity });
    return res(ctx.status(200), ctx.json({ quantity }));
  }),

  rest.patch(`${API_URL_PATH.CARTS}`, (req, res, ctx) => {
    const { authorization: raw } = req.headers._headers;
    const authorization = raw.replace('Bearer', '');

    const { productId, quantity } = req.body;
    const product = findByProuctID(productId, customers['abc@abc.com'].carts);
    product.quantity = quantity;
    if (authorization) {
      return res(ctx.status(200));
    }
    return res(ctx.status(401), ctx.json({ message: '에러메세지' }));
  }),
  rest.delete(`${API_URL_PATH.CARTS}`, (req, res, ctx) => {
    const { authorization: raw } = req.headers._headers;
    const authorization = raw.replace('Bearer', '');

    const { productIds } = req.body;
    customers['abc@abc.com'].carts = customers['abc@abc.com'].carts.filter(
      cart => !productIds.includes(cart.productId)
    );
    if (authorization) {
      return res(ctx.status(204));
    }
    return res(ctx.status(401), ctx.json({ message: '에러메세지' }));
  }),
  rest.delete(`${API_URL_PATH.CUSTOMERS}`, (req, res, ctx) => {
    const { authorization: raw } = req.headers._headers;
    const authorization = raw.replace('Bearer', '');

    if (authorization) {
      delete customers['abc@abc.com'];
      return res(ctx.status(204));
    }
    return res(ctx.status(401), ctx.json({ message: '에러메세지' }));
  }),
];
