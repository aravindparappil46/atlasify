import type { Account, AtlasifyNotification, Link } from '../types';
import type { Repository, SubjectUser } from './api/types';
import { openExternalLink } from './comms';
import { Constants } from './constants';

export function openGitifyRepository() {
  openExternalLink(`https://github.com/${Constants.REPO_SLUG}` as Link);
}

export function openGitifyReleaseNotes(version: string) {
  openExternalLink(
    `https://github.com/${Constants.REPO_SLUG}/releases/tag/${version}` as Link,
  );
}

export function openMyNotifications() {
  const url = new URL(Constants.ATLASSIAN_WEB.MY_NOTIFICATIONS);
  openExternalLink(url.toString() as Link);
}

export function openMyIssues() {
  const url = new URL(Constants.ATLASSIAN_WEB.MY_NOTIFICATIONS);
  openExternalLink(url.toString() as Link);
}

export function openMyPullRequests() {
  const url = new URL(Constants.ATLASSIAN_WEB.MY_NOTIFICATIONS);
  openExternalLink(url.toString() as Link);
}

export function openAccountProfile(account: Account) {
  const url = new URL(`https://team.atlassian.com/people/${account.user.id}`);
  openExternalLink(url.toString() as Link);
}

export function openUserProfile(user: SubjectUser) {
  openExternalLink(user.html_url);
}

export function openRepository(repository: Repository) {
  openExternalLink(repository.html_url);
}

export async function openNotification(notification: AtlasifyNotification) {
  openExternalLink(notification.entity.url);
}
