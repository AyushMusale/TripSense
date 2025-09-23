
class Trip{
  final String date;
  final String destination;
  final String ?mode; 
  final String ?id;
  final String ?userId;
  final List ?members;
  
  
  Trip({required this.date, required this.destination, this.mode, this.id, this.userId, this.members});
}

