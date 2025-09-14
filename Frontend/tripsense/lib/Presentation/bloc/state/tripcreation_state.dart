abstract class TripcreationState {}

class TripCreationInitial extends TripcreationState{}

class TripCreationSuccess extends TripcreationState{}

class TripCreationFailed extends TripcreationState{
  final String ?error;
  TripCreationFailed(this.error);
}

class TripCreationInproccess extends TripcreationState{}