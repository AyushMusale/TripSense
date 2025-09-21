class TripdetailsEvent {}

class Gettripbyidevent extends TripdetailsEvent{
  final String id;
  Gettripbyidevent(this.id);
}