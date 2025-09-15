import 'dart:convert';

import 'package:tripsense/Data/models/mytrips.dart';
import 'package:tripsense/Domain/repointerface/getmytrips_repo.dart';
import 'package:http/http.dart' as http;

class GetmytripsRepoImp extends GetmytripsRepo {
  GetmytripsRepoImp();

  @override
  Future<MytripsModel> getmytripsfn(String email) async{
      final url = Uri.parse("");
      final res = await http.post(url, headers:{'Content-Type': 'application/json'}, body: jsonEncode({
        "email": email,
      }));

      final jsonRes = jsonDecode(res.body);
      return MytripsModel(errormsg:  jsonRes['errormsg'] , mytripsList: jsonRes['myTrips']);
  }
}