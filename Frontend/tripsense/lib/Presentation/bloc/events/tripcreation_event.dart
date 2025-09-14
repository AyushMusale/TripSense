
abstract class TripEvents{}

class TripcreationEvent extends TripEvents{
  final String date;
  final String destination;
  TripcreationEvent({
    required this.date,
    required this.destination,
  });

}