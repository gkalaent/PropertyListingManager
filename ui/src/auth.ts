const authorizer = {
    isAuthenticated: false,
    signin(callback: VoidFunction) {
        authorizer.isAuthenticated = true;
      setTimeout(callback, 100); // fake async
    },
    signout(callback: VoidFunction) {
        authorizer.isAuthenticated = false;
      setTimeout(callback, 100);
    }
  };
  
  export { authorizer };