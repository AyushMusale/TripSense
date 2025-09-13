import 'package:tripsense/Domain/enities/credentials.dart';

abstract class AuthState {}

class AuthInitial extends AuthState{}

class AuthLoading extends AuthState{}

class AuthSuccess extends AuthState{
  final Credentials credentials;
  AuthSuccess(this.credentials);
}

class AuthFailure extends AuthState{}