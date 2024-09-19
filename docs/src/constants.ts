export const SITE_URL = import.meta.env.SITE_URL || 'http://localhost:3000';

export const siteMetadata = {
  title: 'Atlassify',
  description: 'Your Atlassian notifications on your menu bar.',
  repo: 'setchy/atlassify',
  keywords:
    'atlassify,desktop,application,atlassian,notifications,unread,menu bar,electron,open source,setchy,mac,osx',
  author: {
    name: 'Adam Setch (@setchy)',
    site: 'https://setchy.io',
  },
  menuLinks: [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'FAQ',
      path: '/faq',
    },
  ],
};

export const manifest = {
  name: 'Atlassify',
  short_name: 'starter',
  themeColor: '#24292e',
  display: 'minimal-ui',
};
