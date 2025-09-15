import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Domain/enities/trip.dart';
import 'package:tripsense/Domain/usecases/tripcreationusecase.dart';
import 'package:tripsense/Presentation/bloc/events/tripcreation_event.dart';
import 'package:tripsense/Presentation/bloc/state/tripcreation_state.dart';

class TripcreationHandler extends Bloc<TripEvents, TripcreationState> {
  final Tripcreationusecase _tripcreationusecase;
  TripcreationHandler(this._tripcreationusecase)
    : super(TripCreationInitial()) {
    on<TripcreationEvent>((event, emit) async {
      emit(TripCreationInproccess());
      try {
        final res = await _tripcreationusecase.execute(
          event.date,
          event.destination,
        );
        final tripID = res.id;
        final error = res.errormsg;
        if (tripID != null) {
          emit(
            TripCreationSuccess(
              Trip(
                date: res.date,
                destination: res.destination,
                id: res.id,
                userId: res.userId,
              ),
            ),
          );
        } else {
          emit(TripCreationFailed(error));
        }
      } catch (err) {
        emit(TripCreationFailed("Could'nt sent create request"));
      }
    });
  }
}
