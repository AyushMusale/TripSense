import 'package:tripsense/Data/repositories/gettripbyidrepo.dart';
import 'package:tripsense/Domain/enities/trip.dart';

class Gettripbyidusecase {
  final GettripbyidrepoImp gettripbyidrepoImp;
  Gettripbyidusecase( this.gettripbyidrepoImp);

  Future<Trip> execute(id) async{
    return await gettripbyidrepoImp.getTrip(id);
  }
}