import React, { useEffect, useState } from "react";
import { Chart } from "react-charts";
import { getData, groupByRepo } from "./GitHub";

const teams = [
  "Browse to Order",
  "Order to Cash",
  "Wear to Care",
  "Web to Store",
];

const ignoreRepos = ["gv-core-components"];

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    async function anyNameFunction() {
      const openPrsPerTeam = await Promise.all(
        teams.map((team) => groupByRepo(team, ignoreRepos))
      );

      const openPrsPerTeamObject = Object.fromEntries(
        teams.map((team, i) => [team, openPrsPerTeam[i]])
      )

      const data = openPrsPerTeam
        .flatMap((prPerTeam) => Object.keys(prPerTeam))
        .map((repo) => ({
          label: repo,
          data: teams.map((team) => [team, openPrsPerTeamObject[team][repo] ?? 0]),
        }));

      console.log({
        openPrsPerTeam,
        openPrsPerTeamObject,
        d: data,
      });

      setData(data);
    }
    anyNameFunction();
  }, []);

  const axes = [
    { primary: true, type: "ordinal", position: "bottom" },
    { type: "linear", position: "left", stacked: true },
  ];

  return (
    <div className="App">
      <div
        style={{
          width: "400px",
          height: "300px",
        }}
      >
        {data && (
          <Chart tooltip data={data} axes={axes} series={{ type: "bar" }} />
        )}
      </div>
    </div>
  );
}

export default App;
