import 'package:tripsense/Data/models/mytrips.dart';

abstract class GetmytripsRepo {
  Future<MytripsModel> getmytripsfn(String email);
}