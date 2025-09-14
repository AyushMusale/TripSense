import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Data/repositories/authrepo.dart';
import 'package:tripsense/Domain/usecases/signinusecase.dart';
import 'package:tripsense/Domain/usecases/signupusecase.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/auth_handler.dart';
import 'package:tripsense/Presentation/pages/navigationpage.dart';


void main() {
  runApp(MainApp());
}

class MainApp extends StatelessWidget {
  
 
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
  final AuthrepoImp authrepoImp = AuthrepoImp();
  final Signupusecase signupusecase =  Signupusecase(authrepoImp);
  final SignInUseCase signinusecase = SignInUseCase(AuthrepoImp());
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => AuthBloc(signupusecase, signinusecase ),),
      ],
      child: MaterialApp(home: Scaffold(body: Center(child: Navigationpage(),),),),
    );
  }
}
