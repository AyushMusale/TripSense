import 'package:tripsense/Domain/enities/user.dart';
import 'package:tripsense/Presentation/bloc/events/auth_event.dart';
import 'package:tripsense/Domain/usecases/signinusecase.dart';
import 'package:tripsense/Domain/usecases/signupusecase.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tripsense/Presentation/bloc/state/auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {

  final Signupusecase _signupusecase;
  final SignInUseCase _signInUseCase;

  AuthBloc(this._signupusecase, this._signInUseCase) : super(AuthInitial()) {
    on<Signuprequested>((event, emit) async {
      emit(AuthLoading());
      try {
        final res = await _signupusecase.execute(event.email, event.password);
        final status = res.status;
        if (status == 'success') {
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
          emit(AuthSuccess(User(email: res.email, id: res.id)));
        } else {
          emit(AuthFailure(status));
        }
      } catch (err) {
        emit(AuthFailure('unexepected error'));
      }
    });
  }
}
