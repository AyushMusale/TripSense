import 'package:tripsense/Data/models/trip.dart';

abstract class Tripcreationrepo {
  Tripcreationrepo();

  Future<Tripmodel> tripcreationfn(String date, String destination, String email,{String mode = "Not Decided"});
}