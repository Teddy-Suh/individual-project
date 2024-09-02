import {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
} from "react";
import { User } from "firebase/auth";
import { isLogIn } from "../firebase/auth";
import { getUser } from "../firebase/user";

interface AuthState {
  user: User | null;
  nickname: string | null;
  role: string | null;
}

interface AuthAction {
  type: "LOGIN" | "LOGOUT" | "UPDATE_NICKNAME" | "UPDATE_ROLE";
  payload?: Partial<AuthState>;
}

interface AuthContextProps {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}

const initialState = {
  user: null,
  nickname: null,
  role: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        ...action.payload,
      };
    case "LOGOUT":
      return { ...state, user: null, nickname: null, role: null };
    case "UPDATE_NICKNAME":
      return { ...state, nickname: action.payload?.nickname || state.nickname };
    case "UPDATE_ROLE":
      return { ...state, role: action.payload?.role || state.role };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextProps>({
  state: initialState,
  dispatch: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = isLogIn(async (user) => {
      if (user) {
        const userData = await getUser(user.uid);
        dispatch({
          type: "LOGIN",
          payload: {
            user: user,
            nickname: userData?.nickname,
            role: userData?.role,
          },
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
