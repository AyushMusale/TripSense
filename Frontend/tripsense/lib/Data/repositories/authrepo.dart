import 'dart:convert';

import 'package:tripsense/Domain/enities/credentials.dart';
import 'package:tripsense/Domain/repointerface/authrepo.dart';
import 'package:http/http.dart' as http;

class AuthrepoImp extends Authrepo {
  AuthrepoImp();

  @override
  Future<Credentials> signUpReq(String email, String password) async {
    final url = Uri.parse('http://10.0.2.2:8001/user/signup');
    final res = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    final jsonRes = jsonDecode(res.body);
    return Credentials(
      email: jsonRes['email'],
      password: jsonRes['password'],
      id: jsonRes['id'],
      status: jsonRes['status'],
    );
  }

  @override
  Future<Credentials> signInReq(String email, String password) async {
    final url = Uri.parse('http://10.0.2.2:8001/user/');
    final res = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({"email": email, "password": password}),
    );
    final jsonRes = jsonDecode(res.body);
    return Credentials(
      email: jsonRes['email'],
      password: jsonRes['password'],
      id: jsonRes['id'],
      status: jsonRes['status'],
    );
  }
}
