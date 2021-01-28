import { Token } from "./Token";

async function getGHData(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${Token}`,
    },
  });

  return response.json();
}

export async function getData(teams, ignoreRepos) {
  const allTeams = await getGHData(
    "https://api.github.com/orgs/GrandVisionHQ/teams"
  );

  const result = {};

  for (const team of teams) {
    const { repositories_url } = allTeams.find(({ name }) => name === team);
    const repos = await getGHData(repositories_url);

    const promises = repos
      .filter(({ name }) => !ignoreRepos.includes(name))
      .map(({ pulls_url }) => getGHData(pulls_url.replace("{/number}", "")));

    const prPerRepo = await Promise.all(promises);

    result[team] = prPerRepo.flat().filter(({ draft }) => !draft).length;
  }

  return result;
}

export async function groupByRepo(team, ignoreRepos) {
  const allTeams = await getGHData(
    "https://api.github.com/orgs/GrandVisionHQ/teams"
  );

  const { repositories_url } = allTeams.find(({ name }) => name === team);
  const repos = (await getGHData(repositories_url)).filter(
    ({ name }) => !ignoreRepos.includes(name)
  );

  const open = repos.map(({ pulls_url }) =>
    getGHData(pulls_url.replace("{/number}", ""))
  );
  
  const prPerRepo = (await Promise.all(open)).map(
    (x, i) => ({
      name: repos[i].name,
      n: x.filter(({ draft }) => !draft).length
    })
  ).filter(({n})=> n > 0).map(x => [x.name, x.n]);

  return Object.fromEntries(prPerRepo);

}
