import 'dart:convert';
import 'package:tripsense/Data/models/trip.dart';
import 'package:tripsense/Domain/repointerface/tripcreationrepo.dart';
import 'package:http/http.dart' as http;

class TripcreationrepoImp extends Tripcreationrepo {
  TripcreationrepoImp();

  @override
  Future<Tripmodel> tripcreationfn(String date, String destination,  String email,{String mode = "Not Decided"}) async{
    final url = Uri.parse("http://10.0.2.2/trip");
    final res = await http.post(url, headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'date' : date,
      'destination': destination,
      'email': email,
      'mode': mode,
    }));

    final jsonRes = jsonDecode(res.body);

    return Tripmodel(date: jsonRes.date,  destination: jsonRes.destination, mode: jsonRes.mode, id:  jsonRes.id , errormsg: jsonRes.errormsg, email: jsonRes.email);
  }

}