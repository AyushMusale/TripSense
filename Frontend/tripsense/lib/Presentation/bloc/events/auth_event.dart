
abstract class AuthEvent{} 

class Signuprequested extends AuthEvent{
  final String email;
  final String password;
  
  Signuprequested(this.email, this.password);
}

class SignInrequested extends AuthEvent{
  final String email;
  final String password;
  
  SignInrequested(this.email, this.password);
}

class CheckAuthstatus extends AuthEvent{}

class SignOutrequested extends AuthEvent{}