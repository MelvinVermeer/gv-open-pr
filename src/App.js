import React, { useEffect, useState } from "react";
import { Chart } from "react-charts";
import { getOpenPrsPerTeam } from "./GitHub";

const teams = [
  "Browse to Order",
  "Order to Cash",
  "Wear to Care",
  "Web to Store",
];

const ignoreRepos = ["gv-core-components"];

const handleOnClick = (e) => {
  window.open(`https://github.com/GrandVisionHQ/${e.seriesLabel}/pulls?q=is%3Apr+is%3Aopen+draft%3Afalse`)
}

function convertToChartDataSet(result) {
  const repos = [
    ...new Set(
      Object.values(result).flatMap((prPerTeam) => Object.keys(prPerTeam))
    ),
  ];

  return repos.map((repo) => ({
    label: repo,
    data: teams.map((team) => [team, result[team][repo] ?? 0]),
  }));
}

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    async function anyNameFunction() {
      const result = await getOpenPrsPerTeam(teams, ignoreRepos);
      console.log(result)
      setData(convertToChartDataSet(result));
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
          <Chart tooltip data={data} axes={axes} series={{ type: "bar" }} onClick={handleOnClick} />
        )}
      </div>
    </div>
  );
}

export default App;
