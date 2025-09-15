import 'package:tripsense/Data/models/credentials.dart';

abstract class Authrepo {
    Future<Credentials> signUpReq(String email, String password);
    Future<Credentials> signInReq(String email, String password);
}