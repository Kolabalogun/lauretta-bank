import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
// const CreateProject = lazy(() => import("../pages/CreateProject"));
// const Projects = lazy(() => import("../pages/Projects"));
// const PageContents = lazy(() => import("../pages/PageContents"));
// const Users = lazy(() => import("../pages/Users"));
// const Forms = lazy(() => import("../pages/Forms"));
const Transactions = lazy(() => import("../pages/Transactions"));
const Cards = lazy(() => import("../pages/Cards"));
const Charts = lazy(() => import("../pages/Charts"));
const Table = lazy(() => import("../pages/Table"));
const ChartPage = lazy(() => import("../pages/ChartPage"));
const Buttons = lazy(() => import("../pages/Buttons"));
const Modals = lazy(() => import("../pages/Modals"));
const Tables = lazy(() => import("../pages/Tables"));
const Page404 = lazy(() => import("../pages/404"));
const Pay = lazy(() => import("../pages/Pay"));
const Budget = lazy(() => import("../pages/Budget"));
const Invest = lazy(() => import("../pages/Invest"));
const Card = lazy(() => import("../pages/Card"));
const Help = lazy(() => import("../pages/Help"));
const Settings = lazy(() => import("../pages/Settings"));

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },

  {
    path: "/spend",
    component: Pay,
  },
  {
    path: "/invest",
    component: Invest,
  },
  {
    path: "/budgets",
    component: Budget,
  },
  {
    path: "/card",
    component: Card,
  },
  {
    path: "/help",
    component: Help,
  },
  {
    path: "/settings",
    component: Settings,
  },
  {
    path: "/transactions",
    component: Transactions,
  },

  // {
  //   path: "/projects",
  //   component: Projects,
  // },
  // {
  //   path: "/create-project",
  //   component: CreateProject,
  // },
  // {
  //   path: "/edit-project/:id",
  //   component: CreateProject,
  // },
  // {
  //   path: "/page-contents",
  //   component: PageContents,
  // },
  // {
  //   path: "/admin-users",
  //   component: Users,
  // },
  // {
  //   path: "/forms",
  //   component: Forms,
  // },
  {
    path: "/cards",
    component: Cards,
  },
  {
    path: "/charts",
    component: Charts,
  },
  {
    path: "/transaction-charts",
    component: ChartPage,
  },
  {
    path: "/transaction-tables",
    component: Table,
  },
  // {
  //   path: "/buttons",
  //   component: Buttons,
  // },
  // {
  //   path: "/modals",
  //   component: Modals,
  // },
  // {
  //   path: "/tables",
  //   component: Tables,
  // },
  {
    path: "/404",
    component: Page404,
  },
  // {
  //   path: "/blank",
  //   component: Blank,
  // },
];

export default routes;
