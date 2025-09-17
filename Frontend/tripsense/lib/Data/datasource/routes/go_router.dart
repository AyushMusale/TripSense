import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:tripsense/Data/datasource/routes/go_route_constants.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/auth_handler.dart';
import 'package:tripsense/Presentation/bloc/state/auth_state.dart';
import 'package:tripsense/Presentation/pages/homepage.dart';
import 'package:tripsense/Presentation/pages/mytripspage.dart';
import 'package:tripsense/Presentation/pages/navigationpage.dart';
import 'package:tripsense/Presentation/pages/signinpage.dart';
import 'package:tripsense/Presentation/pages/signuppage.dart';

class Approuter {
  GoRouter goRouter = GoRouter(
    initialLocation: '/',

    redirect: (BuildContext context, GoRouterState state){
      final authState = context.read<AuthBloc>().state;
      String currentPath = state.matchedLocation;
      if(authState is AuthSuccess){
        if(currentPath == '/signin' || currentPath == '/signup' || currentPath == '/'){
          return '/navigation';
        }
      }
      if(authState is AuthInitial || authState is AuthFailure){
        if(currentPath != '/signin' || currentPath != '/signip'){
          return '/signin';
        }
      }
      return null;
    },

    routes: [
      GoRoute(
        name: Routes.signinpage,
        path: Routes.signinpage,
        builder: (context, state) => Signinpage(),
      ),
      GoRoute(
        name: Routes.signuppage,
        path: Routes.signuppage,
        builder: (context, state) => Signuppage(),
      ),
      GoRoute(
        name: Routes.navigationpage,
        path: Routes.navigationpage,
        pageBuilder:
            (context, state) => const MaterialPage(child: Navigationpage()),
      ),
      GoRoute(
        name: Routes.homepage,
        path: Routes.homepage,
        pageBuilder:
            (context, state) => const MaterialPage(child: Homepage()),
      ),
      GoRoute(
        name: Routes.mytripspage,
        path: Routes.mytripspage,
        pageBuilder:
            (context, state) => const MaterialPage(child: MytripsPage()),
      ),
    ],
  );
}
