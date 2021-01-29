// make sure you have this file on your disk, and it looks like:
// export const Token = "xxxxx"; // <-- you github access token 
import { Token } from "./Token"; 

async function getGHData(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${Token}`, 
    },
  });

  return response.json();
}

async function groupByRepo(team, ignoreRepos) {
  const allTeams = await getGHData(
    "https://api.github.com/orgs/GrandVisionHQ/teams"
  );

  const { repositories_url } = allTeams.find(({ name }) => name === team);
  const repos = (await getGHData(repositories_url)).filter(
    ({ name }) => !ignoreRepos.includes(name)
  );

  const reposPrs = repos.map(({ pulls_url }) =>
    getGHData(pulls_url.replace("{/number}", ""))
  );

  const prPerRepo = (await Promise.all(reposPrs))
    .map((prs, i) => ({
      repoName: repos[i].name,
      openPrCount: prs.filter(({ draft }) => !draft).length,
    }))
    .filter(({ openPrCount }) => openPrCount > 0)
    .map((x) => [x.repoName, x.openPrCount]);

  return Object.fromEntries(prPerRepo);
}

export async function getOpenPrsPerTeam(teams, ignoreRepos) {
  const openPrsPerTeam = await Promise.all(
    teams.map((team) => groupByRepo(team, ignoreRepos))
  );

  return Object.fromEntries(
    teams.map((team, i) => [team, openPrsPerTeam[i]])
  );
}
