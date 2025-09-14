import 'package:tripsense/Data/repositories/tripcreationrepo.dart';
import 'package:tripsense/Domain/enities/trip.dart';

class Tripcreationusecase {
  final TripcreationrepoImp tripcreationrepoImp;
  Tripcreationusecase({required this.tripcreationrepoImp});

  Future<Trip> execute(String date, String destination) async{
    return await tripcreationrepoImp.tripcreationfn(date, destination);
  }
}