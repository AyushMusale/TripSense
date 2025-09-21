import 'dart:convert';

import 'package:tripsense/Domain/enities/trip.dart';
import 'package:tripsense/Domain/repointerface/gettripbyid.dart';
import 'package:http/http.dart' as http;

class GettripbyidrepoImp extends Gettripbyid {
  GettripbyidrepoImp();

  Future<Trip> getTrip(id) async {
    try {
      final url = Uri.parse("");
      final res = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'id': id}),
      );

      final jsonRes = jsonDecode(res.body);

      return Trip(date: jsonRes["date"], destination: jsonRes["destination"]);

    } catch (e) {
      return Trip(date: "null", destination: "null");
    }
  }
}
