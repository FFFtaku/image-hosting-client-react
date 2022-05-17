
function checkAuth(){
  const tokenName = 'token';
  if(localStorage.getItem(tokenName)){
    return true;
  }
  return false;
}

function setAuth(token){
  localStorage.setItem('token', token);
}

export {
  checkAuth,
  setAuth
}