export const siteConfig = {
  author: 'Wen Jie',
  title: 'Wen Jie',
  subtitle: 'Vitesse theme for Astro, supports Vue and UnoCSS.',
  description: 'Wen Jie\'s personal website',
  image: {
    src: '/hero.jpg',
    alt: 'Website Main Image',
  },
  email: 'behwenjie@u.nus.edu',
  socialLinks: [
    {
      text: 'GitHub',
      href: 'https://github.com/wenjebs',
      icon: 'i-simple-icons-github',
      header: 'i-ri-github-line',
    },
    {
      text: 'Linkedin',
      href: 'https://www.linkedin.com/in/wenjiebeh/',
      icon: 'i-simple-icons-linkedin',
    },
  ],
  header: {
    logo: {
      src: '/favicon.svg',
      alt: 'Logo Image',
    },
    navLinks: [
      {
        text: 'Blog',
        href: '/blog',
      },
      // {
      //   text: 'Notes',
      //   href: '/blog/notes',
      // },
      {
        text: 'Projects',
        href: '/projects',
      },
    ],
  },
  page: {
    blogLinks: [
      {
        text: 'Blog',
        href: '/blog',
      },
      // {
      //   text: 'Notes',
      //   href: '/blog/notes',
      // },
    ],
  },
  footer: {
    navLinks: [
      // {
      //   text: 'Posts Props',
      //   href: '/posts-props',
      // },
      // {
      //   text: 'Markdown Style',
      //   href: '/md-style',
      // },
      // {
      //   text: 'View on Astro',
      //   href: 'https://astro.build/themes/details/vitesse-theme-for-astro/',
      // },
      // {
      //   text: 'GitHub Repository',
      //   href: 'https://github.com/kevinwong865/astro-theme-vitesse',
      // },
    ],
  },
}

export default siteConfig
