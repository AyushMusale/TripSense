import 'package:tripsense/Domain/enities/credentials.dart';

abstract class Authrepo {
    Future<bool> signInReq(String email, String password);
}