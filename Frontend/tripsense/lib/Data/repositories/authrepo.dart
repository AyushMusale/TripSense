import 'package:tripsense/Domain/repointerface/authrepo.dart';

class AuthrepoImp extends Authrepo {
  AuthrepoImp(
  );

  @override
  Future<bool> signInReq(String email, String password) async{
    if(password.isEmpty || password.length < 6){
      return false;
    }
    return true;
  }
}