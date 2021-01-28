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
  const [perTeam, setPerTeam] = useState([]);

  useEffect(() => {
    async function anyNameFunction() {
      const x = await getData(teams, ignoreRepos);

      // const z = await groupByRepo(teams[0], ignoreRepos);

      const y = await Promise.all(
        teams.map((q) => groupByRepo(q, ignoreRepos))
      );
      const yy = teams.map((x, i) => ({ name: x, prs: [
        {
          data: Object.entries(y[i]),
        },
      ] }));

      // console.table(x);

      console.log(y);
      setPerTeam(yy);

      setData([
        {
          data: Object.entries(x),
        },
      ]);
    }
    anyNameFunction();
  }, []);

  const axes = [
    { primary: true, type: "ordinal", position: "bottom"},
    { type: "linear", position: "left" },
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

      <hr />

      {perTeam.length &&
        perTeam.map((team) => (
          <div key={team}>
            <h2>{team.name}</h2>
            <div
              style={{
                width: "400px",
                height: "300px",
              }}
            >
              {data && (
                <Chart
                  tooltip
                  data={team.prs}
                  axes={axes}
                  series={{ type: "bar" }}
                />
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

export default App;
