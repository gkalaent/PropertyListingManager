const authorizor = {
    isAuthenticated: false,
    signin(callback: VoidFunction) {
        authorizor.isAuthenticated = true;
      setTimeout(callback, 100); // fake async
    },
    signout(callback: VoidFunction) {
        authorizor.isAuthenticated = false;
      setTimeout(callback, 100);
    }
  };
  
  export { authorizor };