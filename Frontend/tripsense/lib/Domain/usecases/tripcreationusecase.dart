import 'package:tripsense/Data/repositories/tripcreationrepo.dart';
import 'package:tripsense/Data/models/trip.dart';

class Tripcreationusecase {
  final TripcreationrepoImp tripcreationrepoImp;
  Tripcreationusecase({required this.tripcreationrepoImp});

  Future<Tripmodel> execute(String date, String destination) async{
    return await tripcreationrepoImp.tripcreationfn(date, destination);
  }
}