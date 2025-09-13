import 'package:tripsense/Data/repositories/authrepo.dart';
import 'package:tripsense/Domain/enities/credentials.dart';

class Signinusecase {

 final AuthrepoImp _authrepoImp;
  Signinusecase(
    this._authrepoImp,
  );

  Future<Credentials> execute(String email, String password) async{
    return await _authrepoImp.signInReq(email, password);
  }
}