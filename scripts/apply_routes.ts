import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace setModal with navigate for policy links
app = app.replace("act:()=>setModal('about')", "act:()=>navigate('/about')");
app = app.replace("act:()=>setModal('privacy')", "act:()=>navigate('/privacy')");
app = app.replace("act:()=>setModal('terms')", "act:()=>navigate('/terms')");

// Also for the bottom footer links
app = app.replace("onClick={()=>setModal(m)}", "onClick={()=>navigate('/' + m)}");

// Now we need to handle the routing rendering!
// We can just add Route components to App.tsx
// But wait, the app structure currently renders Calculator or Home based on activeCategory
// And Modals based on modal state.
// We can just add a hook to parse the route and render the modal components.
const routeLogic = `
  const isPrivacyRoute = location.pathname === '/privacy';
  const isTermsRoute = location.pathname === '/terms';
  const isAboutRoute = location.pathname === '/about';

  // Replace modal render
  const currentModal = isPrivacyRoute ? 'privacy' : isTermsRoute ? 'terms' : isAboutRoute ? 'about' : modal;
`;

app = app.replace("const [modal,          setModal]          = useState<'privacy'|'about'|'terms'|'history'|null>(null);", 
  "const [modal,          setModal]          = useState<'privacy'|'about'|'terms'|'history'|null>(null);\n" + routeLogic);

app = app.replace(/\{modal==='history'\?/g, "{currentModal==='history'?");
app = app.replace(/modal==='privacy'\?/g, "currentModal==='privacy'?");
app = app.replace(/modal==='terms'\?/g, "currentModal==='terms'?");
app = app.replace(/modal==='about'\?/g, "currentModal==='about'?");

fs.writeFileSync('src/App.tsx', app);
