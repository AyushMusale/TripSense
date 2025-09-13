import 'package:tripsense/Domain/enities/credentials.dart';

abstract class Authrepo {
    Future<Credentials> signInReq(String email, String password);
}