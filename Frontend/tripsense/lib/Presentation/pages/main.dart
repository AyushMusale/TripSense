import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Data/repositories/authrepo.dart';
import 'package:tripsense/Domain/usecases/signinusecase.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/auth_handler.dart';
import 'package:tripsense/Presentation/pages/signinpage.dart';

void main() {
  runApp(MainApp());
}

class MainApp extends StatelessWidget {
  final AuthrepoImp _authrepoImp;
  final Signinusecase _signinusecase;
  MainApp({super.key})
    : _authrepoImp = AuthrepoImp(),
      _signinusecase = Signinusecase(AuthrepoImp());
  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [BlocProvider(create: (_) => AuthBloc(_signinusecase))],
      child: MaterialApp(home: Scaffold(body: Center(child: Signinpage()))),
    );
  }
}
