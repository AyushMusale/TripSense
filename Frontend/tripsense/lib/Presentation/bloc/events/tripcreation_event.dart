
abstract class TripEvents{}

class TripcreationEvent extends TripEvents{
  final String date;
  final String destination;
  final String email;
  TripcreationEvent({
    required this.date,
    required this.destination,
    required this.email,
  });

}