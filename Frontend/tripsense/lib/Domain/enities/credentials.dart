

class Credentials {
  final String email;
  final String password;
  final String? id;
  final String status;

  Credentials({
    required this.email,
    required this.password,
     this.id,
    required this.status,
  });
}