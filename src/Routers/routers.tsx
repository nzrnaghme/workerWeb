import { Redirect } from "react-router-dom";

import Login from "../Users/Login/Index";
import Home from "../Home/index";
import UserProfile from "../Users/ProfileUser/Index";
import AddRequest from "../Registers/Requests/AddRequest";
import EditRequest from "../Registers/Requests/EditRequest";
import PrivateRoute from "../Routers/privateRoutes";
import DailyRequest from "../Registers/DailyRequestContainList";
import UserRegistry from "../Users/RegisterUser/Index";
import IncreaseWallet from "../Wallet/IncreaseWallet/index";
import MyRequestList from "../Registers/MyRequestList/Index";
import DetailRequest from "../Registers/Detail";
import MyCurrentRequestList from "../Registers/MyCurrentList/Index";
import MyCurrentServantRequest from "../Registers/MyCurrentServantRequest/Index";
import MyServantRequest from "../Registers/MyServantList/Index";
import DetailRequestClient from "../Registers/MyRequestList/Components/Servant";
import RequestConfirm from "../RequestConfirm/index";
import WaitingToArrived from "../Registers/WaitingToArrived/index";
import Survey from "../Survey/index";
import RequestWorking from "../RequestWorking/index";
import ShowConversations from "../ShowConversations/index";
import WalletTransaction from "../Wallet/WalletTransaction";
import { Switch, useLocation } from "react-router-dom";
import AboutUs from "../StaticPages/AboutUs";
import UsageGuide from "../StaticPages/UsageGuide";
import FAQ from "../StaticPages/FAQ";
import Rules from "../StaticPages/Rules";
import Privacy from "../StaticPages/Privacy";
import Suggestions from "../StaticPages/Suggestions";
import Complaints from "../StaticPages/Complaints";
import SuperiorServants from "../StaticPages/SuperiorServants";
import SearchRequest from "../Registers/SearchRoot";
import WhyYootaab from "../StaticPages/WhyYootaab";
import BusyFamilyAdventures from "../StaticPages/BusyFamilyAdventures";
import SecureUsageGuide from "../StaticPages/SecureUsageGuide";
import Container from "../Components/Container";

//Temporal
import { Route as RawRoute } from "react-router";

function Route() {
  const location = useLocation();
  const isMobileHome = location.pathname === "/";

  return (
    <Container
      className={`root-container ${
        isMobileHome && "mobile-root-container-home"
      }`}
    >
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute path="/Login" component={Login} />
        <PrivateRoute path="/AddRequest" component={AddRequest} />
        <PrivateRoute path="/EditRequest/:requestId" component={EditRequest} />
        <PrivateRoute path="/RequestList" component={DailyRequest} />
        <PrivateRoute path="/RequestList/:emergancy" component={DailyRequest} />
        <PrivateRoute path="/RequestList/:suggest" component={DailyRequest} />
        <PrivateRoute path="/RegisterUser" component={UserRegistry} />
        <PrivateRoute path="/Profile" component={UserProfile} />
        <PrivateRoute path="/IncreaseWallet" component={IncreaseWallet} />
        <PrivateRoute path="/MyRequestList" component={MyRequestList} />
        <PrivateRoute path="/DetailRequest/:id" component={DetailRequest} />
        <PrivateRoute
          path="/DetailRequestClient/:id"
          component={DetailRequestClient}
        />
        <PrivateRoute
          path="/MyCurrentRequestList/"
          component={MyCurrentRequestList}
        />
        <PrivateRoute path="/MyServantRequest/" component={MyServantRequest} />
        <PrivateRoute
          path="/MyCurrentServantRequest/"
          component={MyCurrentServantRequest}
        />
        <PrivateRoute
          exact
          component={RequestConfirm}
          path="/requestconfirm/:idType/:reqConfirmId"
        />
        <PrivateRoute
          exact
          component={WaitingToArrived}
          // path=":isClient/:requestRegistrationId/:receiverId/:requestWaitingId"
          path="/WaitingToArrived/:requestConfirmId"
        />
        <PrivateRoute component={Survey} path="/survey/:reqConfirmId" />
        <PrivateRoute
          exact
          component={RequestWorking}
          path="/requestworking/:reqConfirmId"
        />
        <PrivateRoute
          exact
          component={ShowConversations}
          path="/ShowConversations/:reqConfirmId"
        />
        <PrivateRoute
          exact
          component={WalletTransaction}
          path="/WalletTransaction"
        />
        <PrivateRoute
          component={SearchRequest}
          path="/SearchRequestList/:userId/:textFilter/:rootFilter/:stateId"
        />

        {/* Temporal */}
        <RawRoute component={AboutUs} path="/about-us" exact />
        <RawRoute component={UsageGuide} path="/usage-guide" exact />
        <RawRoute component={FAQ} path="/frequently-asked-questions" exact />
        <RawRoute component={Rules} path="/rules" exact />
        <RawRoute component={Privacy} path="/privacy" exact />
        <RawRoute component={Suggestions} path="/suggestions" exact />
        <RawRoute component={Complaints} path="/complaints" exact />
        <RawRoute
          component={SuperiorServants}
          path="/superior-servants"
          exact
        />
        <RawRoute component={WhyYootaab} path="/why-yootaab" exact />
        <RawRoute
          component={BusyFamilyAdventures}
          path="/busy-family-adventures"
          exact
        />
        <RawRoute
          component={SecureUsageGuide}
          path="/secure-usage-guide"
          exact
        />

        <Redirect to="/" />
      </Switch>
    </Container>
  );
}
export default Route;
