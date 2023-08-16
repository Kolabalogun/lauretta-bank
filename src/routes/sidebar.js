/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/dashboard", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Home", // name that appear in Sidebar
  },
  {
    path: "/app/spend",
    icon: "PaperIcon",
    name: "Pay",
  },
  {
    path: "/app/invest",
    icon: "FormsIcon",
    name: "Invest",
  },
  {
    path: "/app/budgets",
    icon: "ChartsIcon",
    name: "Budget",
  },
  {
    path: "/app/card",
    icon: "CardIcon",
    name: "Card",
  },
  {
    path: "/app/help",
    icon: "ChatIcon",
    name: "Help",
  },
  {
    path: "/app/settings",
    icon: "OutlineCogIcon",
    name: "Settings",
  },
  {
    path: "/app/transactions",
    icon: "OutlineCogIcon",
    name: "Transactions",
  },
  {
    path: "/app/transaction-charts",
    icon: "OutlineCogIcon",
    name: "Chart",
  },
  {
    path: "/app/transaction-tables",
    icon: "OutlineCogIcon",
    name: "Table",
  },
  // {
  //   path: "/app/admin-users",
  //   icon: "PeopleIcon",
  //   name: "Users",
  // },

  // {
  //   path: "/app/forms",
  //   icon: "FormsIcon",
  //   name: "Forms",
  // },
  // {
  //   path: "/app/cards",
  //   icon: "CardsIcon",
  //   name: "Cards",
  // },
  // {
  //   path: "/app/charts",
  //   icon: "ChartsIcon",
  //   name: "Charts",
  // },
  // {
  //   path: "/app/buttons",
  //   icon: "ButtonsIcon",
  //   name: "Buttons",
  // },
  // {
  //   path: "/app/modals",
  //   icon: "ModalsIcon",
  //   name: "Modals",
  // },
  // {
  //   path: "/app/tables",
  //   icon: "TablesIcon",
  //   name: "Tables",
  // },
  // {
  //   icon: "PagesIcon",
  //   name: "Pages",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/login",
  //       name: "Login",
  //     },
  //     {
  //       path: "/create-account",
  //       name: "Create account",
  //     },
  //     {
  //       path: "/forgot-password",
  //       name: "Forgot password",
  //     },
  //     {
  //       path: "/app/404",
  //       name: "404",
  //     },
  //     {
  //       path: "/app/blank",
  //       name: "Blank",
  //     },
  //   ],
  // },
];

export default routes;
