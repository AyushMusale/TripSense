import 'package:tripsense/Domain/enities/trip.dart';
class Tripdetailsstate {}

class Tripdetailssuccess extends Tripdetailsstate{
  final Trip tripdetails;
  Tripdetailssuccess(this.tripdetails);
}

class Tripdetailsfailure extends Tripdetailsstate{}

class Tripdetailsloading extends Tripdetailsstate{}

class TripdetailsInitial extends Tripdetailsstate{}