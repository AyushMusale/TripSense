import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Data/datasource/routes/go_router.dart';
import 'package:tripsense/Data/repositories/authrepo.dart';
import 'package:tripsense/Data/repositories/getmytrips_repo.dart';
import 'package:tripsense/Data/repositories/gettripbyidrepo.dart';
import 'package:tripsense/Data/repositories/tripcreationrepo.dart';
import 'package:tripsense/Domain/usecases/getmytripsusecase.dart';
import 'package:tripsense/Domain/usecases/gettripbyidusecase.dart';
import 'package:tripsense/Domain/usecases/signinusecase.dart';
import 'package:tripsense/Domain/usecases/signupusecase.dart';
import 'package:tripsense/Domain/usecases/tripcreationusecase.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/auth_handler.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/mytrips_handler.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/tripcreation_handler.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/tripdetails_handler.dart';



void main() async{
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  await Hive.openBox('authBox');
  await Hive.openBox('tripbox');
  runApp(MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    final AuthrepoImp authrepoImp = AuthrepoImp();
    final Signupusecase signupusecase = Signupusecase(authrepoImp);
    final SignInUseCase signinusecase = SignInUseCase(authrepoImp);

    final TripcreationrepoImp tripcreationrepoImp = TripcreationrepoImp();
    final Tripcreationusecase tripcreationusecase = Tripcreationusecase(
      tripcreationrepoImp: tripcreationrepoImp,
    );

    final GetmytripsRepoImp getmytripsRepoImp = GetmytripsRepoImp();
    final Getmytripsusecase getmytripsusecase = Getmytripsusecase(
      getmytripsRepoImp,
    );

    final GettripbyidrepoImp gettripbyidrepoImp = GettripbyidrepoImp();
    final Gettripbyidusecase gettripbyidusecase = Gettripbyidusecase(gettripbyidrepoImp);
    final Approuter approuter = Approuter();

    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => AuthBloc(signupusecase, signinusecase)),
        BlocProvider(create: (_) => TripcreationHandler(tripcreationusecase)),
        BlocProvider(create: (_) => MytripsHandler(getmytripsusecase)),
        BlocProvider(create: (_)=> TripdetailsHandler(gettripbyidusecase)),
      ],
      child: MaterialApp.router(
        //restorationScopeId: null,
        routeInformationParser: approuter.goRouter.routeInformationParser,
        routeInformationProvider: approuter.goRouter.routeInformationProvider,
        routerDelegate: approuter.goRouter.routerDelegate,
      ),
    );
  }
}
