import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Domain/enities/user.dart';
import 'package:tripsense/Presentation/bloc/bloc_handlers/auth_handler.dart';
import 'package:tripsense/Presentation/bloc/state/auth_state.dart';

class Mapwidgets extends StatelessWidget {
  const Mapwidgets({super.key});

  @override
  Widget build(BuildContext context) {
    final authState = context.watch<AuthBloc>().state;
    User ?currentUser;

    if(authState is AuthSuccess){
      currentUser = authState.user;
    }

    String userDeatils(){
      if(currentUser?.email != null){
          return currentUser!.email!;
      }
      else{
        return "none";
      }
    }

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [Text(userDeatils())],
    );
  }
}
