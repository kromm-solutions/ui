import { GitHubStars } from "@/components/home/github-stars";
import { getStargazerCount } from "@/lib/github";

export const NavItemGithub = async () => {
  const stargazersCount = await getStargazerCount();

  return <GitHubStars stargazersCount={stargazersCount} />;
};
