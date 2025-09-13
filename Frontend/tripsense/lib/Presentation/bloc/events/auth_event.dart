
abstract class AuthEvent{} 

class Signuprequested extends AuthEvent{
  final String email;
  final String password;
  
  Signuprequested(this.email, this.password);
}