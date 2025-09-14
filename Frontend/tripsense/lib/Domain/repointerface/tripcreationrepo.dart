import 'package:tripsense/Domain/enities/trip.dart';

abstract class Tripcreationrepo {
  Tripcreationrepo();

  Future<Trip> tripcreationfn(String date, String destination, {String mode = "Not Decided"});
}