const { Octokit } = require("@octokit/rest");
// const { createActionAuth } = require("@octokit/auth-action");
// const auth = createActionAuth();

async function assignReviewers(org,repo, prNumber, category) {
  const octokit = new Octokit({
    // auth: secrets.GH_TOKEN,
    auth: process.env.TOKEN
    // authentication : await auth()
  });
  try {
    // const { data: prData } = await octokit.pulls.get({
    //   owner: repo.split("/")[0],
    //   repo: repo.split("/")[1],
    //   pull_number: prNumber
    // });

    const { data: teams } = await octokit.request('GET /orgs/{org}/teams',({
      headers: {
        authorization: auth.token,
        'X-GitHub-Api-Version': '2022-11-28'
      },
      org: org,
    }));

    if(teams.length == 0){
      console.log(`No team found for the organisation"${org}".`);
      return;
    }
    const teamSlugs = teams.map((team) => team.slug);
    // console.log(`Teams assigned successfully: ${teams.name.join(", ")}`);
    // const team_updated = teams.filter((team) => team.slug.startsWith("sdk") && team.slug.endsWith("maintainers"));
    // const team_Slugs_updated = team_updated.map((team) => team.slug);
    // console.log(`Teams assigned successfully: ${teamSlugs.join(", ")}`);
    // console.log(`Teams assigned successfully: ${team_Slugs_updated.join(", ")}`);
    // const teamSlugs_map = assignedTeams.map((team) => team.slug);
    if(category === "SDKs" || category === "Specification"){
    const team_updated = teams.filter((team) => team.slug.startsWith("sdk") && team.slug.endsWith("maintainers"));
    const team_Slugs_updated = team_updated.map((team) => team.slug);
    await octokit.pulls.requestReviewers({
      owner: repo.split("/")[0],
      repo: repo.split("/")[1],
      pull_number: prNumber,
      team_reviewers: team_Slugs_updated
    });
    console.log(`Teams assigned successfully.`);
    } else if(category == "OpenFeature Operator" || category == "Flagd"){
    const team_updated = teams.filter((team) => team.slug.startsWith("cloud-native") && team.slug.endsWith("maintainers"));
    const team_Slugs_updated = team_updated.map((team) => team.slug);
    await octokit.pulls.requestReviewers({
      owner: repo.split("/")[0],
      repo: repo.split("/")[1],
      pull_number: prNumber,
      team_reviewers: team_Slugs_updated
    });
    console.log(`Teams assigned successfully.`);
    }else {
          console.log(`No team found for the category "${category}".`);
        }
  }catch (error) {
    console.error("An error occurred:", error);
  }
}
// Usage example
const org = "open-feature";
const repo = process.argv[2];
const prNumber = process.argv[3];
const category = process.argv[4];
// const repo = "open-feature/ofep";
// const prNumber = "issues/65";
// const category = "Specification";

assignReviewers(org, repo, prNumber, category);