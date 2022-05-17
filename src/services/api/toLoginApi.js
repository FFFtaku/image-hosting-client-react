import { Get, Post } from '../http';

function postLogin({ account_id_email, account_pass }) {
  return Post('/account/login', {
    account_id_email,
    account_pass
  });
}

function postRegister({ account_id_email, account_pass, register_auth_code }) {
  return Post('/account/register', {
    account_id_email,
    account_pass,
    register_auth_code
  });
}

function postRegisterAuth({ account_id_email }) {
  return Post('/func/register_auth', {
    account_id_email
  });
}
export {
  postLogin,
  postRegister,
  postRegisterAuth
}