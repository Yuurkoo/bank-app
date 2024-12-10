import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import WellcomePage from "./page/wellcome-page/Wellcome";
import SignUpPage from "./page/sign-up/SignUp";
import SignInPage from "./page/sign-in/SignIn";
import Recovery from "./page/recovery/Recovery";
import SignupConfirm from "./page/signup-confirm/SignUpConfirm";
import RecoveryConfirm from "./page/recovery-confirm/RecoveryConfirm";
import Balance from "./page/balance/Balance";
import SendPage from "./page/send-pending/SendPage";
import RecivePage from "./page/recive-pending/RecivePage";
import SettingsPage from "./page/settings-page/SettingsPage";
import NoticfictionsPage from "./page/noticfiction-page/NoticfictionsPage";
import ErrorPage from "./page/error-page/ErrorPage";
import TransactionDetails from "./page/transaction/TransactionDetails";

// ===========================================================

// Типи дій для редюсера
type AuthAction =
  | { type: "LOGIN"; payload: { token: string; user: any } }
  | { type: "LOGOUT" };

// Стан аутентифікації
interface AuthState {
  token: string | null;
  user: any | null;
}

// Ініціальний стан
const initialAuthState: AuthState = {
  token: null,
  user: null,
};

// Редюсер для управління станом аутентифікації
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { token: action.payload.token, user: action.payload.user };
    case "LOGOUT":
      return { token: null, user: null };
    default:
      return state;
  }
};

// Створюємо контекст аутентифікації
interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контексту аутентифікації
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Компонент, що перевіряє наявність токена для захищених сторінок
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useContext(AuthContext);

  if (!auth || !auth.state.token) {
    // Якщо токен відсутній, перенаправляємо на сторінку входу
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
};

// Компонент для сторінок, доступних без аутентифікації
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth && auth.state.token) {
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  return <>{children}</>;
};

// Інші компоненти
const WellcomeWithNavigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <WellcomePage
      onSignUpClick={() => navigate("/signup")}
      onSignInClick={() => navigate("/signin")}
    />
  );
};

const Signup: React.FC = () => (
  <div className="App-header">
    <SignUpPage description={"Choose a registration method"} />
  </div>
);

const SignUpConfirm: React.FC = () => (
  <div className="App-header">
    <SignupConfirm />
  </div>
);

const Signin: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (auth) {
      auth.dispatch({
        type: "LOGIN",
        payload: { token: "example-token", user: { name: "User" } },
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="App-header">
      <SignInPage description={"Select login method"} onLogin={handleLogin} />
    </div>
  );
};

const Recover: React.FC = () => (
  <div className="App-header">
    <Recovery description={"Choose a recovery method"} />
  </div>
);

const RecoverConfirm: React.FC = () => (
  <div className="App-header">
    <RecoveryConfirm description={"Choose a recovery method"} />
  </div>
);

const Dashboard: React.FC = () => (
  <div className="App-header">
    <div
      className="balance-main"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Balance title={"Main wallet"} />
    </div>
  </div>
);

const SendPending: React.FC = () => (
  <div className="App-header">
    <SendPage />
  </div>
);

const Settings: React.FC = () => {
  const auth = useContext(AuthContext); // Доступ до контексту аутентифікації

  if (!auth) {
    return <div>Error: Auth context not found</div>;
  }

  return (
    <div className="App-header">
      <SettingsPage />
    </div>
  );
};

const Noticfictions: React.FC = () => (
  <div className="App-header">
    <NoticfictionsPage />
  </div>
);

const RecivePending: React.FC = () => (
  <div className="App-header">
    <RecivePage />
  </div>
);

const Error: React.FC = () => (
  <div className="App-header">
    <ErrorPage />
  </div>
);
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            index
            path="/"
            element={
              <AuthRoute>
                <WellcomeWithNavigation />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            }
          />
          <Route
            path="/signup-confirm"
            element={
              <AuthRoute>
                <SignUpConfirm />
              </AuthRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <AuthRoute>
                <Signin />
              </AuthRoute>
            }
          />
          <Route path="/recovery" element={<Recover />} />
          <Route
            path="/balance"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/recovery-confirm" element={<RecoverConfirm />} />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Noticfictions />
              </PrivateRoute>
            }
          />
          <Route
            path="/recive"
            element={
              <PrivateRoute>
                <RecivePending />
              </PrivateRoute>
            }
          />
          <Route
            path="/send"
            element={
              <PrivateRoute>
                <SendPending />
              </PrivateRoute>
            }
          />

          <Route
            path="/transaction/:transactionId"
            element={
              <PrivateRoute>
                <TransactionDetails />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
