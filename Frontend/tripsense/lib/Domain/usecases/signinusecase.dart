import 'package:tripsense/Data/repositories/authrepo.dart';

class Signinusecase {


 final AuthrepoImp _authrepoImp;
  Signinusecase(
    this._authrepoImp,
  );

  Future<bool> execute(String email, String password) async{
    return await _authrepoImp.signInReq(email, password);
  }
  
}