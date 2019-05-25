import { ActionReducer, Action } from '@ngrx/store';
import * as users from '../actions/actions';
import { UsersState, getInitialState } from '../state';

const INITIAL_STATE = getInitialState();

export const reducer = (state: UsersState = INITIAL_STATE, action: users.UsersActions) => {
  switch (action.type) {
    case users.UsersActionsType.GET_USERS: {
      return state.getUsers();
    }
    case users.UsersActionsType.GET_USERS_SUCCESS: {
      return state.getUsersSuccess(action.payload);
    }
    case users.UsersActionsType.GET_USERS_ERROR: {
      return state.getUsersError(action.payload);
    }
    case users.UsersActionsType.SIGN_IN: {
      return state.signIn();
    }
    case users.UsersActionsType.SIGN_IN_SUCCESS: {
      return state.signInSuccess(action.payload);
    }
    case users.UsersActionsType.SIGN_IN_ERROR: {
      return state.signInError(action.payload);
    }
    case users.UsersActionsType.SIGN_UP: {
      return state.signUp();
    }
    case users.UsersActionsType.SIGN_UP_SUCCESS: {
      return state.signUpSuccess(action.payload);
    }
    case users.UsersActionsType.SIGN_UP_ERROR: {
      return state.signUpError(action.payload);
    }
    case users.UsersActionsType.SET_CURRENT_USER: {
      return state.setCurrentUser(action.payload);
    }
    case users.UsersActionsType.SET_USERS: {
      return state.setUsers(action.payload);
    }
    case users.UsersActionsType.RESET: {
      return getInitialState();
    }
  }

  return state;
};