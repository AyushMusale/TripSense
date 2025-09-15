import "package:tripsense/Domain/enities/mytrips.dart";

abstract class MytripsState {}

class MyTripsInitialState extends MytripsState{} 

class MyTripsLoadingState extends MytripsState{} 

class MyTripsSuccessState extends MytripsState{
  final Mytrips mytrips;
  MyTripsSuccessState({required this.mytrips});
} 

class MyTripsFailureState extends MytripsState{
  final String errormsg;
  MyTripsFailureState(this.errormsg);
} 