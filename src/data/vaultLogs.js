export const categories = [
    { id: 'all', name: 'All' },
    { id: 'react', name: 'React' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'design', name: 'Design' },
    { id: 'css', name: 'CSS' },
    { id: 'nextjs', name: 'Next.js' }
  ];

export const vaultData = [
    {
      id: 1,
      title: "Getting Started with React Hooks",
      date: "2023-10-15",
      excerpt: "Exploring the power of React Hooks and how they simplify state management in functional components.",
      tags: ["React", "JavaScript", "Frontend"],
      category: "react",
      pinned: true,
      content: `
     \##React Hooks Overview

React Hooks allow you to use state and other features without writing a class.

###🧠Common Hooks

- \`useState\`  
- \`useEffect\`  
- \`useContext\`  

\`\`\`js
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(count);
}, [count]);
\`\`\`

[Learn more about Hooks](https://reactjs.org/docs/hooks-intro.html)
      `
    },
    {
      id: 2,
      title: "Tailwind CSS Best Practices",
      date: "2023-09-22",
      excerpt: "Tips and tricks for using Tailwind CSS efficiently in large projects.",
      tags: ["CSS", "Tailwind", "Design"],
      category: "design",
      pinned: true,
      
    },
    {
      id: 3,
      title: "Building a Portfolio with Next.js",
      date: "2023-08-05",
      excerpt: "Step-by-step guide to creating a modern portfolio using Next.js and static site generation.",
      tags: ["Next.js", "React", "Portfolio"],
      category: "nextjs",
      pinned: false
    }
  ];