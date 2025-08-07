import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UserForm from "./Components/UserForm/UserForm";
import AdminForm from "./Components/AdminForm/AdminForm";
import GameUI from "./Components/GameUI/GameUI"; // Import the new GameUI component
import { DataProvider } from "./GameContext";
import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    levelReached: "0",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isReady, setIsReady] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isReady > 0) {
      postData();
    }
  }, [isReady]);

  const postData = async () => {
    try {
      const updatedFormData = {
        ...formData,
        levelReached: isReady.toString(),
      };
      setFormData(updatedFormData);

      console.log("Posting form data:", updatedFormData);

      const response = await axios.post(`http://localhost:3002`, updatedFormData);

      if (response.data.success) {
        console.log("User data saved successfully:", response.data);
      } else {
        console.error("Failed to save user data:", response.data.message);
      }
    } catch (error) {
      console.error("Error posting user data:", error);
    }
  };

  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              formSubmitted ? (
                <DataProvider>
                  {/* Render the GameUI component here */}
                  <GameUI isReady={isReady} setIsReady={setIsReady} />
                </DataProvider>
              ) : (
                <UserForm
                  formData={formData}
                  setFormData={setFormData}
                  setIsRunning={setIsRunning}
                  setFormSubmitted={setFormSubmitted}
                />
              )
            }
          />
          <Route path="/RMoney/Admin" component={AdminForm} />
        </Switch>
      </Router>
    </>
  );
};

export default App;