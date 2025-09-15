class Tripmodel {
  final String date;
  final String destination;
  final String ?mode; 
  final String ?id;
  final String ?errormsg;
  final String ?userId;

  Tripmodel({required this.date, required this.destination, this.mode, this.id, this.errormsg, this.userId});
}