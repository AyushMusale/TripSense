import 'package:tripsense/Domain/enities/trip.dart';

abstract class TripcreationState {}

class TripCreationInitial extends TripcreationState{}

class TripCreationSuccess extends TripcreationState{
  final Trip trip;
  TripCreationSuccess(this.trip);
}

class TripCreationFailed extends TripcreationState{
  final String ?error;
  TripCreationFailed(this.error);
}

class TripCreationInproccess extends TripcreationState{}