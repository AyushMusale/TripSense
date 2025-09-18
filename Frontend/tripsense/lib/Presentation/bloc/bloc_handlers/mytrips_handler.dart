import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Domain/enities/mytrips.dart';
import 'package:tripsense/Domain/usecases/getmytripsusecase.dart';
import 'package:tripsense/Presentation/bloc/events/mytrips_event.dart';
import 'package:tripsense/Presentation/bloc/state/mytrips_state.dart';

class MytripsHandler extends Bloc<MytripsEvent, MytripsState>{
  final Getmytripsusecase getmytripsusecase;
  MytripsHandler(this.getmytripsusecase): super(MyTripsInitialState()){
      on<GetmyTripsEvent>((event, emit)  async{
        emit(MyTripsLoadingState());
        try{
            final res = await getmytripsusecase.execute(event.email);
            emit(MyTripsSuccessState(mytrips: Mytrips(mytripslist: res.mytripsList)));
        }
        catch(err){
          emit(MyTripsFailureState("could not load trips"));
        }
      });
  }
}