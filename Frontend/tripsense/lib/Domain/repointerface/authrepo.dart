import 'package:tripsense/Domain/enities/user.dart';

abstract class Authrepo {
    Future<bool> signInReq(String email, String password);
}