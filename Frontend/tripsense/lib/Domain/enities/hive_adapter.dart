import 'package:hive/hive.dart';
//import 'package:tripsense/Domain/enities/trip.dart';


@HiveType(typeId: 0)
class HiveTrip extends HiveObject{
  @HiveField(0)
  final String date;

  @HiveField(1)
  final String destination;
  @HiveField(2)
  final String ?mode; 
  @HiveField(3)
  final String ?id;
  @HiveField(4)
  final String ?userId;
  
  HiveTrip({required this.date, required this.destination, this.mode, this.id, this.userId});
}