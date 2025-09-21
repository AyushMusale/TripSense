import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Domain/enities/trip.dart';
import 'package:tripsense/Domain/usecases/gettripbyidusecase.dart';
import 'package:tripsense/Presentation/bloc/events/tripdetails_event.dart';
import 'package:tripsense/Presentation/bloc/state/tripdetailsstate.dart';

class TripdetailsHandler extends Bloc<TripdetailsEvent, Tripdetailsstate>{
  final Gettripbyidusecase gettripbyidusecase;

  TripdetailsHandler( this.gettripbyidusecase): super(TripdetailsInitial()){
    on<Gettripbyidevent>((event, emit) async{
      emit(Tripdetailsloading());
      final res = await gettripbyidusecase.execute(event.id);
      emit(Tripdetailssuccess(Trip(date: res.date , destination: res.destination)));
    });
  }
}