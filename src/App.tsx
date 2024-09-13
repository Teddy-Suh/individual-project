import { AuthProvider } from "./context/AuthContext";
import Router from "./router/Router";

function App() {
  return (
    <AuthProvider>
      {/* 모바일 퍼스트로 우선 데스크톱에서도 md너비로 고정시켜두었습니다. */}
      <div className="bg-base-300">
        <div className="max-w-md min-h-screen mx-auto bg-base-100">
          <Router />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
