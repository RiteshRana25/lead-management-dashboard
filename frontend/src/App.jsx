import { useState } from "react";
import Login from "./components/Login";
import LeadsTable from "./components/LeadsTable";
import Analytics from "./components/Analytics";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />;

  return (
    <div style={{ display: "flex", gap: "50px" }}>
      <div>
        <LeadsTable/>
        <Analytics />
      </div>
    </div>
  );
}

export default App;
