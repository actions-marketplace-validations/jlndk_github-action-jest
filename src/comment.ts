import { context, getOctokit } from '@actions/github';

const commentIdentifier = '<!-- generated by github-action-jest -->';

export default async function updateOrCreateComment(
  content: string,
  githubToken: string,
  identifier = commentIdentifier
): Promise<void> {
  const octokit = getOctokit(githubToken);
  const comments = await octokit.issues.listComments({
    repo: context.repo.repo,
    owner: context.repo.owner,
    issue_number: context.payload.number,
  });

  const ourOutdatedComment = comments.data.find(({ body }) => body?.includes(identifier));

  const requestData = {
    repo: context.repo.repo,
    owner: context.repo.owner,
    body: content + identifier,
  };

  if (ourOutdatedComment !== undefined) {
    await octokit.issues.updateComment({
      ...requestData,
      comment_id: ourOutdatedComment.id,
    });
  } else {
    await octokit.issues.createComment({
      ...requestData,
      issue_number: context.payload.number,
    });
  }
}
