import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:tripsense/Data/datasource/routes/go_route_constants.dart';
import 'package:tripsense/Presentation/pages/homepage.dart';
import 'package:tripsense/Presentation/pages/mytripspage.dart';
import 'package:tripsense/Presentation/pages/navigationpage.dart';
import 'package:tripsense/Presentation/pages/signinpage.dart';
import 'package:tripsense/Presentation/pages/signuppage.dart';

class Approuter {
  GoRouter goRouter = GoRouter(
    initialLocation: '/signin',
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
