import 'package:tripsense/Data/repositories/authrepo.dart';
import 'package:tripsense/Data/models/credentials.dart';

class Signupusecase {

 final AuthrepoImp _authrepoImp;
  Signupusecase(
    this._authrepoImp,
  );

  Future<Credentials> execute(String email, String password) async{
    return await _authrepoImp.signUpReq(email, password);
  }
}