import 'package:tripsense/Data/repositories/authrepo.dart';
import 'package:tripsense/Domain/enities/credentials.dart';


class SignInUseCase {
  final AuthrepoImp _authrepoImp;

  SignInUseCase(this._authrepoImp);
  Future<Credentials> execute(String email, String password) async{
    return await _authrepoImp.signInReq(email, password);
  }
}