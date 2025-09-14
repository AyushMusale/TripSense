class Trip {
  final String date;
  final String destination;
  final String ?mode; 
  final String ?id;
  final String ?errormsg;

  Trip({required this.date, required this.destination, this.mode, this.id, this.errormsg });
}