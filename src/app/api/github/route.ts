import { initSDK } from "@opensdks/runtime";
import githubSdkDef, { GithubSDKTypes } from "@opensdks/sdk-github";

type Commit = GithubSDKTypes["components"]["schemas"]["commit"];
const github = initSDK(githubSdkDef, {});

export async function POST(req: Request) {
  const { prLink } = await req.json()
  const prUrl = new URL(prLink);
  const [, owner, repo, , prNumber] = prUrl.pathname.split("/");
  const data = await github.GET("/repos/{owner}/{repo}/pulls/{pull_number}/commits", {
    params: {
      path: { owner, repo, pull_number: Number(prNumber) },
    },
  })
  return Response.json({data})
}