type DayInfo = {
  day: string;
  name: string;
  path: string;
  date: string;
};

const ROUTES: DayInfo[] = [
  {
    day: "001",
    name: "Stack Up",
    path: "/001",
    date: "28/10/2021",
  },
  {
    day: "002",
    name: "Canvas Drawing (one)",
    path: "/002",
    date: "30/10/2021",
  },
  {
    day: "003",
    name: "Canvas Drawing (two)",
    path: "/003",
    date: "07/11/2021",
  },
  {
    day: "004",
    name: "Hex grid (flat)",
    path: "/004",
    date: "19/11/2021",
  },
  {
    day: "005",
    name: "Hex grid (Pointy)",
    path: "/005",
    date: "20/11/2021",
  },
];

export default ROUTES;
