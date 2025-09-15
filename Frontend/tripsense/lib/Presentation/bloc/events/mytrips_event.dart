class MytripsEvent {}

class GetmyTripsEvent extends MytripsEvent{
  final String email;
  GetmyTripsEvent(this.email);
}