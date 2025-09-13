
abstract class AuthEvent{} 

class Signinrequested extends AuthEvent{
  final String email;
  final String password;
  
  Signinrequested(this.email, this.password);
}