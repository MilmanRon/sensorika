# assets/

Images/icons that should go through Astro's build-time image optimization: `import logo from '../assets/logo.svg'` then `<Image src={logo} ... />`.

Anything that must be served as-is at a fixed URL (favicon, robots.txt, files linked directly) goes in `/public` instead, not here.
