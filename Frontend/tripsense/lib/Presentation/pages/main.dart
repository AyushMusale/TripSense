import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Data/repositories/authrepo.dart';
import 'package:tripsense/Data/repositories/getmytrips_repo.dart';
import 'package:tripsense/Data/repositories/tripcreationrepo.dart';
import 'package:tripsense/Domain/usecases/getmytripsusecase.dart';
import 'package:tripsense/Domain/usecases/signinusecase.dart';
import 'package:tripsense/Domain/usecases/signupusecase.dart';
import 'package:tripsense/Domain/usecases/tripcreationusecase.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/auth_handler.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/mytrips_handler.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/tripcreation_handler.dart';
import 'package:tripsense/Presentation/pages/signinpage.dart';


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

  final TripcreationrepoImp tripcreationrepoImp = TripcreationrepoImp();
  final Tripcreationusecase tripcreationusecase = Tripcreationusecase(tripcreationrepoImp: tripcreationrepoImp);

  final GetmytripsRepoImp getmytripsRepoImp = GetmytripsRepoImp();
  final Getmytripsusecase getmytripsusecase = Getmytripsusecase(getmytripsRepoImp);

    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => AuthBloc(signupusecase, signinusecase ),),
        BlocProvider(create: (_)=> TripcreationHandler(tripcreationusecase),),
        BlocProvider(create: (_)=> MytripsHandler(getmytripsusecase),),
      ],
      child: MaterialApp(home: Scaffold(body: Center(child: Signinpage(),),),),
    );
  }
}
