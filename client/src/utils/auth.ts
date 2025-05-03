import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
getProfile() {
  // TODO: return the decoded token
  return jwtDecode<JwtPayload>(this.getToken());

}

loggedIn() {
  // TODO: return a value that indicates if the user is logged in
  return !!this.getToken() && !this.isTokenExpired(this.getToken());
}

isTokenExpired(token: string) {
  // TODO: return a value that indicates if the token is expired
  try {
    const userToken = jwtDecode<JwtPayload>(token);
    if (userToken.exp && userToken.exp * 1000 < Date.now()) {
      return true; // Token is expired
    }

  } catch (error) {
    return false; 
    
  }
}

getToken(): string {
  // TODO: return the token
  return localStorage.getItem('token') || '';
}

login(idToken: string) {
  // TODO: set the token to localStorage
  // TODO: redirect to the home page
  
  localStorage.setItem('token', idToken);
  window.location.assign('/');

}

logout() {
  // TODO: remove the token from localStorage
  // TODO: redirect to the login page
  localStorage.removeItem('token');
  window.location.assign('/');
}
}

export default new AuthService();
