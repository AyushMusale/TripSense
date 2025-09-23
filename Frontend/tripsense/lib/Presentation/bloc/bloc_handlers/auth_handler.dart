import 'package:tripsense/Domain/enities/user.dart';
import 'package:tripsense/Presentation/bloc/events/auth_event.dart';
import 'package:tripsense/Domain/usecases/signinusecase.dart';
import 'package:tripsense/Domain/usecases/signupusecase.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Presentation/bloc/state/auth_state.dart';
import 'package:hive_flutter/hive_flutter.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final Signupusecase _signupusecase;
  final SignInUseCase _signInUseCase;

  AuthBloc(this._signupusecase, this._signInUseCase)
    : super(_checkInitialAuthState()) {
    on<Signuprequested>((event, emit) async {
      emit(AuthLoading());
      try {
        final res = await _signupusecase.execute(event.email, event.password);
        final status = res.status;
        if (status == 'true') {
          emit(AuthSuccess(User(email: res.email, id: res.id)));
        } else if (status == 'error') {
          emit(AuthFailure(status));
        }
      } catch (e) {
        emit(AuthFailure('unexpeted error'));
      }
    });

    on<SignInrequested>((event, emit) async {
      emit(AuthLoading());
      try {
        final res = await _signInUseCase.execute(event.email, event.password);
        final status = res.status;
        if (status == 'success') {
          var box = Hive.box('authBox');
          await box.put('jwtToken', res.id);
          await box.put('email', res.email);
          await box.put('id', res.id);
          emit(AuthSuccess(User(email: res.email, id: res.id)));
        } else {
          emit(AuthFailure(status));
        }
      } catch (err) {
        emit(AuthFailure('unexepected error'));
      }
    });

    on<SignOutrequested>((event, emit)async{
      emit(AuthLoading());
      try{
      var box = Hive.box('authBox');
      await box.clear();
      emit(AuthInitial());
      }
      catch(err){
        emit(AuthInitial());
      }
    });

  }
  static AuthState _checkInitialAuthState() {
    var box = Hive.box('authBox');
    String? token = box.get('jwtToken');
    String? email = box.get('email');
    String? id = box.get('id');
    if (token != null && token.isNotEmpty) {
      return (AuthSuccess(User(email: email, id: id)));
    } else {
      return (AuthInitial());
    }
  }
}
