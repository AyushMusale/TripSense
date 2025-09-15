import 'package:tripsense/Data/models/mytrips.dart';
import 'package:tripsense/Data/repositories/getmytrips_repo.dart';

class Getmytripsusecase {
  final GetmytripsRepoImp getmytripsRepoImp;
  Getmytripsusecase(this.getmytripsRepoImp);

  Future<MytripsModel> execute(String email) async{
    return await getmytripsRepoImp.getmytripsfn(email);
  }
}